import {resolve, basename} from "path";
import {realpathSync, symlinkSync, existsSync} from "fs";
import {projectPath, tempDirName, tempPath} from "../microbuild";
import {PackageJsonFile} from "../library/package-json-file";
import {MicroFilesRoot, projectFile, projectFileObject} from "../library/file-paths";

export default function update() {
	console.log('update .gitignore file');
	const gitIgnore = projectFileObject('.gitignore');
	gitIgnore.uniqueAppend(defaultIgnores);
	gitIgnore.uniqueAppend(tempDirName);
	gitIgnore.uniqueAppend(`!${tempDirName}/config.js`);
	gitIgnore.uniqueAppend('dist/');
	gitIgnore.write();
	
	console.log('update .npmignore file');
	const npmIgnore = projectFileObject('.npmignore');
	npmIgnore.uniqueAppend(defaultIgnores);
	npmIgnore.uniqueAppend(tempDirName);
	npmIgnore.write();
	
	console.log('update .dockerignore file');
	const dockerIgnore = projectFileObject('.dockerignore');
	dockerIgnore.uniqueAppend(defaultIgnores);
	dockerIgnore.write();
	
	console.log('update microbuild-config.d.ts file');
	const targetDts = resolve(tempPath, 'microbuild-config.d.ts');
	if (!existsSync(targetDts)) {
		const dtsFilePath = realpathSync(resolve(MicroFilesRoot, 'library/microbuild-config.d.ts'));
		symlinkSync(dtsFilePath, targetDts);
	}
	
	console.log('update package.json file');
	const pkgJson = new PackageJsonFile(projectFile('package.json'), true);
	pkgJson.addDependecy('json-env-data');
	pkgJson.addDevDependecy('typings');
	if (!pkgJson.content.name) {
		pkgJson.content.name = basename(projectPath);
	}
	pkgJson.write();
};

const defaultIgnores = [
	'.idea/',
	'.jsonenv/',
	'logs',
	'*.log',
	'npm-debug.log*',
	'pids',
	'*.pid',
	'*.seed',
	'lib-cov',
	'coverage',
	'.nyc_output',
	'.grunt',
	'.lock-wscript',
	'build/Release',
	'node_modules',
	'jspm_packages',
	'.npm',
	'.node_repl_history',
];
