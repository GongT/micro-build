import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariables} from "../replace/instructions-scripts";
import extend = require("extend");

export function createDeployScript(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	const adminScript = replacer.walk(config.toJSON().serviceDependencies, (_, containerName) => {
		const replacer = new ScriptVariables(config, {
			CONTAINER_NAME() {
				return containerName;
			},
		});
		return renderTemplateScripts('depend', 'check.sh', replacer);
	});
	saveFile('depend-check.sh', adminScript, '0755');
}
