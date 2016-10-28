import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {CustomInstructions} from "../instructions-dockerfile";
import {renderTemplate} from "../replace-dockerfile";

export default function typescript(config: MicroBuildConfig) {
	const ts_plugin = config.getPluginList(EPlugins.typescript);
	
	if (!ts_plugin || !ts_plugin.length) {
		return '# typescript plugin not enabled';
	}
	return ts_plugin.map(({options}) => {
		return renderTemplate('typescript-compile.Dockerfile', new CustomInstructions(config, {
			SOURCE() {
				return options.source || './src';
			},
			TARGET() {
				return options.target || './dist';
			}
		}));
	}).join('\n');
}
