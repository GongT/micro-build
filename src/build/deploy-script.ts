import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariablesPlugins} from "../replace/instructions-scripts-plugins";
import extend = require("extend");

export function createDeployScript(config: MicroBuildConfig) {
	let adminScript;
	adminScript = renderTemplateScripts('deploy', 'deploy-other.sh', new ScriptVariablesPlugins(config));
	saveFile('deploy-other.sh', adminScript, '755');
}
