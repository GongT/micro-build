import {
	existsSync,
	lstatSync,
	readFileSync,
	readlinkSync,
	realpathSync,
	symlinkSync,
	unlinkSync,
	writeFileSync,
} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {rmdirsSync} from "nodejs-fs-utils";
import {basename, resolve} from "path";
import {
	getGeneratePath,
	getProjectPath,
	getTempPath,
	MicroBuildRoot,
	projectFile,
	projectFileObject,
} from "../../library/common/file-paths";
import {defaultEnvironment} from "../../library/common/runenv";
import {PackageJsonFile} from "../../library/config-file/package-json-file";
import {EPlugins} from "../../library/microbuild-config";
import {dontRemoveReg, readBuildConfig} from "../../library/read-config";
import {getSavePaths} from "../../replace/plugin/jspm-bundle";
import {CommandDefine} from "../command-library";

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
				console.error('link target "%s" invalid, unlinkSync(%s)', readlinkSync(targetDts), targetDts);
				unlinkSync(targetDts);
				console.error('link %s -> %s', targetDts, dtsFilePath);
				symlinkSync(dtsFilePath, targetDts);
			}
		} else {
			console.error('rmdirsSync(%s)', targetDts);
			rmdirsSync(targetDts);
			console.error('link %s -> %s', targetDts, dtsFilePath);
			symlinkSync(dtsFilePath, targetDts);
		}
	} else {
		console.error('link %s -> %s', targetDts, dtsFilePath);
		symlinkSync(dtsFilePath, targetDts);
	}
	
	const pkgJsonFile = new PackageJsonFile(projectFile('package.json'), true);
	if (!pkgJsonFile.exists()) {
		console.error('create package.json file');
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
	const cfgContent = readFileSync(configFile, {encoding: 'utf8'});
	const currentContent = readFileSync(resolve(MicroBuildRoot, 'template/default-build-config.ts'), {encoding: 'utf8'});
	const xxx = dontRemoveReg.exec(currentContent);
	const yyy = dontRemoveReg.exec(cfgContent);
	if (!yyy) {
		const defFile = resolve(MicroBuildRoot, 'template/default-build-config.ts');
		throw new Error('do not remove header lines. \n    you can copy them from ' + defFile);
	}
	if (xxx[0] !== yyy[0]) {
		const newContent = cfgContent.replace(dontRemoveReg, xxx[0]);
		writeFileSync(configFile, newContent, {encoding: 'utf8'});
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
	'screen.*',
];

const gitIgnores = [
	'!.*ignore',
	'!.gitinclude',
];

const dockerIgnores = [
	'*.md',
	'Dockerfile',
	'*.Dockerfile',
	'build.config.ts',
	`!${getGeneratePath(true)}/json-env-data.json`,
	'!.jsonenv/_current_result.json.d.ts',
	`!${getTempPath(true)}/bin`,
	`!${getTempPath(true)}/jspm-install`,
	`!${getTempPath(true)}/npm-install`,
	`!${getTempPath(true)}/package-json`,
	`!${getTempPath(true)}/plugins`,
];

function slashEnd(str) {
	if (/\/$/.test(str)) {
		return str;
	} else {
		return str + '/';
	}
}
