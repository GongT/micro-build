import {resolve} from "path";
import {writeFileSync} from "fs";
import {_guid} from "./_guid";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {ScriptVariables} from "../instructions-scripts";
import {renderTemplateScripts} from "../replace-scripts";
import {systemInstall, systemUninstall} from "./system-install";
import {saveFile} from "../../library/config-file/fast-save";
import {getTempPath} from "../../library/common/file-paths";

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
	
	const helperScript = renderTemplateScripts('plugin', 'jspm-install.sh', replacer);
	saveFile('jspm-install/install', helperScript, '755');
	
	create_helper_script(config);
	
	if (actions.length) {
		return `COPY ${getTempPath(true)}/jspm-install /install/jspm
RUN ${actions.join(' && \\ \n\t')}
`;
	} else {
		return `COPY ${getTempPath(true)}/jspm-install /install/jspm
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
	
	return `COPY ${getTempPath(true)}/package-json/${jsonFile} /package-json/${jsonFile}
RUN ` + [].concat(
			systemInstall(config, ['git']),
			[`/install/jspm/install ${jsonFile} "${targetPath}" "${packageDir}"`],
			systemUninstall(config, ['git']),
		).join(' && \\\n\t');
}

function create_helper_script(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	
	const script = renderTemplateScripts('plugin', 'jspm-bundle.sh', replacer);
	saveFile('jspm-install/bundle-helper', script, '755');
}
