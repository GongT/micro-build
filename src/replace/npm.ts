import {resolve} from "path";
import {existsSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {getTempPath} from "../library/file-paths";
import createGuid from "../library/guid";
import {injectJsonEnv} from "../library/json-env-cli";
import {saveFile} from "../build/all";
import {ScriptVariables} from "./instructions-scripts";
import {renderTemplate} from "./replace-scripts";

const guid = createGuid();

export function npm_install_command(config: MicroBuildConfig) {
	let helperScript;
	let isChina = '';
	let prependScript = '';
	const replacer = new ScriptVariables(config, {
		PREPEND_NPM_SCRIPT () {
			return prependScript;
		},
		INSERT_IS_CHINA_VAR () {
			return isChina;
		},
	});
	
	const isJsonEnvEnabled = config.getPlugin(EPlugins.jenv);
	if (isJsonEnvEnabled) {
		injectJsonEnv();
		isChina = 'export IS_IN_CHINA=' + (JsonEnv.isInChina? 'yes' : 'no');
	} else {
		config.buildArgument('is-china', 'no');
		isChina = 'export IS_IN_CHINA';
	}
	
	prependScript = renderTemplate('plugin', 'npm-installer-detect.sh', replacer);
	
	helperScript = renderTemplate('plugin', 'npm-installer.sh', replacer);
	saveFile('packagejson/installer', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-local-installer.sh', replacer);
	saveFile('packagejson/npm-install', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-global-installer.sh', replacer);
	saveFile('packagejson/global-installer', helperScript, '755');
	
	return `COPY .micro-build/packagejson /npm-install`;
}

export function createTempPackageFile(json: IPackageJson) {
	const {prepublish, publish, postpublish, preinstall, install, postinstall, preuninstall, uninstall, postuninstall, preversion, version, postversion,}=json.scripts;
	const lifeCycles = {
		prepublish,
		publish,
		postpublish,
		preinstall,
		install,
		postinstall,
		preuninstall,
		uninstall,
		postuninstall,
		preversion,
		version,
		postversion,
	};
	const packageFileContent = {
		name: json.name,
		dependencies: json.dependencies,
		scripts: lifeCycles,
		version: '1.0.0',
		description: 'xxx',
		repository: 'xxx',
	};
	
	const dir = resolve(getTempPath(), 'packagejson');
	if (!existsSync(dir)) {
		mkdirpSync(dir);
	}
	const fileName = `${guid()}.json`;
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(packageFileContent, null, 8), 'utf-8');
	
	return fileName;
}
