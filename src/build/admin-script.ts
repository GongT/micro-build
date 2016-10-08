import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";

export function createAdminScript(config: MicroBuildConfig) {
	let adminScript;
	adminScript = renderTemplate('run-control', 'build.sh', new ScriptVariables(config));
	saveFile('build.sh', adminScript, '755');
	
	adminScript = renderTemplate('run-control', 'arg-parse.sh', new ScriptVariables(config));
	saveFile('arg-parse.sh', adminScript);
}
