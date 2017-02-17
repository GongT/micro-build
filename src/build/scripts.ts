import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFilePublic} from "../library/config-file/fast-save";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplateScripts} from "../replace/replace-scripts";

export function createContainerScripts(config: MicroBuildConfig) {
	const extraScript = updateResolve(config).join('\n');
	saveFilePublic('bin/update-resolve', extraScript, '755');
	
	const replacer = new ScriptVariables(config);
	
	let script = renderTemplateScripts('scripts', 'update-alpine.sh', replacer);
	saveFilePublic('bin/update-alpine', script, '755');
}

export function updateResolve(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	
	return renderTemplateScripts('scripts', 'update-resolve.sh', replacer).split(/\n/g);
}

export function removeCache() {
	return 'rm -rf /tmp/npm-* ~/.npm ~/.node-gyp /install/npm/npm-cache';
}
