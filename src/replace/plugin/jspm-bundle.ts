import {existsSync, readFileSync, writeFileSync} from "fs";
import {sync} from "mkdirp";
import {dirname, resolve} from "path";
import {getProjectPath, getTempPath} from "../../library/common/file-paths";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {CustomInstructions} from "../instructions-dockerfile";
import {_guid} from "./_guid";
import {systemInstall, systemUninstall} from "./system-install";

function getJspmPackage(file: string): JspmPackageConfig {
	const pkg = require(file);
	if (typeof pkg.jspm === 'object') {
		return pkg.jspm;
	} else if (pkg.jspm) {
		return pkg;
	} else {
		throw new Error('no valid jspm config in package: ' + file);
	}
}
export function jspm_bundle_after(replacer: CustomInstructions) {
	const config = replacer.config;
	const jspm_plugin = config.getPluginList(EPlugins.jspm_bundle);
	
	const content: string[] = [];
	const unique: any = {};
	jspm_plugin.forEach(({options}) => {
		const PACKAGE = options.packageJson;
		const targetPath = resolve('/data', PACKAGE, '..');
		
		if (unique[targetPath]) {
			return;
		}
		unique[targetPath] = true;
		
		const targetPackagePath = resolve(getProjectPath(), PACKAGE);
		
		const jspm: JspmPackageConfig = getJspmPackage(targetPackagePath);
		
		const target = getConfigFilePath(jspm, targetPath);
		
		content.push(`mv ${JSON.stringify(target)} ${JSON.stringify(`${target}.backup`)}`);
		content.push(`mv ${JSON.stringify(`${target}.overwrite`)} ${JSON.stringify(target)}`);
	});
	if (content.length) {
		return 'RUN ' + content.join('&& \\\n\t');
	} else {
		return '';
	}
}

export function jspm_bundle(replacer: CustomInstructions) {
	const config = replacer.config;
	const jspm_plugin = config.getPluginList(EPlugins.jspm_bundle);
	
	if (!jspm_plugin || !jspm_plugin.length) {
		return '# jspm bundle plugin not enabled';
	}
	const install: string[] = [];
	const build: string[] = [];
	const copy: string[][] = [];
	
	const unique: any = {};
	jspm_plugin.forEach(({options}) => {
		const PACKAGE = options.packageJson;
		const targetPath = resolve('/data', PACKAGE, '..');
		if (unique[targetPath]) {
			bundleSinglePackage(options, config, [], build, [[]]);
		} else {
			bundleSinglePackage(options, config, install, build, copy);
		}
		unique[targetPath] = true;
	});
	
	let content = '# jspm bundle plugin \n';
	
	content += '\n';
	content += 'COPY ' + copy.map((flist) => {
			return flist.map((e) => {
				return JSON.stringify(e);
			}).join(' ');
		}).join('\nCOPY ');
	
	const installGit = systemInstall(config, ['git']).map(e => `\t\t\t${e}`);
	const uninstallGit = systemUninstall(config, ['git']).map(e => `\t\t\t${e}`);
	
	installGit[0] = '{ ! command -v git && export CLEAN_INSTALL_GIT=yes && \\\n\t' + installGit[0];
	installGit[installGit.length - 1] += ' \\\n\t\t || true ; }';
	uninstallGit[0] = '{ [ -n "${CLEAN_INSTALL_GIT}" ] && \\\n\t' + uninstallGit[0];
	uninstallGit[uninstallGit.length - 1] += ' \\\n\t\t || true ; }';
	
	content += '\n';
	content += 'RUN ' + ['set -x'].concat(
			['/install/npm/global-installer jspm@beta',],
			['# sys install'],
			installGit,
			install,
			build,
			['/install/jspm/install finish'],
			['# sys uninstall'],
			uninstallGit,
			['/install/npm/global-installer uninstall jspm'],
		).join(' && \\\n\t');
	
	return content;
}

export interface JspmBundleOptions {
	buildOptions: string;
	packageJson: string;
	target: string;
	source: string;
	externals: string[];
	build: boolean;
}

