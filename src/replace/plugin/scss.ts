import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {CustomInstructions} from "../instructions-dockerfile";
import {renderTemplate} from "../replace-dockerfile";

export default function scss(config: MicroBuildConfig) {
	const scss_plugin = config.getPluginList(EPlugins.node_scss);
	
	if (!scss_plugin || !scss_plugin.length) {
		return '# scss plugin not enabled';
	}
	return scss_plugin.map(({options}) => {
		return renderTemplate('node-scss-compile.Dockerfile', new CustomInstructions(config, {
			SOURCE() {
				return options.source || './public/scss';
			},
			TARGET() {
				return options.target || './public/stylesheets';
			}
		}));
	}).join('\n');
}