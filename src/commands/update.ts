import {resolve, basename} from "path";
import {realpathSync, symlinkSync, unlinkSync} from "fs";
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
	const gitIgnore = projectFileObject('.gitignore');
	if (!gitIgnore.hasLine(`${tempDirName}/*`)) {
		console.log('update .gitignore file');
		gitIgnore.uniqueAppend(defaultIgnores);
		gitIgnore.uniqueAppend(`${tempDirName}/*`);
		gitIgnore.uniqueAppend(`!${tempDirName}/config.ts`);
		gitIgnore.uniqueAppend('dist/');
		gitIgnore.write();
	}
	
	const npmIgnore = projectFileObject('.npmignore');
	const npmInited = npmIgnore.exists();
	if (!npmIgnore.hasLine(`${tempDirName}/*`)) {
		console.log('update .npmignore file');
		npmIgnore.uniqueAppend(defaultIgnores);
		npmIgnore.uniqueAppend(`${tempDirName}/*`);
		npmIgnore.uniqueAppend(`!${tempDirName}/config.ts`);
		npmIgnore.write();
	}
	
	const dockerIgnore = projectFileObject('.dockerignore');
	if (!dockerIgnore.hasLine(tempDirName)) {
		console.log('update .dockerignore file');
		dockerIgnore.uniqueAppend(tempDirName);
		const fixedIgnores = defaultIgnores.slice();
		fixedIgnores.splice(defaultIgnores.indexOf('typings/'), 1);
		dockerIgnore.uniqueAppend(fixedIgnores);
		dockerIgnore.uniqueAppend(`!${tempDirName}/packagejson`);
		dockerIgnore.uniqueAppend(`!${tempDirName}/json-env-data.json`);
		dockerIgnore.write();
	}
	
	console.log('update microbuild-config.d.ts file');
	mkdirpSync(resolve(getTempPath(), 'x'));
	const targetDts = resolve(getTempPath(), 'x/microbuild-config.d.ts');
	try {
		unlinkSync(targetDts);
	} catch (e) {
	}
	const dtsFilePath = realpathSync(resolve(MicroFilesRoot, 'library/microbuild-config.d.ts'));
	symlinkSync(dtsFilePath, targetDts);
	
	const pkgJsonFile = new PackageJsonFile(projectFile('package.json'), true);
	if (pkgJsonFile.exists() || !npmInited) {
		console.log('update package.json file');
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
	}
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
