import {W_OK} from "constants";
import {accessSync, existsSync, lstatSync, unlinkSync} from "fs";
import {dirname} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {initialize} from "./initialize";
import {CommandDefine} from "../command-library";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {getConfigPath, updateCurrentDir} from "../../library/file-paths";
import {readBuildConfig} from "../../build/all";
import {createDeployScript} from "../../build/deploy-script";
import {spawnMainCommand} from "../../library/spawn-child";
const defaultPaths = ['/data/services', '/opt/services'];

export const commandDefine: CommandDefine = {
	command: 'deploy',
	description: 'auto clone project, then build and install it.',
	builder(parser){
		parser.addParam('gitUrl')
		      .required()
		      .description('project git remote url');
		parser.addParam('target')
		      .description('project git remote url')
		      .defaultValue('/data/services');
	},
};

export function deploy(this: any, gitUrl: string, target: string = '/data/services') {
	const auto_start: boolean = !!this.S;
	
	if (target) {
		if (!testFolder(target)) {
			console.error(`can't write to ${target}, use sudo?`);
			return 1;
		}
	} else {
		target = tryDefault();
		if (!target) {
			console.error(`can't write to any install path:\n\t/data/services\n\t/opt/services\nuse sudo?`);
			return 1;
		}
	}
	
	let builder: MicroBuildConfig;
	updateCurrentDir(process.env.HOME);
	if (existsSync(getConfigPath())) {
		builder = readBuildConfig();
	} else {
		console.log('using /tmp/d3c421664a752384c71fe2ad46c67451');
		updateCurrentDir('/tmp/d3c421664a752384c71fe2ad46c67451', true);
		if (existsSync(getConfigPath())) {
			unlinkSync(getConfigPath());
		}
		initialize();
		builder = readBuildConfig();
	}
	createDeployScript(builder);
	
	return spawnMainCommand('deploy-other.sh', [gitUrl, target, auto_start? 'yes' : '']);
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
