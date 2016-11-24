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
	let npmPrependIns = '';
	
	const isJsonEnvEnabled = config.getPlugin(EPlugins.jenv);
	if (isJsonEnvEnabled) {
		injectJsonEnv();
		if (JsonEnv.gfw) {
			if (!JsonEnv.gfw.npmRegistry) {
				throw new Error('JsonEnv.gfw.npmRegistry is required.');
			}
			
			npmPrependIns = `
ENV IS_IN_CHINA=${JsonEnv.gfw.isInChina? 'yes' : 'no'} \\
	NPM_LAYER_DISABLED=${JsonEnv.gfw.npmRegistry.disableLayer? 'yes' : 'no'} \\
	NPM_REGISTRY=${wrapVal(JsonEnv.gfw.npmRegistry.url)} \\
	NPM_USER=${wrapVal(JsonEnv.gfw.npmRegistry.user)} \\
	NPM_PASS=${wrapVal(JsonEnv.gfw.npmRegistry.pass)} \\
	NPM_EMAIL=${wrapVal(JsonEnv.gfw.npmRegistry.email)} \\
	NPM_SCOPE=${wrapVal(JsonEnv.gfw.npmRegistry.scope)} \\
	NPM_UPSTREAM=${wrapVal(JsonEnv.gfw.npmRegistry.upstream)} \\
	IS_DEBUG=${JsonEnv.isDebug? 'yes' : 'no'}
COPY .micro-build/npm-install /npm-install
`;
			if (JsonEnv.gfw.npmRegistry.disableLayer) {
				npmPrependIns += `
RUN npm config set registry "${JsonEnv.gfw.npmRegistry.upstream}"
`;
			} else {
				npmPrependIns += `
RUN /npm-install/global-installer npm-cli-login && \
	npm config set registry "${JsonEnv.gfw.npmRegistry.url}" && \
	bash /npm-install/prepare-user
`;
			}
		}
	}
	
	const r = new ScriptVariables(config);
	const prependScript = renderTemplate('plugin', 'npm-installer-detect.sh', r);
	
	const replacer = new ScriptVariables(config, {
		PREPEND_NPM_SCRIPT () {
			return prependScript;
		},
	});
	
	helperScript = renderTemplate('plugin', 'npm-vars-source.sh', replacer);
	saveFile('npm-install/source', helperScript, '644');
	
	helperScript = renderTemplate('plugin', 'npm-vars-arg.sh', replacer);
	saveFile('npm-install/npm', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-installer-prepare-user.sh', replacer);
	saveFile('npm-install/prepare-user', helperScript, '644');
	
	helperScript = renderTemplate('plugin', 'npm-installer.sh', replacer);
	saveFile('npm-install/installer', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-local-installer.sh', replacer);
	saveFile('npm-install/npm-install', helperScript, '755');
	
	helperScript = renderTemplate('plugin', 'npm-global-installer.sh', replacer);
	saveFile('npm-install/global-installer', helperScript, '755');
	
	return npmPrependIns;
}

export function createTempPackageFile(json: IPackageJson) {
	let lifeCycles;
	if (json.scripts) {
		const {preinstall, install, postinstall,} = json.scripts;
		lifeCycles = {
			preinstall,
			install,
			postinstall,
		};
	}
	const packageFileContent = {
		name: 'installing-package',
		dependencies: json.dependencies,
		devDependencies: json.devDependencies,
		scripts: lifeCycles,
		version: '1.0.0',
		description: 'xxx',
		repository: 'xxx',
	};
	
	const dir = resolve(getTempPath(), 'package-json');
	if (!existsSync(dir)) {
		mkdirpSync(dir);
	}
	const fileName = `${guid()}.json`;
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(packageFileContent, null, 8), 'utf-8');
	
	return fileName;
}

function wrapVal(s) {
	return s.replace(/ /, '\\ ');
}
