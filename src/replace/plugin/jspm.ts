import {getTempPath, tempDirName} from "../../library/file-paths";
import {resolve} from "path";
import {writeFileSync} from "fs";
import {_guid} from "./_guid";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {ScriptVariables} from "../instructions-scripts";
import {renderTemplate} from "../replace-scripts";
import {saveFile} from "../../build/all";
import {detectSystemPackageType, systemInstall, systemUninstall} from "./system-install";

const tempDir = `/jspm-install`;

export function jspm_install_command(config: MicroBuildConfig) {
	const github = config.getGithubConfig();
	const actions = [];
	
	const replacer = new ScriptVariables(config, {
		PREPEND() {
			if (detectSystemPackageType(config) === 'apk') {
				return systemInstall(config, ['git']).join('\n');
			} else {
				return '# not alpine';
			}
		},
		APPEND() {
			if (detectSystemPackageType(config) === 'apk') {
				return systemUninstall(config, ['git']).join('\n');
			} else {
				return '# not alpine';
			}
		},
		JSPM_GITHUB_CONFIG() {
			if (github.credentials) {
				return `echo \$${JSON.stringify(github.credentials)} | jspm registry config github`;
			} else {
				return 'echo "WARN: no github config, rate limit may reach" >&2'
			}
		}
	});
	
	const helperScript = renderTemplate('plugin', 'jspm-install.sh', replacer);
	saveFile('jspm-install/jspm-install', helperScript, '755');
	
	if (actions.length) {
		return `
COPY ${tempDirName}/jspm-install /
RUN ${actions.join(' && \\ \n\t')}
`;
	} else {
		return `
COPY ${tempDirName}/jspm-install /jspm-install
`;
	}
}

export function createJspmInstallScript({jspm}: IPackageJson, targetPath: string) {
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
RUN /jspm-install/jspm-install ${jsonFile} "${targetPath}" "${packageDir}"`
}
