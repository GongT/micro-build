import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";
import {ArgParseVars} from "../replace/instructions-scripts-arg-parse";

export function createAdminScript(config: MicroBuildConfig) {
	let adminScript;
	adminScript = renderTemplate('run-control', 'build.sh', new ScriptVariables(config));
	saveFile('build.sh', adminScript, '755');
	
	adminScript = renderTemplate('run-control', 'arg-parse.sh', new ArgParseVars(config));
	saveFile('arg-parse.sh', adminScript);
	
	adminScript = renderTemplate('run-control', 'functions.sh', null);
	saveFile('functions.sh', adminScript);
	
	adminScript = renderTemplate('run-control', 'run-script.sh', new ScriptVariables(config));
	saveFile('run-script.sh', adminScript, '0755');
}
