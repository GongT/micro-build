import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";

export function createScripts(config: MicroBuildConfig) {
	const extraScript = updateResolve(config).join('\n');
	saveFile('bin/update-resolve', '#!/bin/sh\n\n'+extraScript, '755');
}

export function updateResolve(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	
	return renderTemplate('scripts', 'update-resolve.sh', replacer).split(/\n/g);
}

export function removeCache(){
    return 'rm -rf /tmp/npm-* ~/.npm ~/.node-gyp /npm-install/npm-cache';
}
