import {existsSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {resolve} from "path";
import {removeCache} from "../../build/scripts";
import {getTempPath} from "../../library/common/file-paths";
import {saveFile} from "../../library/config-file/fast-save";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {DOCKERFILE_RUN_SPLIT} from "../base";
import {ScriptVariables} from "../instructions-scripts";
import {renderTemplateScripts} from "../replace-scripts";
import {_guid} from "./_guid";

export function getNpmScriptReplacer(config: MicroBuildConfig) {
	const r = new ScriptVariables(config, {});
	const prependScript = renderTemplateScripts('plugin', 'npm-installer-detect.sh', r);
	const npm = config.getNpmConfig();
	
	return new ScriptVariables(config, {
		PREPEND_NPM_SCRIPT() {
			return `NPM_USER=${wrapVal(npm.user)}
NPM_PASS=${wrapVal(npm.pass)}
NPM_EMAIL=${wrapVal(npm.email)}
NPM_SCOPE=${wrapVal(npm.scope)}
NPM_UPSTREAM=${wrapVal(npm.upstream)}
IS_DEBUG=${JsonEnv.isDebug? 'yes' : 'no'}

# public script
${prependScript}
# public script end`;
		},
	});
}

export function npm_install_command(config: MicroBuildConfig) {
	let helperScript;
	const npm = config.getNpmConfig();
	
	let npmPrependIns = `# set cache layer env
ARG NPM_LOG_LEVEL="warn"
ENV NPM_LAYER_ENABLED=${npm.enabled? 'yes' : 'no'} \\
    NPM_REGISTRY=${wrapVal(npm.enabled? npm.url : npm.upstream || npm.url)}
COPY ${getTempPath(true)}/npm-install /install/npm
`;
	if (npm.enabled) {
		npmPrependIns += '# private npm\n';
		npmPrependIns += 'RUN ' + [
			'/install/npm/global-installer npm-cli-login',
			`npm config set registry "${npm.url}"`,
			'sh /install/npm/prepare-user',
			'npm uninstall -q --global npm-cli-login',
			removeCache(),
		].join(DOCKERFILE_RUN_SPLIT);
	} else {
		npmPrependIns += `# no private npm
RUN npm config set registry "${npm.upstream || npm.url}"
`;
	}
	
	const replacer = getNpmScriptReplacer(config);
	
	helperScript = renderTemplateScripts('plugin', 'npm-vars-source.sh', replacer);
	saveFile('npm-install/npm-vars', helperScript, '644');
	
	helperScript = renderTemplateScripts('plugin', 'npm-vars-arg.sh', replacer);
	saveFile('npm-install/npm', helperScript, '755');
	
	helperScript = renderTemplateScripts('plugin', 'npm-installer-prepare-user.sh', replacer);
	saveFile('npm-install/prepare-user', helperScript, '644');
	
	helperScript = renderTemplateScripts('plugin', 'npm-installer.sh', replacer);
	saveFile('npm-install/installer', helperScript, '755');
	
	helperScript = renderTemplateScripts('plugin', 'npm-local-installer.sh', replacer);
	saveFile('npm-install/npm-install', helperScript, '755');
	
	helperScript = renderTemplateScripts('plugin', 'npm-global-installer.sh', replacer);
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
	const fileName = `${_guid()}.json`;
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(packageFileContent, null, 8), {encoding: 'utf8'});
	
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
