import {CommandParser} from "./library/commands/argument-parser";
import {parser} from "./library/commands/command-microbuild";
import {ConfigFile} from "./library/config/config-file";
export {ConfigFile} from "./library/config/config-file";

export declare const config: ConfigFile;

Object.defineProperty(module.exports, 'config', {
	get(){
		return global['config'];
	},
});

export {PluginBase} from "./library/plugins/base";
export {PluginList} from "./library/plugins/handler";

export const MicrobuildCommandParser: CommandParser = parser;

