import {existsSync, writeFileSync, readFileSync} from "fs";
import {resolve} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {
	MicroBuildRoot,
	projectFile,
	templateFileObject,
	projectFileObject,
	getTempPath,
	getConfigPath,
	updateCurrentDir, assertCurrentDirOk, projectPackageJson, getProjectPath
} from "../../library/file-paths";
import {PackageJsonFile} from "../../library/package-json-file";
import {spawnMainCommand, spawnExternalCommand} from "../../library/spawn-child";
import {CommandDefine, die} from "../command-library";
import {update} from "./update";

export const commandDefine: CommandDefine = {
	command: 'initialize',
	aliases: ['init'],
	description: 'Create the micro-build config files. (or update if exists)',
	builder(parser){
		parser.addOption('force')
		      .acceptValue(false)
		      .aliases('f')
		      .defaultValue('')
		      .description('force create config, even the dir is empty.');
		parser.addParam('target')
		      .description('create config in this folder')
		      .defaultValue('.');
	},
};

export interface InitializeSwitchs {
	force?: boolean;
}

export function initialize(this: void | InitializeSwitchs, target: string = '.') {
	const opt: InitializeSwitchs = this || {};
	updateCurrentDir(target, true);
	
	if (!assertCurrentDirOk()) {
		if (opt.force) {
			console.error('    run npm init: ');
			if (!existsSync(resolve(getProjectPath(), 'package.json'))) {
				spawnExternalCommand('npm', ['init']) || die('npm init run failed');
			}
			if (!existsSync(resolve(getProjectPath(), '.git'))) {
				spawnExternalCommand('git', ['init']) || die('git init run failed');
			}
		} else {
			die('    you can add -f to let us run `npm init` for you.');
		}
	}
	
	if (existsSync(getConfigPath())) {
		console.error(`"${getConfigPath()}" is already exists. update instead.`);
		
		update();
	} else {
		const pkg = require(projectPackageJson());
		
		mkdirpSync(getTempPath());
		
		const source = resolve(MicroBuildRoot, 'template/default-build-config.ts');
		console.log('copy template build file %s to %s', source, getConfigPath());
		const content = readFileSync(source, 'utf-8').replace(/your-project-name/g, pkg.name);
		writeFileSync(getConfigPath(), content, 'utf-8');
		
		update();
	}
	
	const BUILD_MD = projectFile('BUILD.md');
	if (!existsSync(BUILD_MD)) {
		console.log('create BUILD.md file');
		const readMe = projectFileObject('BUILD.md');
		
		const pkgJson = new PackageJsonFile(projectFile('package.json'), true);
		const content = pkgJson.content;
		if (!content.scripts) {
			content.scripts = {};
		}
		if (!content.hasOwnProperty('private')) {
			content.private = true;
		}
		if (!content.scripts.build) {
			content.scripts.build = 'microbuild build';
		}
		if (!content.scripts.service) {
			content.scripts.service = 'microbuild control';
		}
		pkgJson.write();
		
		readMe.append(`# ${pkgJson.content.name}`);
		readMe.append(`** please edit this file **`);
		readMe.append("");
		
		const defaultReadme = templateFileObject('BUILD.md');
		readMe.append(defaultReadme.content);
		
		readMe.write();
	}
}
