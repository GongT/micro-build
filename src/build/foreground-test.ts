import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {renderTemplate as renderTemplateScript} from "../replace/replace-scripts";
import {renderTemplate as renderTemplateDocker} from "../replace/replace-dockerfile";
import {ScriptVariablesPlugins} from "../replace/instructions-scripts-plugins";
import {CustomInstructions} from "../replace/instructions-dockerfile";

export function createForegroundTestScript(config: MicroBuildConfig) {
	let script: string;
	script = renderTemplateScript('foreground-test', 'run-foreground.sh', new ScriptVariablesPlugins(config));
	saveFile('foreground-test/run-foreground.sh', script, '755');
	
	script = renderTemplateScript('foreground-test', 'build-foreground-test.sh', new ScriptVariablesPlugins(config));
	saveFile('foreground-test/build-foreground-test.sh', script, '755');
	
	script = renderTemplateScript('run-control', 'start.sh', new ScriptVariablesPlugins(config));
	saveFile('foreground-test/start.sh', script, '755');
	
	saveFile('foreground-test/.dockerignore', '*', '755');
	
	script = renderTemplateDocker('foreground-test.Dockerfile', new CustomInstructions(config));
	saveFile('foreground-test/Dockerfile', script);
}
