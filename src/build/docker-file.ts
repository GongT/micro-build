import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {CustomInstructions} from "../replace/instructions-dockerfile";
import {renderTemplate} from "../replace/replace-dockerfile";
import {renderTemplate as renderTemplateScript} from "../replace/replace-scripts";
import {saveFile, saveJsonFile} from "./all";
import {injectJsonEnv} from "../library/json-env-cli";
import {ScriptVariables} from "../replace/instructions-scripts";

export function createDockerfile(config: MicroBuildConfig) {
	const dockerfileContent = renderTemplate('Dockerfile', new CustomInstructions(config));
	saveFile('Dockerfile', dockerfileContent);
	
	if (config.getPlugin(EPlugins.jenv)) {
		saveJsonFile('json-env-data.json', injectJsonEnv())
	}
}
