import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {systemInstall, systemUninstall} from "./system-install";
import {CustomInstructions} from "../instructions-dockerfile";
import {getProjectPath, getTempPath, tempDirName} from "../../library/file-paths";
import {resolve, dirname} from "path";
import {existsSync, writeFileSync, readFileSync} from "fs";
import {_guid} from "./_guid";
import {sync} from "mkdirp";

export function jspm_bundle(replacer: CustomInstructions) {
	const config = replacer.config;
	const jspm_plugin = config.getPluginList(EPlugins.jspm_bundle);
	
	if (!jspm_plugin || !jspm_plugin.length) {
		return '# jspm bundle plugin not enabled';
	}
	const install: string[] = [];
	const build: string[] = [];
	const copy: string[][] = [];
	
	jspm_plugin.forEach(({options}) => {
		bundleSinglePackage(options, config, install, build, copy);
	});
	
	let content = '# jspm bundle plugin \n';
	
	content += '\n';
	content += 'COPY ' + copy.map((flist) => {
			return flist.map((e) => {
				return JSON.stringify(e);
			}).join(' ');
		}).join('\nCOPY ');
	
	content += '\n';
	content += 'RUN ' + ['set -x'].concat(
			['/npm-install/global-installer jspm',],
			['# sys install'],
			systemInstall(config, ['git']).map(e => `\t${e}`),
			install,
			build,
			['/npm-install/jspm-install finish'],
			['# sys uninstall'],
			systemUninstall(config, ['git']).map(e => `\t${e}`),
			['/npm-install/global-installer uninstall jspm']
		).join(' && \\\n\t');
	
	return content;
}

export interface JspmBundleOptions {
	packageJson: string;
	target: string;
	source: string;
}

function bundleSinglePackage(options: JspmBundleOptions, config: MicroBuildConfig, install: string[], build: string[], copy: string[][]) {
	const SOURCE = options.source;
	if (!SOURCE) {
		throw new Error('EPlugins.jspm_bundle: require `source` argument')
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
	
	const pkg: IPackageJson = require(targetPackagePath);
	if (!pkg.jspm) {
		throw new Error(`No jspm config found in ${targetPath.replace(/^\/data/, '.')}/package.json.`);
	}
	
	const savePath = resolve(targetPath, options.target || './public/bundles');
	
	const names = Object.keys(pkg.jspm['dependencies']).filter((n) => {
		return n !== 'babel-runtime';
	});
	
	install.push(createJspmInstall(
		config,
		pkg,
		targetPath,
		copy
	));
	
	build.push(`mkdir -p "${savePath}" && cd "${targetPath}"`);
	const addNames = names.map((e, i) => {
		if (i > 0) {
			return ' + ' + JSON.stringify(e);
		} else {
			return JSON.stringify(e);
		}
	});
	build.push(`    /npm-install/jspm-bundle-helper dep "${savePath}" ${addNames.join(' ')}`);
	build.push(`    /npm-install/jspm-bundle-helper src "${savePath}" "${SOURCE}" ${names.map(e => ' - ' + JSON.stringify(e)).join(' ')}`);
}

function getConfigFilePath(jspm, targetPath) {
	let configFile = getConfigFileRelative(jspm);
	return resolve('/', targetPath, configFile);
}
function getConfigFileRelative(jspm) {
	return jspm.configFile || './config.js';
}
function getConfigFileSource(jspm, targetPath) {
	let configFile = getConfigFileRelative(jspm);
	return resolve(getProjectPath(), targetPath.replace(/^\/data/, '.'), configFile);
}
function getPackageDir(jspm) {
	if (jspm['directories'] && jspm['directories']['packages']) {
		return jspm['directories']['packages'];
	} else {
		return './jspm_packages';
	}
}
function createJspmBundlePackage(config: MicroBuildConfig, {jspm}: IPackageJson, targetPath: string, copy: string[][]) {
	const id = `jspm-${_guid()}`;
	const source = getConfigFileSource(jspm, targetPath);
	if (!existsSync(source)) {
		throw new Error(`jspm config file not exists: ${source}`);
	}
	
	const target = getConfigFileRelative(jspm) + '.overwrite';
	
	const packageFileContent = {
		name: 'installing-package',
		jspm: Object.assign({}, jspm, {
			configFile: target,
		}),
	};
	
	const tempDir = resolve(getTempPath(), 'package-json', id);
	const configFileTempPath = resolve(tempDir, target);
	if (!existsSync(dirname(configFileTempPath))) {
		sync(dirname(configFileTempPath));
	}
	writeFileSync(configFileTempPath, readFileSync(source, 'utf-8'));
	writeFileSync(resolve(tempDir, 'package.json'), JSON.stringify(packageFileContent, null, 8), 'utf-8');
	
	copy.push([`${tempDirName}/package-json/${id}`, `/npm-install/package-json/${id}`]);
	
	return [`${id}/package.json`, target];
}

function createJspmInstall(config: MicroBuildConfig, {jspm}: IPackageJson, targetPath: string, copy: string[][]) {
	const packageDir = getPackageDir(jspm);
	
	const [packageFile, configFile] = createJspmBundlePackage(config, {jspm}, targetPath, copy);
	
	return `/npm-install/jspm-install "${packageFile}" "${configFile}" "${targetPath}" "${packageDir}" "yes"`;
}
