import {CommandParser} from "./library/commands/argument-parser";
import {parser} from "./library/commands/command-microbuild";
export {ConfigFile} from "./library/config/config-file";
export {PluginBase} from "./library/plugins/base";
export {PluginsHandler} from "./library/plugins/handler";

export const MicrobuildCommandParser: CommandParser = parser;
