import {resolve, dirname} from "path";
import {writeFileSync, readFileSync, chmodSync, existsSync} from "fs";
import {MicroBuildConfig, ELabelNames, EPlugins} from "../library/microbuild-config";
import {getTempPath, getConfigPath} from "../library/file-paths";
import {run_script} from "../library/shim-require-file";
import {injectJsonEnv} from "../library/json-env-cli";
import {createDockerfile} from "./docker-file";
import {createServiceFile} from "./system-service";
import {createAdminScript} from "./admin-script";
import {createDebugScript} from "./debug-script";
import {ConfigJsonFile} from "../library/config-json-file";
import {sync as mkdirpSync} from "mkdirp";

export function createBuildTempFiles(builder: MicroBuildConfig) {
	createDockerfile(builder);
	createServiceFile(builder);
	createAdminScript(builder);
	createDebugScript(builder);
}

export function saveJsonFile(file, content: any) {
	// console.error('saving file %s...', file);
	const cfg = new ConfigJsonFile(resolve(getTempPath(), file), true);
	cfg.replaceContent(content);
	cfg.write();
}

export function saveFile(file, content: string, mode: string = '') {
	// console.error('saving file %s...', file);
	const path = resolve(getTempPath(), file);
	if (!existsSync(dirname(path))) {
		mkdirpSync(dirname(path))
	}
	writeFileSync(path, content, 'utf8');
	if (mode) {
		chmodSync(path, mode);
	}
}

interface IContextDefine {
	build: MicroBuildConfig,
	JsonEnv?: any,
}

const removeReg = /^[\s\S]*<\*\*DON'T EDIT ABOVE THIS LINE\*\*>/;

export function readBuildConfig(): MicroBuildConfig {
	const filename = getConfigPath();
	
	const constDefines = [
		'const ELabelNames = ' + JSON.stringify(ELabelNames),
		'const EPlugins = ' + JSON.stringify(EPlugins),
	];
	
	const code = readFileSync(filename, 'utf-8')
		.replace(removeReg, constDefines.join(';') + '/*$&');
	let builder = new MicroBuildConfig();
	
	try {
		console.log('include config file...');
		run_script(code, filename, {
			build: builder,
		});
	} catch (e) {
		if (e.message.indexOf('JsonEnv is not defined') !== -1) {
			console.log('used json env, retry...');
			const JsonEnv = injectJsonEnv();
			console.log('create builder...');
			builder = new MicroBuildConfig();
			builder.addPlugin(EPlugins.jenv);
			run_script(code, filename, {
				build: builder,
				JsonEnv
			});
		} else {
			throw e;
		}
	}
	
	console.log('config success!');
	
	const labelArr: string[] = <string[]>builder.getSpecialLabel(ELabelNames.alias) || [];
	labelArr.push(builder.toJSON().projectName);
	labelArr.push(builder.toJSON().domain);
	builder.specialLabel(ELabelNames.alias, labelArr);
	
	return builder;
}
