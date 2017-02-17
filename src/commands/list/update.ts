import {resolve, basename} from "path";
import {
	readFileSync,
	writeFileSync,
	realpathSync,
	symlinkSync,
	unlinkSync,
	existsSync,
	lstatSync,
	readlinkSync
} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {EPlugins} from "../../library/microbuild-config";
import {getSavePaths} from "../../replace/plugin/jspm-bundle";
import {rmdirsSync} from "nodejs-fs-utils";
import {CommandDefine} from "../command-library";
import {readBuildConfig, dontRemoveReg} from "../../library/read-config";
import {defaultEnvironment} from "../../library/common/runenv";
import {
	getProjectPath,
	projectFileObject,
	getTempPath,
	MicroBuildRoot,
	projectFile,
	getGeneratePath
} from "../../library/common/file-paths";
import {PackageJsonFile} from "../../library/config-file/package-json-file";

export const commandDefine: CommandDefine = {
	command: 'update',
	description: '/* update */',
};

const sectionStart = 'START MICRO-BUILD SECTION >>> ';
const sectionEnd = '<<< END MICRO-BUILD SECTION';

export function update() {
	defaultEnvironment('docker');
	const builder = readBuildConfig();
	const extraFolders = [], extraDockerIgnores = [];
	builder.getPluginList(EPlugins.node_scss).forEach(({options}) => {
		if (options && options.target) {
			extraFolders.push(slashEnd(options.target));
		}
	});
	builder.getPluginList(EPlugins.typescript).forEach(({options}) => {
		if (options && options.target) {
			extraFolders.push(slashEnd(options.target));
		}
	});
	builder.getPluginList(EPlugins.jspm_bundle).forEach(({options}) => {
		getSavePaths(options).forEach((path) => {
			extraFolders.push(path);
		});
	});
	const root = getProjectPath();
	Object.values(builder.toJSON().volume).forEach(({path}) => {
		if (path.indexOf(root) === 0 || !/^\//.test(path)) {
			const sigFile = resolve(root, path, '.gitinclude');
			const relPath = path.replace(root, '').replace(/^\//g, '');
			if (existsSync(sigFile)) {
				extraDockerIgnores.push(relPath);
				return;
			}
			
			extraFolders.push(relPath);
		}
	});
	
	const gitIgnore = projectFileObject('.gitignore');
	gitIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat(gitIgnores, extraFolders, builder.registedIgnore));
	gitIgnore.write();
	
	const dockerIgnore = projectFileObject('.dockerignore');
	dockerIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat(dockerIgnores, extraFolders, extraDockerIgnores));
	dockerIgnore.write();
	
	const targetDts = resolve(getGeneratePath(), 'x');
	mkdirpSync(targetDts);
	const dtsFilePath = realpathSync(resolve(MicroBuildRoot, 'template/.micro-build/x'));
	
	let exists = true;
	let isSymbolicLink = false;
	try {
		isSymbolicLink = lstatSync(targetDts).isSymbolicLink()
	} catch (e) {
		exists = false;
	}
	if (exists) {
		if (isSymbolicLink) {
			if (readlinkSync(targetDts) !== dtsFilePath) {
				console.log('link target "%s" invalid, unlinkSync(%s)', readlinkSync(targetDts), targetDts);
				unlinkSync(targetDts);
				console.log('link %s -> %s', targetDts, dtsFilePath);
				symlinkSync(dtsFilePath, targetDts);
			}
		} else {
			console.log('rmdirsSync(%s)', targetDts);
			rmdirsSync(targetDts);
			console.log('link %s -> %s', targetDts, dtsFilePath);
			symlinkSync(dtsFilePath, targetDts);
		}
	} else {
		console.log('link %s -> %s', targetDts, dtsFilePath);
		symlinkSync(dtsFilePath, targetDts);
	}
	
	const pkgJsonFile = new PackageJsonFile(projectFile('package.json'), true);
	if (!pkgJsonFile.exists()) {
		console.log('create package.json file');
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
	
	const configFile = resolve(getProjectPath(), 'build.config.ts');
	const cfgContent = readFileSync(configFile, 'utf-8');
	const currentContent = readFileSync(resolve(MicroBuildRoot, 'template/default-build-config.ts'), 'utf-8');
	const xxx = dontRemoveReg.exec(currentContent);
	const yyy = dontRemoveReg.exec(cfgContent);
	if (!yyy) {
		const defFile = resolve(MicroBuildRoot, 'template/default-build-config.ts');
		throw new Error('do not remove header lines. \n    you can copy them from ' + defFile);
	}
	if (xxx[0] !== yyy[0]) {
		const newContent = cfgContent.replace(dontRemoveReg, xxx[0]);
		writeFileSync(configFile, newContent, 'utf-8');
	}
}

const defaultIgnores = [
	'.*',
	'*.tgz',
	'node_modules',
	'jspm_packages',
	'**/node_modules',
	'**/jspm_packages',
	'*.log',
	'npm-debug.log*',
	'coverage/',
	'typings',
];

const gitIgnores = [
	'!.*ignore',
	'!.gitinclude',
];

const dockerIgnores = [
	'*.md',
	'Dockerfile',
	'*.Dockerfile',
	`!${getGeneratePath(true)}/json-env-data.json`,
	'!.jsonenv/_current_result.json.d.ts',
	`!${getGeneratePath(true)}/build-install`,
	`!${getTempPath(true)}/bin`,
	`!${getTempPath(true)}/plugins`,
];

function slashEnd(str) {
	if (/\/$/.test(str)) {
		return str;
	} else {
		return str + '/';
	}
}
