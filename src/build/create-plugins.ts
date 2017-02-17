import {injectJsonEnv} from "../library/cli/json-env-cli";
import {saveJsonFilePublic} from "../library/config-file/fast-save";
import {EPlugins, MicroBuildConfig} from "../library/microbuild-config";
import {readBuildConfig} from "../library/read-config";

export function createPlugins(config: MicroBuildConfig = readBuildConfig()) {
	if (config.getPlugin(EPlugins.jenv)) {
		saveJsonFilePublic('json-env-data.json', injectJsonEnv())
	}
}
