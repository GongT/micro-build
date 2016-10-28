import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {resolve as resolvePath} from "path";
import {getProjectPath} from "../../library/file-paths";
import {existsSync} from "fs";

export default function browserify(config: MicroBuildConfig) {
	const brows_plugin = config.getPluginList(EPlugins.browserify);
	
	if (!brows_plugin || !brows_plugin.length) {
		return '# browserify plugin not enabled';
	}
	
	return brows_plugin.map(({options:{list, target:targetPath}}) => {
		if (targetPath) {
			targetPath = resolvePath('/data', targetPath);
		}
		const ret = Object.keys(list).map((module) => {
			let savePath = targetPath || resolvePath('/data', 'node_modules', module);
			
			let file = list[module];
			if (!file) {
				file = autoGetFile(module);
			}
			const target = resolvePath(savePath, `${module}.target.umd.js`);
			const absFile = resolvePath('/data', 'node_modules', module, file);
			
			return `browserify "${absFile}" --list --debug --standalone "${module}" --outfile "${target}"`;
		});
		
		if (ret.length) {
			return 'RUN ' + (targetPath? `mkdir -p '${targetPath}';` : '') + ret.join(' && ');
		}
	}).join('\n');
}
export function autoGetFile(module): string {
	// let jsUrl = tryFolders(module, 'dist', 'umd');
	let jsUrl;
	
	if (!jsUrl) {
		const packageRootPath = resolvePath(getProjectPath(), 'node_modules', module);
		jsUrl = require.resolve(packageRootPath);
		jsUrl = jsUrl.replace(packageRootPath + '/', '');
		console.log(`pacakge ${module} auto detected ${jsUrl}`);
	}
	
	return jsUrl;
}

function tryFiles(dir: string, ...files: string[]) {
	let jsPath;
	files.some((f) => {
		const cf = constName(f);
		return [`${f}`, `${f}.min`, `${cf}`, `${cf}.min`,].some((file) => {
			if (existsSync(`${dir}/${file}.js`)) {
				jsPath = `${dir}/${file}.js`;
				return true;
			}
		})
	});
	return jsPath;
}
function constName(s) {
	return s.replace(/^[a-z]|[-_][a-z]/g, (s) => {
		return s.replace(/^[-_]/, '').toUpperCase();
	})
}

function tryFolders(packageName: string, ...folders: string[]) {
	let jsUrl;
	const packageRootPath = resolvePath(getProjectPath(), 'node_modules', packageName);
	
	folders.some((f) => {
		f = resolvePath(packageRootPath, f);
		
		jsUrl = tryFiles(f, packageName);
		if (jsUrl) {
			jsUrl = jsUrl.replace(packageRootPath + '/', '');
			console.log(`pacakge ${packageName} index file is ${jsUrl}`);
			return true;
		}
	});
	if (!jsUrl) {
		console.error(`can't find package index file of ${packageName}`);
	}
	return jsUrl;
}
