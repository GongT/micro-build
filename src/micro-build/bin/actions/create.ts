import {prepareToRun} from "../../library/action-function/prepare";
import {IArgumentCommand} from "../../library/commands/argument-parser/base";
import {ConfigFile} from "../../library/config/config-file";

export function handleCreateFile(mb: ConfigFile, cmd: IArgumentCommand) {
	prepareToRun(mb);
	
	
}
