import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {resolve} from "path";
import {ScriptVariablesPlugins} from "../replace/instructions-scripts-plugins";
import {readBuildConfig} from "../library/read-config";
import {ConfigJsonFile} from "../library/config-file/config-json-file";
import {saveFile, saveJsonFile, saveJsonFilePublic} from "../library/config-file/fast-save";
import {getProjectPath, MicroBuildRoot} from "../library/common/file-paths";
import {injectJsonEnv} from "../library/cli/json-env-cli";
import extend = require("extend");

export function createDebugScript(config: MicroBuildConfig = readBuildConfig()) {
	let adminScript;
	adminScript = renderTemplateScripts('run-control', 'debug.sh', new ScriptVariablesPlugins(config));
	saveFile('debug.sh', adminScript, '755');
	
	const template = new ConfigJsonFile(resolve(MicroBuildRoot, 'template/nodemon.json'));
	const project = new ConfigJsonFile(resolve(getProjectPath(), 'nodemon.json'), true);
	
	const source = template.content;
	const target = project.content;
	Object.keys(target).forEach((name) => {
		if (Array.isArray(target[name]) && Array.isArray(source[name])) {
			target[name] = [].concat(target[name], source[name]);
		}
	});
	
	saveJsonFile('nodemon.json', extend(true, source, target));
	
	if (config.getPlugin(EPlugins.jenv)) {
		saveJsonFilePublic('json-env-data.json', injectJsonEnv())
	}
}
