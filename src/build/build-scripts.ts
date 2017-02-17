import {createContainerScripts} from "./scripts";
import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {renderTemplateDockerFile} from "../replace/replace-dockerfile";
import {ScriptVariables} from "../replace/instructions-scripts";
import {CustomInstructions} from "../replace/instructions-dockerfile";
import {readBuildConfig} from "../library/read-config";
import {createEnvironment} from "./public-gen";
import {switchEnvironment} from "../library/common/runenv";

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
	switchEnvironment('docker');
	createDockerfile(builder);
	createBuildScript(builder);
	createContainerScripts(builder);
	createEnvironment(builder);
}
