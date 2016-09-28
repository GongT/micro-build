import {MicroBuildConfig} from "../library/microbuild-config";
import {defaultPath} from "../microbuild";
import {ConfigJsonFile} from "../library/config-json-file";

export default function build() {
	const config = new ConfigJsonFile(defaultPath);
	const buildData = new MicroBuildConfig(config.content);
	
}
