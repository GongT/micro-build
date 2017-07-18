import {resolve as resolvePath} from "path";
import {getProjectPath} from "../../library/common/file-paths";
import {ConfigJsonFile} from "../../library/config-file/config-json-file";
import {PackageJsonFile} from "../../library/config-file/package-json-file";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";

function resolve(...args: string[]): string {
	return resolvePath(getProjectPath(), ...args).replace(getProjectPath(), '.');
}
function findTarget(tsconfigPath: string): string {
	const tsconfig = new ConfigJsonFile<any>(tsconfigPath, 'utf8', false);
	let root = './';
	if (tsconfig.content.compilerOptions && tsconfig.content.compilerOptions.outDir) {
		root = tsconfig.content.compilerOptions.outDir;
	}
	return resolve(tsconfigPath, '../', root);
}

function findRoot(tsconfigPath: string): string {
	const tsconfig = new ConfigJsonFile<any>(tsconfigPath, 'utf8', false);
	let root = './';
	if (tsconfig.content.compilerOptions && tsconfig.content.compilerOptions.rootDir) {
		root = tsconfig.content.compilerOptions.rootDir;
	}
	
	return resolve(tsconfigPath, '../', root);
}

export function typescriptNormalizeArguments(options: any, findDeps: boolean = false) {
	if (!options.source && options.tsconfig) {
		options.source = findRoot(options.tsconfig);
	}
	if (!options.target && options.tsconfig) {
		options.target = findTarget(options.tsconfig);
	}
	if (!options.source) {
		throw new Error('typescript: no source or tsconfig provided');
	}
	if (!options.tsconfig) {
		options.tsconfig = resolve(options.source, 'tsconfig.json')
	}
	new ConfigJsonFile<any>(options.tsconfig, 'utf8', false); // only ensure file exists
	
	if (findDeps) {
		let path = options.tsconfig;
		let deps: string[];
		do {
			path = resolvePath(path, '../');
			try {
				const pkg = new PackageJsonFile(resolvePath(path, 'package.json'), 'utf8', false);
				const pkgDevDeps = pkg.content.devDependencies || {};
				deps = Object.keys(pkgDevDeps).filter((name) => {
					return name.startsWith('@types/');
				}).map((name) => {
					let version = pkgDevDeps[name];
					if (version === '*') {
						version = 'latest';
					}
					return `${name}@${version}`;
				});
				break;
			} catch (e) {
			}
		} while (path !== '/');
		if (!deps) {
			throw new Error('can not found a package.json file for: ' + options.tsconfig);
		}
		options.deps = deps;
	}
}

export default function typescript(config: MicroBuildConfig) {
	const ts_plugin = config.getPluginList(EPlugins.typescript);
	
	if (!ts_plugin || !ts_plugin.length) {
		return '# typescript plugin not enabled';
	}
	ts_plugin.forEach(({options}) => {
		typescriptNormalizeArguments(options, true);
	});
	
	const build = ts_plugin.map(({options}) => {
		const SOURCE = options.tsconfig || options.source || './src';
		const TARGET = options.target || './dist';
		return `tsc -p "${SOURCE}" --outDir "${TARGET}"`;
	});
	
	let content = '# typescript compile \n';
	
	const pathAdded: string[] = [];
	const all_deps = [].concat(...ts_plugin.map(({options}) => {
		return options.deps;
	})).map(e => JSON.stringify(e));
	
	content += ts_plugin.map(({options}) => {
			const SOURCE = options.source || './src';
			const parentExists = pathAdded.some((p) => {
				return SOURCE.startsWith(p);
			});
			if (parentExists) {
				return '';
			} else {
				pathAdded.push(SOURCE);
				return `COPY "${SOURCE}" "/data/${SOURCE}"`;
			}
		}).join('\n') + '\n';
	
	if (config.getPlugin(EPlugins.jenv)) {
		content += 'COPY .jsonenv/_current_result.json.d.ts /data/.jsonenv/_current_result.json.d.ts\n';
	}
	
	content += 'RUN ' + ['set -x'].concat(
			['cd /data',
				'/install/npm/global-installer typescript@latest',
				'/install/npm/npm install ' + all_deps.join(' '),
			],
			build,
			[
				'/install/npm/npm uninstall ' + all_deps.join(' '),
				'/install/npm/npm prune',
				'/install/npm/npm dedupe',
				'/install/npm/global-installer uninstall typescript',
			],
		).join(' && \\\n\t');
	
	return content;
}
