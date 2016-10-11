import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";
import {ArgParseVars} from "../replace/instructions-scripts-arg-parse";

export function createAdminScript(config: MicroBuildConfig) {
	let adminScript;
	const replacer = new ScriptVariables(config);
	
	adminScript = renderTemplate('run-control', 'build.sh', replacer);
	saveFile('build.sh', adminScript, '755');
	
	adminScript = renderTemplate('run-control', 'arg-parse.sh', new ArgParseVars(config));
	saveFile('arg-parse.sh', adminScript);
	
	adminScript = renderTemplate('run-control', 'functions.sh', null);
	saveFile('functions.sh', adminScript);
	
	adminScript = renderTemplate('run-control', 'run-script.sh', replacer);
	saveFile('run-script.sh', adminScript, '0755');
	
	adminScript = renderTemplate('admin', 'control.sh', replacer);
	saveFile('control.sh', adminScript, '755');
	
	adminScript = renderTemplate('run-control', 'start.sh', replacer);
	saveFile('start.sh', adminScript, '755');
	
	adminScript = renderTemplate('run-control', 'stop.sh', replacer);
	saveFile('stop.sh', adminScript, '755');
}
