import {resolve, basename} from "path";
import {realpathSync, symlinkSync, unlinkSync, existsSync} from "fs";
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
import {readBuildConfig} from "../build/all";
import {EPlugins} from "../library/microbuild-config";

const sectionStart = 'START MICRO-BUILD SECTION >>> ';
const sectionEnd = '<<< END MICRO-BUILD SECTION';

export default function update() {
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
	
	const gitIgnore = projectFileObject('.gitignore');
	gitIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat([
		`!${tempDirName}`,
		`${tempDirName}/*`,
		`!${tempDirName}/config.ts`,
		
		'!.*ignore',
	], extraFolders));
	gitIgnore.write();
	
	const dockerIgnore = projectFileObject('.dockerignore');
	dockerIgnore.section(sectionStart, sectionEnd, defaultIgnores.concat([
		'*.md',
		'!.micro-build/json-env-data.json',
		'!.jsonenv/_current_result.json.d.ts',
		`!${tempDirName}/npm-install`,
		`!${tempDirName}/package-json`,
		`!${tempDirName}/jspm-install`,
	], extraFolders));
	dockerIgnore.write();
	
	const targetDts = resolve(getTempPath(), 'x/microbuild-config.d.ts');
	if (!existsSync(targetDts)) {
		console.log('update microbuild-config.d.ts file');
		mkdirpSync(resolve(getTempPath(), 'x'));
		try {
			unlinkSync(targetDts);
		} catch (e) {
		}
		const dtsFilePath = realpathSync(resolve(MicroFilesRoot, 'library/microbuild-config.d.ts'));
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
};

const defaultIgnores = [
	'.*',
	'.tgz',
	'node_modules',
	'jspm_packages',
	'**/node_modules',
	'**/jspm_packages',
	'*.log',
	'npm-debug.log*',
	'coverage/',
];

function slashEnd(str) {
	if (/\/$/.test(str)) {
		return str + '/';
	} else {
		return str;
	}
}
