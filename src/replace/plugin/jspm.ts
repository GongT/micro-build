import {getTempPath} from "../../library/file-paths";
import {resolve} from "path";
import {existsSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {_guid} from "./_guid";
import {MicroBuildConfig} from "../../library/microbuild-config";

export function jspm_install_command(config: MicroBuildConfig) {
	const npm = config.getNpmConfig();
	const github = config.getGithubConfig();
	const actions = [];
	
	if (npm.url) {
		actions.push(`jspm config registries.npm.registry ${npm.url}`)
	}
	if (github.token) {
		actions.push(`jspm config registries.github.auth ${github.token}`)
	}
	
	if (actions.length) {
		return 'RUN ' + actions.join();
	} else {
		return '';
	}
}

export function createTempPackageFileForJspm(json: IPackageJson) {
	const packageFileContent = {
		name: 'installing-package',
		jspm: json.jspm,
		version: '1.0.0',
		description: 'xxx',
		repository: 'xxx',
	};
	
	const dir = resolve(getTempPath(), 'package-json');
	if (!existsSync(dir)) {
		mkdirpSync(dir);
	}
	const fileName = `${_guid()}.json`;
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(packageFileContent, null, 8), 'utf-8');
	
	return fileName;
}
