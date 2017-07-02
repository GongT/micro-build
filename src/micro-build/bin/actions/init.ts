import {copySync} from "fs-extra";
import {resolve} from "path";
import {prepareToRun} from "../../library/action-function/prepare";
import {IArgumentCommand} from "../../library/commands/argument-parser/base";
import {MICROBUILD_ROOT} from "../../library/common/paths";
import {ApplicationConfig} from "../../library/config/application-config";

export function handleInit(mb: ApplicationConfig, cmd: IArgumentCommand) {
	const cpConf = {
		dereference: true,
		overwrite: true,
		preserveTimestamps: true,
	};
	
	const filesToCopy = [];
	for (let file of filesToCopy) {
		copySync(resolve(MICROBUILD_ROOT, 'template/', file), mb.path.resolveBuild(file), cpConf);
	}
	
	prepareToRun(mb);
	
	// pluginEvent.emit(topCommand)
	
	// TODO copy example config
	// console.log(args)
	
}
