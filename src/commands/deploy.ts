import {W_OK} from "constants";
import {accessSync, existsSync, lstatSync, unlinkSync} from "fs";
import {dirname} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {spawnMainCommand} from "../library/spawn-child";
import {updateCurrentDir, getConfigPath} from "../library/file-paths";
import {MicroBuildConfig} from "../library/microbuild-config";
import {readBuildConfig} from "../build/all";
import init from "./init";
import {createDeployScript} from "../build/deploy-script";
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
	
	let builder: MicroBuildConfig;
	if (existsSync(getConfigPath())) {
		builder = readBuildConfig();
	} else {
		console.log('using /tmp/d3c421664a752384c71fe2ad46c67451');
		updateCurrentDir('/tmp/d3c421664a752384c71fe2ad46c67451', true);
		if (existsSync(getConfigPath())) {
			unlinkSync(getConfigPath());
		}
		init();
		builder = readBuildConfig();
	}
	createDeployScript(builder);
	
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
