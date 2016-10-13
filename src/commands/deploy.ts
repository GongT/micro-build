import {W_OK} from "constants";
import {accessSync, existsSync, lstatSync} from "fs";
import {dirname} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {spawnMainCommand} from "../library/spawn-child";
import {createDeployScript} from "../build/deploy-script";
import {readBuildConfig} from "../build/all";
import {EPlugins} from "../library/microbuild-config";
import {injectJsonEnv} from "../library/json-env-cli";
const defaultPaths = ['/data/services', '/opt/services'];

export default function deploy(this: any, gitUrl: string, deployTo: string) {
	const auto_start: boolean = !!this.S;
	
	if (deployTo) {
		if (!testFolder(deployTo)) {
			console.error(`can't write to ${deployTo}, use sudo?`);
			return 1;
		}
	} else {
		deployTo = tryDefault();
		if (!deployTo) {
			console.error(`can't write to any install path:\n\t/data/services\n\t/opt/services\nuse sudo?`);
			return 1;
		}
	}
	
	const config = readBuildConfig();
	createDeployScript(config);
	
	if (config.getPlugin(EPlugins.jenv)) {
		injectJsonEnv();
	}
	
	return spawnMainCommand('deploy-other.sh', [gitUrl, deployTo, auto_start? 'yes' : '']);
}

function tryDefault(): string {
	let ret;
	defaultPaths.some((p) => {
		if (testFolder(p)) {
			ret = p;
			return true;
		}
	});
	return ret;
}
function testFolder(folder) {
	if (existsSync(folder)) {
		if (!lstatSync(folder).isDirectory()) {
			return false;
		}
	} else {
		if (!existsSync(dirname(folder))) {
			return false;
		}
		try {
			accessSync(dirname(folder), W_OK);
		} catch (e) {
			return false;
		}
		mkdirpSync(folder);
	}
	
	try {
		accessSync(folder, W_OK);
	} catch (e) {
		return false;
	}
	return true;
}
