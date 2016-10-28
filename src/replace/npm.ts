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

const china = `npm install
--registry=https://registry.npm.taobao.org
--cache=/npm-install/cnpm-cache
--disturl=https://npm.taobao.org/dist
--userconfig=/npm-install/config/cnpmrc`.replace(/\n/g, ' ');

const normal = `npm install
--cache=/npm-install/npm-cache
--userconfig=/npm-install/config/npmrc`.replace(/\n/g, ' ');

export function npm_install_command(config: MicroBuildConfig) {
	let helperScript;
	
	const isJsonEnvEnabled = config.getPlugin(EPlugins.jenv);
	if (isJsonEnvEnabled) {
		injectJsonEnv();
	} else {
		config.buildArgument('is-china', 'no');
	}
	
	let cmd;
	if (isJsonEnvEnabled) {
		cmd = JsonEnv.isInChina? china : normal;
	} else {
		cmd = `$( [[ "$IS_CHINA" == "yes" ]] && echo ${JSON.stringify(china)} || echo ${JSON.stringify(normal)})`;
	}
	
	helperScript = renderTemplate('plugin', 'npm-installer.sh', new ScriptVariables(config, {
		NPM_INSTALL () {
			return cmd;
		},
	}));
	saveFile('packagejson/installer', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-global-installer.sh', new ScriptVariables(config, {
		NPM_INSTALL () {
			return cmd;
		},
	}));
	saveFile('packagejson/global-installer', helperScript, '755');
	
	return `COPY .micro-build/packagejson /npm-install`;
}

export function createTempPackageFile(json: IPackageJson) {
	const dir = resolve(getTempPath(), 'packagejson');
	if (!existsSync(dir)) {
		mkdirpSync(dir);
	}
	const fileName = `${guid()}.json`;
	
	json.version = '1.0.0';
	json.description = 'xxx';
	json.repository = 'xxx';
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(json, null, 8), 'utf-8');
	
	return fileName;
}
