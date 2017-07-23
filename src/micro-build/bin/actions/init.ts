import {prepareToRun, updateBuildFolder} from "../../library/action-function/prepare";
import {IArgumentCommand} from "../../library/commands/argument-parser/base";
import {ConfigFile} from "../../library/config/config-file";

export function handleInit(mb: ConfigFile, cmd: IArgumentCommand) {
	/*const cpConf = {
		dereference: true,
		overwrite: true,
		preserveTimestamps: true,
	};
	
	const filesToCopy = [];
	for (let file of filesToCopy) {
		copySync(resolve(MICROBUILD_ROOT, 'template/', file), mb.path.resolveBuild(file), cpConf);
	}*/
	updateBuildFolder(mb);
	prepareToRun(mb);
	
	// pluginEvent.emit(topCommand)
	
	// TODO copy example config
	// console.log(args)
	
}
