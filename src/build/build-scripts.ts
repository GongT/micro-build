import {createContainerScripts} from "./scripts";
import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {saveFile, saveJsonFile, saveJsonFilePublic} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {renderTemplateDockerFile} from "../replace/replace-dockerfile";
import {ScriptVariables} from "../replace/instructions-scripts";
import {CustomInstructions} from "../replace/instructions-dockerfile";
import {injectJsonEnv} from "../library/cli/json-env-cli";
import {readBuildConfig} from "../library/read-config";

function createDockerfile(config: MicroBuildConfig) {
	const dockerfileContent = renderTemplateDockerFile('Dockerfile', new CustomInstructions(config));
	saveFile('Dockerfile', dockerfileContent);
}

function createBuildScript(builder: MicroBuildConfig) {
	const replacer = new ScriptVariables(builder);
	const adminScript = renderTemplateScripts('run-control', 'build.sh', replacer);
	saveFile('build.sh', adminScript, '755');
}

export function createDockerBuildFiles(builder: MicroBuildConfig = readBuildConfig()) {
	createDockerfile(builder);
	createBuildScript(builder);
	createContainerScripts(builder);
}
