import {MicroBuildConfig} from "../library/microbuild-config";
import {ConfigJsonFile} from "../library/config-json-file";
import {resolve} from "path";
import {readFileSync, existsSync} from "fs";
import {PackageJsonFile} from "../library/package-json-file";

const templateDir = resolve(__dirname, '../../template');
const mainTemplate = readFileSync(resolve(templateDir, 'prepend.Dockerfile'));
const npmInstallTemplate = readFileSync(resolve(templateDir, 'npm-install.Dockerfile'));

export interface IDockerOptions {
	extraDockerFilePath?: string,
}

export function DocerFileReplacer(config: MicroBuildConfig, options: IDockerOptions) {
	const npmInstallInstruction = config.getInstall().map((packagejsonPath) => {
		const pkg = new PackageJsonFile(packagejsonPath);
		const deps: Object = pkg.content.dependencies;
		
		return replacer(npmInstallTemplate, {
			NPM_INSTALL: '',
			DIR: '',
		});
	});
	
	return replacer(mainTemplate, {
		NPM_INSTALL_INSTRUCTIONS: npmInstallInstruction.join('\n\n'),
		START_SCRIPT: '',
		BUILD_ARGUMENTS: '',
		LABEL_INSTRUCTIONS: '',
		NSG_LABEL_INSTRUCTIONS: '',
		CUSTOM_BUILD: readFileSyncEnsure(options.extraDockerFilePath),
	});
}
function readFileSyncEnsure(f) {
	if (existsSync(f)) {
		return readFileSync(f);
	} else {
		throw new Error(`custom Dockerfile defined, but not found: ${f}`);
	}
}

function replacer(template, vars) {
	
}
