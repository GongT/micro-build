import {W_OK} from "constants";
import {accessSync, existsSync, lstatSync, unlinkSync, writeFileSync} from "fs";
import {dirname} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {initialize} from "./initialize";
import {CommandDefine} from "../command-library";
import {MicroBuildConfig} from "../../library/microbuild-config";
import {getConfigPath, updateCurrentDir, projectPackageJson} from "../../library/file-paths";
import {readBuildConfig} from "../../build/all";
import {createDeployScript} from "../../build/deploy-script";
import {spawnMainCommand} from "../../library/spawn-child";

export const commandDefine: CommandDefine = {
	command: 'deploy',
	description: 'auto clone project, then build and install it.',
	builder(parser){
		parser.addParam('gitUrl')
		      .required()
		      .description('project git remote url');
		parser.addParam('target')
		      .description('deploy project to directory')
		      .defaultValue('/data/services');
		parser.addOption('start')
		      .aliases('s')
		      .description('auto start this service after successful deploy')
		      .notAcceptValue();
	},
};

export function deploy(this: any, gitUrl: string, target: string = '/data/services') {
	const auto_start: boolean = !!this.start;
	
	testAndCreateFolder(target);
	
	const TEMP_ROOT = '/tmp/d3c421664a752384c71fe2ad46c67451';
	console.log('using %s', TEMP_ROOT);
	updateCurrentDir(TEMP_ROOT, true);
	if (!existsSync(projectPackageJson())) {
		mkdirpSync(TEMP_ROOT);
		writeFileSync(projectPackageJson(), '{"name":"temp-deploy"}', 'utf-8');
	}
	if (existsSync(getConfigPath())) {
		unlinkSync(getConfigPath());
	}
	initialize(TEMP_ROOT);
	
	const builder: MicroBuildConfig = readBuildConfig();
	createDeployScript(builder);
	
	return spawnMainCommand('deploy-other.sh', [gitUrl, target, auto_start? 'yes' : '']);
}

function testAndCreateFolder(folder) {
	if (existsSync(folder)) {
		if (!lstatSync(folder).isDirectory()) {
			throw new Error(`the target directory "${folder}" is not a directory.`);
		}
	} else {
		if (!existsSync(dirname(folder))) {
			throw new Error(`the target path "${dirname(folder)}" is not a directory, please create it manually.`);
		}
		if (!lstatSync(dirname(folder)).isDirectory()) {
			throw new Error(`the target path "${dirname(folder)}" is not a directory.`);
		}
		try {
			mkdirpSync(folder);
		} catch (e) {
			throw new Error(`can't create directory "${dirname(folder)}", use sudo?`);
		}
	}
	
	try {
		accessSync(folder, W_OK);
	} catch (e) {
		throw new Error(`the target directory "${folder}" is not writable, use sudo?`);
	}
}
