import {existsSync} from "fs";
import {resolve as resolvePath} from "path";
import {removeCache} from "../../build/scripts";
import {getProjectPath} from "../../library/common/file-paths";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {DOCKERFILE_RUN_SPLIT} from "../base";
import {extractDeps, mergeAllDeps} from "../extract-deps-from-package";
import {systemInstall, systemUninstall} from "./system-install";

export interface customBuildArguments {
	command: string;
	target: string;
	source: string[];
	systemDeps: string[];
	rcFile: string;
	packageJson: string;
}
export interface customBuildOpt {
	options: customBuildArguments;
}

function relativePath(path: string) {
	return path.replace(/^[./]+/, '');
}

export function babelNormalizeArguments(options: customBuildArguments) {
	if (!options.source) {
		throw new Error('BabelBuild: no source folder');
	}
	if (!options.target) {
		throw new Error('BabelBuild: no target folder');
	}
	options.target = relativePath(options.target);
	if (!Array.isArray(options.source)) {
		options.source = <any>[options.source];
	}
	
	options.source = options.source.map(relativePath);
	if (!options.systemDeps) {
		options.systemDeps = [];
	}
	if (options.packageJson) {
		options.packageJson = resolvePath(getProjectPath(), options.packageJson);
		
		if (!existsSync(options.packageJson)) {
			throw new Error(`package.json file not exists: ${options.packageJson}`);
		}
	}
}

export default function custom_javascript_build(config: MicroBuildConfig) {
	const build_plugin: customBuildOpt[] = config.getPluginList(EPlugins.custom_javascript_build);
	
	if (!build_plugin || !build_plugin.length) {
		return '# custom_javascript_build plugin not enabled';
	}
	build_plugin.forEach(({options}) => {
		babelNormalizeArguments(options);
	});
	
	const deps: string[] = mergeAllDeps(true, ...build_plugin.map(({options}) => {
		if (!options.packageJson) {
			return [];
		}
		return extractDeps(options.packageJson, true);
	}));
	
	const pathAdded: string[] = [];
	
	function copyPath(SOURCE: string) {
		const parentExists = pathAdded.some((p) => {
			return SOURCE.startsWith(p);
		});
		if (parentExists) {
			return '';
		} else {
			pathAdded.push(SOURCE);
			return `COPY "${SOURCE}" "/data/${SOURCE}"`;
		}
	}
	
	let content = '# custom javascript build \n';
	content += build_plugin.map(({options}) => {
			let content = '';
			if (options.packageJson) {
				content += '## packageJson: ' + JSON.stringify(options.packageJson) + '\n'
			}
			if (options.rcFile) {
				content += '## rcFile: ' + JSON.stringify(options.rcFile)
				           + '\n\t' + copyPath(options.rcFile);
			}
			options.source.forEach((source) => {
				content += '\n\t' + copyPath(source);
			});
			return content;
		}).join('\n') + '\n';
	
	const s = JSON.stringify;
	const run = [].concat(
		...build_plugin.map(({options}) => {
			return systemInstall(config, options.systemDeps);
		}),
		'cd /', deps.length? `/install/npm/npm-install ` + deps.join(' ') : 'echo "no npm dev deps."',
		'export PATH="${PATH}:/node_modules/.bin"',
		'cd /data',
		...build_plugin.map(({options}) => {
			return [
				`SOURCE=${s(options.source[0])} TARGET=${s(options.target)}`,
				options.command,
			];
		}),
		'cd /', 'rm -rf node_modules', removeCache(),
		...build_plugin.map(({options}) => {
			return systemUninstall(config, options.systemDeps);
		})
	);
	
	content += 'RUN ' + run.join(DOCKERFILE_RUN_SPLIT) + '\n';
	content += '# custom build end';
	
	return content;
}
