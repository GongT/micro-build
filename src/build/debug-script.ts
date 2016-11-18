import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {saveFile, saveJsonFile} from "./all";
import {renderTemplate} from "../replace/replace-scripts";
import {ConfigJsonFile} from "../library/config-json-file";
import {resolve} from "path";
import {getProjectPath} from "../library/file-paths";
import {injectJsonEnv} from "../library/json-env-cli";
import {ScriptVariablesPlugins} from "../replace/instructions-scripts-plugins";
import extend = require("extend");

export function createDebugScript(config: MicroBuildConfig) {
	let adminScript;
	adminScript = renderTemplate('run-control', 'debug.sh', new ScriptVariablesPlugins(config));
	saveFile('debug.sh', adminScript, '755');
	
	const template = new ConfigJsonFile(resolve(__dirname, '../../template', 'nodemon.json'));
	const project = new ConfigJsonFile(resolve(getProjectPath(), 'nodemon.json'), true);
	
	Object.keys(project.content).forEach((name) => {
		if (Array.isArray(project.content[name]) && Array.isArray(template.content[name])) {
			project.content[name] = project.content[name].concat(template.content[name]);
		}
	});
	
	saveJsonFile('nodemon.json', extend(true, template.content, project.content));
	
	if (config.getPlugin(EPlugins.jenv)) {
		saveJsonFile('json-env-data.json', injectJsonEnv())
	}
}
