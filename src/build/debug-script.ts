import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {saveFile, saveJsonFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";
import {ConfigJsonFile} from "../library/config-json-file";
import {resolve} from "path";
import {getProjectPath} from "../library/file-paths";
import {PackageJsonFile} from "../library/package-json-file";
import {injectJsonEnv} from "../library/json-env-cli";
import extend = require("extend");

export function createDebugScript(config: MicroBuildConfig) {
	let adminScript;
	adminScript = renderTemplate('run-control', 'debug.sh', new ScriptVariables(config, {
		SCSS_PLUGIN(){
			const scss_plugin = config.getPlugin(EPlugins.node_scss);
			if (scss_plugin) {
				return `node-sass --watch --recursive ${scss_plugin.source} \\
	--output ${scss_plugin.target} \\
	--source-map true --source-map-contents scss &`
			} else {
				return '# scss plugin not enabled'
			}
		},
		NODEMON_BIN() {
			const pacDir = require.resolve('nodemon')
			                      .replace(/(\/node_modules\/.+?\/).+?$/, '/node_modules/nodemon');
			const binPath = (new PackageJsonFile(resolve(pacDir, 'package.json'))).content.bin['nodemon'];
			return resolve(pacDir, binPath);
		}
	}));
	saveFile('debug.sh', adminScript, '755');
	
	const template = new ConfigJsonFile(resolve(__dirname, '../../template', 'nodemon.json'));
	const project = new ConfigJsonFile(resolve(getProjectPath(), 'nodemon.json'), true);
	
	saveJsonFile('nodemon.json', extend(true, template.content, project.content));
	
	if (config.getPlugin(EPlugins.jenv)) {
		saveJsonFile('json-env-data.json', injectJsonEnv())
	}
}
