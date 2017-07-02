import {prepareToRun} from "../../library/action-function/prepare";
import {IArgumentCommand} from "../../library/commands/argument-parser/base";
import {ApplicationConfig} from "../../library/config/application-config";

export function handleCreateFile(mb: ApplicationConfig, cmd: IArgumentCommand) {
	prepareToRun(mb);
	
	mb.currentConfigFile();
	
}
