import {MicroBuildConfig} from "./microbuild-config";
import {ConfigFileHelper} from "./config-helper/config-file";
import {TextFileHelper} from "./config-helper/text-file";
export {ConfigFileHelper} from "./config-helper/config-file";
export {TextFileHelper} from "./config-helper/text-file";

export class MicroBuildHelper {
	constructor(private build: MicroBuildConfig) {
	}
	
	createConfig(content: string = '') {
		return new ConfigFileHelper(this.build, content);
	}
	
	createTextFile(content: string = '') {
		return new TextFileHelper(this.build, content);
	}
}
