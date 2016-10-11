import {resolve} from "path";
import {writeFileSync, readFileSync, chmodSync} from "fs";
import {MicroBuildConfig, ELabelNames, EPlugins} from "../library/microbuild-config";
import {getTempPath, getConfigPath} from "../library/file-paths";
import {run_script} from "../library/shim-require-file";
import {injectJsonEnv} from "../library/json-env-cli";
import {createDockerfile} from "./docker-file";
import {createServiceFile} from "./system-service";
import {createAdminScript} from "./admin-script";
import {createDebugScript} from "./debug-script";
import {ConfigJsonFile} from "../library/config-json-file";

export function createBuildTempFiles(builder: MicroBuildConfig) {
	createDockerfile(builder);
	createServiceFile(builder);
	createAdminScript(builder);
	createDebugScript(builder);
}

export function saveJsonFile(file, content: any) {
	console.error('saving file %s...', file);
	const cfg = new ConfigJsonFile(resolve(getTempPath(), file), true);
	cfg.replaceContent(content);
	cfg.write();
}

export function saveFile(file, content: string, mode: string = '') {
	console.error('saving file %s...', file);
	const path = resolve(getTempPath(), file);
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
	const builder = new MicroBuildConfig();
	const context: IContextDefine = {
		build: builder,
	};
	
	try {
		run_script(code, filename, context);
	} catch (e) {
		if (e.message.indexOf('JsonEnv is not defined') !== -1) {
			context.JsonEnv = injectJsonEnv();
			builder.addPlugin(EPlugins.jenv);
			run_script(code, filename, context);
		} else {
			throw e;
		}
	}
	
	const labelArr: string[] = <string[]>builder.getNsgLabel(ELabelNames.alias) || [];
	labelArr.push(builder.toJSON().projectName);
	labelArr.push(builder.toJSON().domain);
	builder.nsgLabel(ELabelNames.alias, labelArr);
	
	return builder;
}
