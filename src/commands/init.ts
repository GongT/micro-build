import {existsSync, writeFileSync, readFileSync} from "fs";
import {resolve} from "path";
import {sync as mkdirpSync} from "mkdirp";
import update from "./update";
import {
	MicroBuildRoot,
	projectFile,
	templateFileObject,
	projectFileObject,
	getTempPath,
	getConfigPath,
	updateCurrentDir
} from "../library/file-paths";
import {PackageJsonFile} from "../library/package-json-file";

export default function init(targetPath?: string) {
	if (targetPath) {
		updateCurrentDir(targetPath, true);
	}
	
	if (existsSync(getConfigPath())) {
		console.error(`"${getConfigPath()}" is already exists.`);
		
		update();
	} else {
		mkdirpSync(getTempPath());
		
		const source = resolve(MicroBuildRoot, 'template/default-build-config.ts');
		console.log('copy template build file %s to %s', source, getConfigPath());
		writeFileSync(getConfigPath(), readFileSync(source));
		
		update();
	}
	
	const README_MD = projectFile('README.md');
	if (!existsSync(README_MD)) {
		console.log('create README.md file');
		const readMe = projectFileObject('README.md');
		
		const pkgJson = new PackageJsonFile(projectFile('package.json'), true);
		readMe.append(`# ${pkgJson.content.name}`);
		readMe.append(`** Project Name **`);
		readMe.append("");
		
		const defaultReadme = templateFileObject('README.md');
		readMe.append(defaultReadme.content);
		
		readMe.write();
	}
}
