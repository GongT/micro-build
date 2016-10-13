import {ScriptVariables} from "./instructions-scripts";
import {EPlugins} from "../library/microbuild-config";
import {resolve} from "path";
import {PackageJsonFile} from "../library/package-json-file";
import {CustomInstructions} from "./instructions-dockerfile";
import {renderTemplate} from "./replace-scripts";

export class ScriptVariablesPlugins extends ScriptVariables {
	DEBUG_PLUGIN_WATCHES() {
		return [
			this.scss(),
			this.typescript(),
		].join('\n')
	}
	
	private typescript() {
		return this.walk(this.config.getPluginList(EPlugins.typescript), (opt) => {
				return `tsc -w -p ${opt.source || './src'} --outDir ${opt.target || './dist'} &`
			})
		       || '# typescript plugin not enabled';
	}
	
	private scss() {
		return this.walk(this.config.getPluginList(EPlugins.node_scss), (opt) => {
				return renderTemplate('plugin','scss.sh', new ScriptVariables(this.config, {
					SOURCE() {
						return opt.source || './public/scss';
					},
					TARGET() {
						return opt.target || './public/stylesheets';
					}
				}));
			}) || '# scss plugin not enabled';
	}
	
	NODEMON_BIN() {
		const pacDir = require.resolve('nodemon')
		                      .replace(/(\/node_modules\/.+?\/).+?$/, '/node_modules/nodemon');
		const binPath = (new PackageJsonFile(resolve(pacDir, 'package.json'))).content.bin['nodemon'];
		return resolve(pacDir, binPath);
	}
}
