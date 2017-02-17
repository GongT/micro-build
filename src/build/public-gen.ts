import {saveFile} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariables} from "../replace/instructions-scripts";
import {MicroBuildConfig} from "../library/microbuild-config";

export function createPublicFiles(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	const adminScript = renderTemplateScripts('run-control', 'functions.sh', null);
	saveFile('functions.sh', adminScript);
}
