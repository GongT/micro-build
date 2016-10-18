import {ScriptVariables} from "./instructions-scripts";
import {EPlugins} from "../library/microbuild-config";
import {resolve} from "path";
import {PackageJsonFile} from "../library/package-json-file";
import {renderTemplate} from "./replace-scripts";
import createGuid from "../library/guid";

export class ScriptVariablesPlugins extends ScriptVariables {
	DEBUG_PLUGIN_WATCHES() {
		return [
			this.scss(),
			this.typescript(),
		].join('\n');
	}
	
	private typescript() {
		const ts_guid = createGuid();
		return this.walk(this.config.getPluginList(EPlugins.typescript), ({options}) => {
			return renderTemplate('plugin', 'typescript.sh', new ScriptVariables(this.config, {
				SOURCE() {
					return options.source || './src';
				},
				TARGET() {
					return options.target || './dist';
				},
				TASK_NAME() {
					return options.name || ts_guid();
				},
			}));
		});
	}
	
	private scss() {
		const scss_guid = createGuid();
		return this.walk(this.config.getPluginList(EPlugins.node_scss), ({options}) => {
			return renderTemplate('plugin', 'scss.sh', new ScriptVariables(this.config, {
				SOURCE() {
					return options.source || './public/scss';
				},
				TARGET() {
					return options.target || './public/stylesheets';
				},
				TASK_NAME() {
					return options.name || scss_guid();
				},
			}));
		});
	}
	
	NODEMON_BIN() {
		const pacDir = require.resolve('nodemon')
		                      .replace(/(\/node_modules\/.+?\/).+?$/, '/node_modules/nodemon');
		const binPath = (new PackageJsonFile(resolve(pacDir, 'package.json'))).content.bin['nodemon'];
		return JSON.stringify(resolve(pacDir, binPath));
	}
	
	CONCURRENTLY_BIN() {
		const pacDir = require.resolve('concurrently')
		                      .replace(/(\/node_modules\/.+?\/).+?$/, '/node_modules/concurrently');
		const binPath = (new PackageJsonFile(resolve(pacDir, 'package.json'))).content.bin['concurrently'];
		return JSON.stringify(resolve(pacDir, binPath));
	}
}
