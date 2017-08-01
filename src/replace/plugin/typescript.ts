import {resolve as resolvePath} from "path";
import {removeCache} from "../../build/scripts";
import {getProjectPath} from "../../library/common/file-paths";
import {ConfigJsonFile} from "../../library/config-file/config-json-file";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {DOCKERFILE_RUN_SPLIT} from "../base";
import {extractDeps, mergeAllDeps} from "../extract-deps-from-package";

function resolve(...args: string[]): string {
	return resolvePath(getProjectPath(), ...args).replace(getProjectPath(), '.');
}
function relativePath(path: string) {
	return path.replace(/^[./]+/, '');
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

function typesMapper(name: string) {
	return name.startsWith('@types/');
}

export function typescriptNormalizeArguments(options: any, findDeps: boolean = false) {
	if (!options.source && options.tsconfig) {
		options.source = findRoot(options.tsconfig);
	}
	if (!options.target && options.tsconfig) {
		options.target = findTarget(options.tsconfig);
	} else {
		options.target = relativePath(options.target);
	}
	if (options.source) {
		options.source = relativePath(options.source);
	} else {
		throw new Error('typescript: no source or tsconfig provided');
	}
	if (options.tsconfig) {
		options.tsconfig = relativePath(options.tsconfig);
	} else {
		options.tsconfig = resolve(options.source, 'tsconfig.json')
	}
	new ConfigJsonFile<any>(options.tsconfig, 'utf8', false); // only ensure file exists
	
	if (findDeps) {
		let path = options.tsconfig;
		let deps: {name: string, version: string}[];
		do {
			path = resolvePath(path, '../');
			try {
				deps = extractDeps(resolvePath(path, 'package.json'), true, typesMapper);
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
		const color = '${E}[38;5;3m';
		const reset = '${E}[0m';
		return `echo "${color}tsc -p ${SOURCE} --outDir ${TARGET}${reset}" && tsc -p "${SOURCE}" --outDir "${TARGET}"`;
	});
	
	let content = '# typescript compile \n';
	
	const pathAdded: string[] = [];
	const all_deps = mergeAllDeps(false, ...ts_plugin.map(({options}) => {
		return options.deps;
	}));
	
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
		}).filter(e => e).join('\n') + '\n';
	
	if (config.getPlugin(EPlugins.jenv)) {
		content += 'COPY .jsonenv/_current_result.json.d.ts /data/.jsonenv/_current_result.json.d.ts\n';
	}
	
	content += 'RUN ' + ["export E=$(printf '\\033')"].concat(
			['DEP_LIST=' + JSON.stringify(all_deps.join(' ')) + ''],
			['cd /data',
				'/install/npm/global-installer typescript@latest',
				'/install/npm/npm install ${DEP_LIST}',
			],
			['echo "${E}c"'],
			build,
			[
				'/install/npm/npm uninstall ${DEP_LIST}',
				'/install/npm/global-installer uninstall typescript',
			],
			removeCache(),
		).join(DOCKERFILE_RUN_SPLIT);
	
	return content;
}
