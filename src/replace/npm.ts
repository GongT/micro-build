import {resolve} from "path";
import {existsSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {MicroBuildConfig} from "../library/microbuild-config";
import {getTempPath} from "../library/file-paths";
import createGuid from "../library/guid";
import {saveFile} from "../build/all";
import {ScriptVariables} from "./instructions-scripts";
import {renderTemplate} from "./replace-scripts";

const guid = createGuid();

export function npm_install_command(config: MicroBuildConfig) {
	let helperScript;
	let npmPrependIns = '';
	
	const npm = config.getNpmConfig();
	
	npmPrependIns = `
ENV NPM_LAYER_ENABLED=${npm.enabled? 'yes' : 'no'} \\
	NPM_REGISTRY=${wrapVal(npm.url)} \\
	NPM_USER=${wrapVal(npm.user)} \\
	NPM_PASS=${wrapVal(npm.pass)} \\
	NPM_EMAIL=${wrapVal(npm.email)} \\
	NPM_SCOPE=${wrapVal(npm.scope)} \\
	NPM_UPSTREAM=${wrapVal(npm.upstream)} \\
	IS_DEBUG=${JsonEnv.isDebug? 'yes' : 'no'}
COPY .micro-build/npm-install /npm-install
`;
	if (npm.enabled) {
		npmPrependIns += `
RUN /npm-install/global-installer npm-cli-login && \
	npm config set registry "${npm.url}" && \
	bash /npm-install/prepare-user
`;
	} else {
		npmPrependIns += `
RUN npm config set registry "${npm.url}"
`;
	}
	
	const r = new ScriptVariables(config);
	const prependScript = renderTemplate('plugin', 'npm-installer-detect.sh', r);
	
	const replacer = new ScriptVariables(config, {
		NPM_CACHE_LAYER() {
			return npm.enabled? 'yes' : 'no';
		},
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

const literal = ['string', 'number', 'boolean', ''];
function wrapVal(s) {
	if (literal.indexOf(typeof s) > -1 || s === null || s === undefined) {
		return '' + JSON.stringify(s);
	} else {
		return JSON.stringify(JSON.stringify(s));
	}
}
