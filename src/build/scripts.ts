import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";

export function createScripts(config: MicroBuildConfig) {
	let extraScript;
	const replacer = new ScriptVariables(config);
	
	extraScript = renderTemplate('scripts', 'update-resolve.sh', replacer);
	saveFile('bin/update-resolve', extraScript, '755');
}
