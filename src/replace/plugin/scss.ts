import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {CustomInstructions} from "../instructions-dockerfile";
import {renderTemplate} from "../replace-dockerfile";

export default function scss(config: MicroBuildConfig) {
	const scss_plugin = config.getPlugin(EPlugins.node_scss);
	
	if (!scss_plugin || !scss_plugin.length) {
		return '# scss plugin not enabled';
	}
	return scss_plugin.map((opt) => {
		return renderTemplate('node-scss-compile.Dockerfile', new CustomInstructions(config, {
			SOURCE() {
				return opt.source;
			},
			TARGET() {
				return opt.target;
			}
		}));
	}).join('\n');
}
