import {saveFilePublic} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariables} from "../replace/instructions-scripts";
import {MicroBuildConfig} from "../library/microbuild-config";
import {readBuildConfig} from "../library/read-config";

export function createPublicFiles(config: MicroBuildConfig = readBuildConfig()) {
	createFunctions(config);
	
	saveFilePublic('PROJECT_NAME', 'PROJECT_NAME=' + config.toJSON().projectName + '\n');
}

let functionsCreate = false;
function createFunctions(config: MicroBuildConfig) {
	if (functionsCreate) {
		return;
	}
	functionsCreate = true;
	
	const replacer = new ScriptVariables(config);
	const adminScript = renderTemplateScripts('functions', 'functions.sh', replacer);
	saveFilePublic('functions.sh', adminScript);
}
