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
import {PackageJsonFile} from "../../library/package-json-file";
import {
	projectFile,
	projectFileObject,
	tempDirName,
	getProjectPath,
	getTempPath,
	MicroBuildRoot
} from "../../library/file-paths";
import {readBuildConfig, dontRemoveReg} from "../../build/all";
import {EPlugins} from "../../library/microbuild-config";
import {getSavePaths} from "../../replace/plugin/jspm-bundle";
import {rmdirsSync} from "nodejs-fs-utils";
import {CommandDefine} from "../command-library";

export const commandDefine: CommandDefine = {
	command: 'update',
	description: '/* update */',
};

const sectionStart = 'START MICRO-BUILD SECTION >>> ';
const sectionEnd = '<<< END MICRO-BUILD SECTION';

export function update() {
	const builder = readBuildConfig();
	const extraFolders = [];
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
	
	const gitIgnore = projectFileObject('.gitignore');
	gitIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat(gitIgnores, extraFolders, builder.registedIgnore));
	gitIgnore.write();
	
	const dockerIgnore = projectFileObject('.dockerignore');
	dockerIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat(dockerIgnores, extraFolders));
	dockerIgnore.write();
	
	const targetDts = resolve(getTempPath(), 'x');
	const dtsFilePath = realpathSync(resolve(MicroBuildRoot, 'template/x'));
	if (existsSync(targetDts)) {
		if (lstatSync(targetDts).isSymbolicLink()) {
			if (readlinkSync(targetDts) !== dtsFilePath) {
				unlinkSync(targetDts);
				symlinkSync(dtsFilePath, targetDts);
			}
		} else {
			rmdirsSync(targetDts);
			symlinkSync(dtsFilePath, targetDts);
		}
	} else {
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
	
	const configFile = resolve(getTempPath(), 'config.ts');
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
	`!${tempDirName}`,
	`${tempDirName}/*`,
	`!${tempDirName}/config.ts`,
	
	'!.*ignore',
];

const dockerIgnores = [
	'*.md',
	'Dockerfile',
	'*.Dockerfile',
	'!.micro-build/json-env-data.json',
	'!.jsonenv/_current_result.json.d.ts',
	`!${tempDirName}/npm-install`,
	`!${tempDirName}/bin`,
	`!${tempDirName}/package-json`,
	`!${tempDirName}/jspm-install`,
	`!${tempDirName}/plugins`,
];

function slashEnd(str) {
	if (/\/$/.test(str)) {
		return str;
	} else {
		return str + '/';
	}
}