function bundleSinglePackage(options: JspmBundleOptions, config: MicroBuildConfig, install: string[], build: string[], copy: string[][]) {
	const SOURCE = options.source;
	if (!SOURCE) {
		throw new Error('EPlugins.jspm_bundle: require `source` argument. (to main file)')
	}
	const PACKAGE = options.packageJson;
	if (!PACKAGE) {
		throw new Error('EPlugins.jspm_bundle: require `packageJson` argument.')
	}
	const targetPackagePath = resolve(getProjectPath(), PACKAGE);
	if (!existsSync(targetPackagePath)) {
		throw new Error('EPlugins.jspm_bundle: argument `packageJson` file must exists')
	}
	const targetPath = resolve('/data', PACKAGE, '..');
	
	const jspm: JspmPackageConfig = getJspmPackage(targetPackagePath);
	if (!jspm) {
		throw new Error(`No jspm config found in ${targetPath.replace(/^\/data/, '.')}/package.json.`);
	}
	
	const savePath = resolve(targetPath, options.target || './public/bundles');
	
	const names = Object.keys(jspm.dependencies || {}).filter((n) => {
		return n !== 'babel-runtime' && n !== 'plugin-babel' ;
	});
	
	install.push(createJspmInstall(
		config,
		jspm,
		targetPath,
		copy,
	));
	
	build.push(`mkdir -p "${savePath}" && cd "${targetPath}"`);
	const addNames = names.map((e, i) => {
		if (i > 0) {
			return ' + ' + JSON.stringify(e);
		} else {
			return JSON.stringify(e);
		}
	});
	
	if (options.externals) {
		options.externals.forEach((ext) => {
			names.push(ext);
		});
	}
	
	if (addNames.length) {
		build.push(`    /install/jspm/bundle-helper dep "${savePath}" ${addNames.join(' ')}`);
	}
	
	if (options.build === false) {
	} else {
		build.push(`    /install/jspm/bundle-helper src "${savePath}" ${JSON.stringify(options.buildOptions || '')} "${SOURCE}" ${names.map(e => ' - ' + JSON.stringify(e)).join(' ')}`);
	}
}

export function getSavePaths(options: JspmBundleOptions) {
	const PACKAGE = options.packageJson;
	if (!PACKAGE) {
		throw new Error('EPlugins.jspm_bundle: require `packageJson` argument.')
	}
	const savePath = resolve('/', PACKAGE, '..', options.target || './public/bundles')
		.replace(/^\//, '');
	
	return [
		`${savePath}/client.js`,
		`${savePath}/full.js`,
		`${savePath}/dependencies.js`,
	];
}

function getConfigFilePath(jspm, targetPath) {
	let configFile = getConfigFileRelative(jspm);
	return resolve('/', targetPath, configFile);
}
function getConfigFileRelative(jspm) {
	if (jspm.configFiles && jspm.configFiles.jspm) {
		return jspm.configFiles.jspm;
	} else if (jspm.configFile) {
		return jspm.configFile;
	} else {
		return './config.js';
	}
}
function getConfigFileSource(jspm, targetPath) {
	let configFile = getConfigFileRelative(jspm);
	return resolve(getProjectPath(), targetPath.replace(/^\/data/, '.'), configFile);
}
function getPackageDir(jspm) {
	if (jspm.directories) {
		if (jspm.directories.packages) {
			return jspm.directories.packages;
		} else if (jspm.directories.baseURL) {
			return `./${jspm.directories.baseURL}/jspm_packages`
		} else {
			return './jspm_packages';
		}
	} else {
		return './jspm_packages';
	}
}
function createJspmBundlePackage(config: MicroBuildConfig, jspm: JspmPackageConfig, targetPath: string, copy: string[][]) {
	const id = `jspm-${_guid()}`;
	const source = getConfigFileSource(jspm, targetPath);
	if (!existsSync(source)) {
		throw new Error(`jspm config file not exists: ${source}`);
	}
	
	let target = getConfigFileRelative(jspm) + '.overwrite';
	target = target.replace(/\.\.\//g, '');
	
	const packageFileContent = Object.assign({}, jspm, {
		name: 'installing-jspm-package',
		jspm: true,
		configFile: target,
	});
	packageFileContent.configFiles = Object.assign({}, packageFileContent.configFiles, {
		jspm: target,
	});
	
	const tempDir = resolve(getTempPath(), 'package-json', id);
	const configFileTempPath = resolve(tempDir, target);
	if (!existsSync(dirname(configFileTempPath))) {
		sync(dirname(configFileTempPath));
	}
	
	writeFileSync(configFileTempPath, readFileSync(source, {encoding: 'utf8'}));
	writeFileSync(resolve(tempDir, 'package.json'), JSON.stringify(packageFileContent, null, 8), {encoding: 'utf8'});
	
	copy.push([`${getTempPath(true)}/package-json/${id}`, `/install/package-json/${id}`]);
	
	return [`${id}/package.json`, target];
}

function createJspmInstall(config: MicroBuildConfig, jspm: JspmPackageConfig, targetPath: string, copy: string[][]) {
	const packageDir = getPackageDir(jspm);
	
	const [packageFile, configFile] = createJspmBundlePackage(config, jspm, targetPath, copy);
	
	return `/install/jspm/install "${packageFile}" "${configFile}" "${targetPath}" "${packageDir}" "yes"`;
}
