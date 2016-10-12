import {ScriptVariables} from "./instructions-scripts";
import {EPlugins} from "../library/microbuild-config";
import {resolve} from "path";
import {PackageJsonFile} from "../library/package-json-file";

export class ScriptVariablesPlugins extends ScriptVariables {
	DEBUG_PLUGIN_WATCHES() {
		return [
			this.scss(),
			this.typescript(),
		].join('\n')
	}
	
	private typescript() {
		return this.walk(this.config.getPlugin(EPlugins.typescript), (opt) => {
				return `tsc -w -p ${opt.source || './src'} --outDir ${opt.target || './dist'} &`
			})
		       || '# typescript plugin not enabled';
	}
	
	private scss() {
		return this.walk(this.config.getPlugin(EPlugins.node_scss), (opt) => {
				return `node-sass --watch --recursive ${opt.source} \\
	--output ${opt.target} \\
	--source-map true --source-map-contents scss &`
			})
		       || '# scss plugin not enabled';
	}
	
	NODEMON_BIN() {
		const pacDir = require.resolve('nodemon')
		                      .replace(/(\/node_modules\/.+?\/).+?$/, '/node_modules/nodemon');
		const binPath = (new PackageJsonFile(resolve(pacDir, 'package.json'))).content.bin['nodemon'];
		return resolve(pacDir, binPath);
	}
}
