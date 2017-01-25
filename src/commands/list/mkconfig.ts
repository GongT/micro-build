import {CommandDefine} from "../command-library";
import {update} from "./update";
import {readBuildConfig, createBuildTempFiles} from "../../build/all";

export const commandDefine: CommandDefine = {
	command: 'mkconfig',
	description: 'Create main scripts & Dockerfile & so on.',
};

export function mkconfig() {
	update();
	
	const builder = readBuildConfig();
	
	return createBuildTempFiles(builder);
}
