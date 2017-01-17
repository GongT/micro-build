import {getTempPath, tempDirName} from "../../library/file-paths";
import {resolve} from "path";
import {writeFileSync} from "fs";
import {_guid} from "./_guid";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {ScriptVariables} from "../instructions-scripts";
import {renderTemplate} from "../replace-scripts";
import {saveFile} from "../../build/all";
import {systemInstall, systemUninstall} from "./system-install";

export function jspm_install_command(config: MicroBuildConfig) {
	const github = config.getGithubConfig();
	const actions = [];
	
	const replacer = new ScriptVariables(config, {
		JSPM_GITHUB_CONFIG() {
			if (github.credentials) {
				return `jspm config registries.github.auth ${JSON.stringify(github.credentials)}
cat ~/.jspm/config`;
			} else {
				return 'echo "WARN: no github config, rate limit may reach" >&2'
			}
		}
	});
	
	const helperScript = renderTemplate('plugin', 'jspm-install.sh', replacer);
	saveFile('jspm-install/jspm-install', helperScript, '755');
	
	create_helper_script(config);
	
	if (actions.length) {
		return `COPY ${tempDirName}/jspm-install /npm-install
RUN ${actions.join(' && \\ \n\t')}
`;
	} else {
		return `COPY ${tempDirName}/jspm-install /npm-install
`;
	}
}

export function createJspmInstallScript(config: MicroBuildConfig, {jspm}: IPackageJson, targetPath: string) {
	if (1 && true) {
		throw new Error('can not use this (jspm-install).');
	}
	const jsonFile = `${_guid()}.json`;
	if (!jspm) {
		throw new Error('No jspm config found in package.json.');
	}
	
	let configFile = jspm.configFile || './config.js';
	configFile = resolve('/', targetPath, configFile);
	
	let packageDir;
	if (jspm.directories && jspm.directories.packages) {
		packageDir = jspm.directories.packages;
	} else {
		packageDir = './jspm_packages';
	}
	
	const packageFileContent = {
		name: 'installing-package',
		jspm: Object.assign({}, jspm, {
			configFile: configFile,
		}),
		version: '1.0.0',
		description: 'xxx',
		repository: 'xxx',
	};
	
	writeFileSync(resolve(getTempPath(), 'package-json', jsonFile), JSON.stringify(packageFileContent, null, 8), 'utf-8');
	
	return `COPY ${tempDirName}/package-json/${jsonFile} /package-json/${jsonFile}
RUN ` + [].concat(
			systemInstall(config, ['git']),
			[`/npm-install/jspm-install ${jsonFile} "${targetPath}" "${packageDir}"`],
			systemUninstall(config, ['git']),
		).join(' && \\\n\t');
}

function create_helper_script(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	
	const script = renderTemplate('plugin', 'jspm-bundle.sh', replacer);
	saveFile('jspm-install/jspm-bundle-helper', script, '755');
}
