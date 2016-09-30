import {resolve, basename} from "path";
import {realpathSync, symlinkSync, existsSync} from "fs";
import {PackageJsonFile} from "../library/package-json-file";
import {sync as mkdirpSync} from "mkdirp";
import {
	MicroFilesRoot,
	projectFile,
	projectFileObject,
	tempDirName,
	getProjectPath,
	getTempPath
} from "../library/file-paths";

export default function update() {
	console.log('update .gitignore file');
	const gitIgnore = projectFileObject('.gitignore');
	gitIgnore.uniqueAppend(defaultIgnores);
	gitIgnore.uniqueAppend(`${tempDirName}/*`);
	gitIgnore.uniqueAppend(`!${tempDirName}/config.ts`);
	gitIgnore.uniqueAppend('dist/');
	gitIgnore.write();
	
	console.log('update .npmignore file');
	const npmIgnore = projectFileObject('.npmignore');
	npmIgnore.uniqueAppend(defaultIgnores);
	npmIgnore.uniqueAppend(`${tempDirName}/*`);
	npmIgnore.uniqueAppend(`!${tempDirName}/config.ts`);
	npmIgnore.write();
	
	console.log('update .dockerignore file');
	const dockerIgnore = projectFileObject('.dockerignore');
	dockerIgnore.uniqueAppend(defaultIgnores);
	dockerIgnore.write();
	
	console.log('update microbuild-config.d.ts file');
	mkdirpSync(resolve(getTempPath(), 'x'));
	const targetDts = resolve(getTempPath(), 'x/microbuild-config.d.ts');
	if (!existsSync(targetDts)) {
		const dtsFilePath = realpathSync(resolve(MicroFilesRoot, 'library/microbuild-config.d.ts'));
		symlinkSync(dtsFilePath, targetDts);
	}
	
	console.log('update package.json file');
	const pkgJsonFile = new PackageJsonFile(projectFile('package.json'), true);
	pkgJsonFile.addDependecy('json-env-data');
	pkgJsonFile.addDevDependecy('typings');
	const pkgJson = pkgJsonFile.content;
	if (!pkgJson.name) {
		pkgJson.name = basename(getProjectPath());
	}
	if (!pkgJson.version) {
		pkgJson.version = '0.0.0';
	}
	if (!pkgJson.description) {
		pkgJson.description = '';
	}
	if (!pkgJson.repository) {
		pkgJson.repository = {};
	}
	
	pkgJsonFile.write();
};

const defaultIgnores = [
	'.git/',
	'.idea/',
	'.jsonenv/',
	'logs/',
	'*.log',
	'npm-debug.log*',
	'pids/',
	'*.pid',
	'*.seed',
	'lib-cov/',
	'coverage/',
	'.nyc_output',
	'.grunt',
	'.lock-wscript',
	'build/Release',
	'node_modules/',
	'jspm_packages/',
	'typings/',
	'.npm',
	'.node_repl_history',
];
