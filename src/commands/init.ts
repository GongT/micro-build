import {existsSync, writeFileSync, readFileSync} from "fs";
import {resolve} from "path";
import {sync as mkdirpSync} from "mkdirp";
import {defaultPath, tempPath} from "../microbuild";
import update from "./update";
import {MicroBuildRoot, projectFile, templateFileObject, projectFileObject} from "../library/file-paths";
import {PackageJsonFile} from "../library/package-json-file";

export default function init() {
	if (existsSync(defaultPath)) {
		console.error(`"${defaultPath}" is already exists.`);
		
		update();
	} else {
		mkdirpSync(tempPath);
		
		const source = resolve(MicroBuildRoot, 'template/default-build-config.ts');
		console.log('copy template build file %s to %s', source, defaultPath);
		writeFileSync(defaultPath, readFileSync(source));
		
		update();
	}
	
	const README_MD = projectFile('README.md');
	if (!existsSync(README_MD)) {
		console.log('create README.md file');
		const readMe = projectFileObject('README.md');
		
		const pkgJson = new PackageJsonFile(projectFile('package.json'), true);
		readMe.uniqueAppend(`# ${pkgJson.content.name}`);
		readMe.uniqueAppend(`** Project Name **`);
		
		const defaultReadme = templateFileObject('README.md');
		readMe.uniqueAppend(defaultReadme.content);
		
		readMe.write();
	}
}
