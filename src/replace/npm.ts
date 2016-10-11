import {resolve, join} from "path";
import {existsSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";
import {getTempPath, tempDirName} from "../library/file-paths";
import createGuid from "../library/guid";
import {injectJsonEnv} from "../library/json-env-cli";

const guid = createGuid();

const china = `npm install
--progress=force
--registry=https://registry.npm.taobao.org
--cache=/cache/cnpm
--disturl=https://npm.taobao.org/dist
--userconfig=/cache/cnpmrc`.replace(/\n/g, ' ');

const normal = `npm install
--progress=force
--cache=/cache/npm
--userconfig=/cache/npmrc`.replace(/\n/g, ' ');

export function npm_install_command(config: MicroBuildConfig) {
	const isJsonEnvEnabled = config.getPlugin(EPlugins.jenv);
	if (isJsonEnvEnabled) {
		injectJsonEnv();
	} else {
		config.buildArgument('is-china', 'no');
	}
	
	let cmd;
	if (isJsonEnvEnabled) {
		cmd = JSON.stringify(JsonEnv.isChina? china : normal);
	} else {
		cmd = `$( [[ "$IS_CHINA" == "yes" ]] && echo ${JSON.stringify(china)} || echo ${JSON.stringify(normal)})`;
	}
	
	return `RUN T=/bin/npm-install ; \\
	echo '#!/bin/sh' >$T ; \\
	echo '[ -n "$@" ] && cd $@' >>$T ; \\
	echo ${cmd} >>$T ; \\
	chmod a+x $T`;
}

export function createTempPackageFile(json: IPackageJson) {
	const dir = resolve(getTempPath(), 'packagejson');
	if (!existsSync(dir)) {
		mkdirpSync(dir);
	}
	const fileName = `${guid()}.json`;
	
	json.name = 'xxx';
	json.version = '1.0.0';
	json.description = 'xxx';
	json.repository = 'xxx';
	
	writeFileSync(resolve(dir, fileName), JSON.stringify(json, null, 8), 'utf-8');
	
	return join(tempDirName, 'packagejson', fileName);
}
