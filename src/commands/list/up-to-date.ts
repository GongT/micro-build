import {updateCurrentDir} from "../../library/common/file-paths";
import {defaultEnvironment} from "../../library/common/runenv";
import {readBuildConfig} from "../../library/read-config";
import {readExternalCommand} from "../../library/system/spawn/spawn-child";
import {CommandDefine} from "../command-library";
import {mkconfig} from "./mkconfig";

export const commandDefine: CommandDefine = {
	command: 'up-to-date',
	description: 'check if current container is using newest image',
};

export function up_to_date() {
	updateCurrentDir('./');
	mkconfig(true, false);
	
	defaultEnvironment('docker');
	
	const config = readBuildConfig();
	const imageName = config.getImageTagName();
	const containerName = config.getContainerName();
	
	let imageId, containerId;
	
	try {
		const json = readExternalCommand('docker', ['inspect', '--type', 'image', imageName]);
		const inspect = JSON.parse(json);
		imageId = inspect[0].Id
	} catch (e) {
		console.error(e.message);
		return 2;
	}
	try {
		const json = readExternalCommand('docker', ['inspect', '--type', 'container', containerName]);
		const inspect = JSON.parse(json);
		containerId = inspect[0].Image
	} catch (e) {
		console.error(e.message);
		return 3;
	}
	if (containerId === imageId) {
		return 0;
	} else {
		return 1;
	}
}
