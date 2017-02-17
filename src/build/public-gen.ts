import {saveFile, saveFilePublic} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariables} from "../replace/instructions-scripts";
import {MicroBuildConfig} from "../library/microbuild-config";
import {readBuildConfig} from "../library/read-config";
import {UnitFileVariables} from "../replace/instructions-scripts-unitfile";
import {createServiceControl} from "./service-files";
import {isDockerMode} from "../library/common/runenv";

export function createPublicFiles(config: MicroBuildConfig = readBuildConfig()) {
	createFunctions(config);
	createServiceControl(config);
}

let functionsCreate = false;
function createFunctions(config) {
	if (functionsCreate) {
		return;
	}
	functionsCreate = true;
	
	const replacer = new ScriptVariables(config);
	const adminScript = renderTemplateScripts('functions', 'functions.sh', replacer);
	saveFilePublic('functions.sh', adminScript);
}

export function createEnvironment(config) {
	const replacer = new UnitFileVariables(config);
	const adminScript = renderTemplateScripts('functions', 'EnvironmentFile.sh', replacer);
	if (isDockerMode()) {
		saveFilePublic('run-config-env', adminScript);
	} else {
		saveFile('EnvironmentFile.sh', adminScript);
	}
}

