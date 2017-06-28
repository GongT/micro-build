import {existsSync, readFileSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {resolve} from "path";
import {
	assertCurrentDirOk,
	getConfigPath,
	getProjectPath,
	getTempPath,
	MicroBuildTemplateRoot,
	projectFile,
	projectFileObject,
	projectPackageJson,
	templateFileObject,
	updateCurrentDir,
} from "../../library/common/file-paths";
import {PackageJsonFile} from "../../library/config-file/package-json-file";
import {spawnExternalCommand} from "../../library/system/spawn/spawn-child";
import {NormalizedArguments} from "../argument-parser/real-parse";
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

export function initialize(this: NormalizedArguments|any, target: string = '.') {
	const opt = this && this.namedOptions || {};
	console.error('initialize new project in ', target);
	updateCurrentDir(target, true);
	
	let exists = true;
	try {
		assertCurrentDirOk()
	} catch (e) {
		exists = false
	}
	if (!exists) {
		if (opt['force']) {
			console.error('    run npm init: ');
			if (!existsSync(resolve(getProjectPath(), 'package.json'))) {
				spawnExternalCommand('npm', ['init']) === 0 || die('npm init run failed');
			}
			if (!existsSync(resolve(getProjectPath(), '.git'))) {
				spawnExternalCommand('git', ['init']) === 0 || die('git init run failed');
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
		
		const source = resolve(MicroBuildTemplateRoot, 'default-build-config.ts');
		console.error('copy template build file %s to %s', source, getConfigPath());
		const content = readFileSync(source, {encoding: 'utf8'}).replace(/your-project-name/g, pkg.name);
		writeFileSync(getConfigPath(), content, {encoding: 'utf8'});
		
		update();
	}
	
	const BUILD_MD = projectFile('BUILD.md');
	if (!existsSync(BUILD_MD)) {
		console.error('create BUILD.md file');
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
