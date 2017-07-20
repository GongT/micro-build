import {readFileSync} from "fs";
import {MicroBuildConfig, ELabelNames, EPlugins} from "./microbuild-config";
import {MicroBuildHelper} from "./microbuild-helper";
import {run_script} from "./system/shim-require-file";
import {injectJsonEnv} from "./cli/json-env-cli";
import {getConfigPath, getTempPath} from "./common/file-paths";

export const dontRemoveReg = /^[\s\S]*\|\s+<?\*\*DON'T EDIT ABOVE THIS LINE\*\*>?\s+\|/;
export const dontRemoveString = ` +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |`;
let _cached: string;
let lastBuilder: MicroBuildConfig;

export function readBuildConfig(): MicroBuildConfig {
	const filename = getConfigPath();
	if (_cached === getTempPath()) {
		return lastBuilder;
	}
	_cached = getTempPath();
	
	const constDefines = [
		'const ELabelNames = ' + JSON.stringify(ELabelNames),
		'const EPlugins = ' + JSON.stringify(EPlugins),
	];
	
	const code = readFileSync(filename, 'utf-8')
		.replace(dontRemoveReg, (str) => {
			return constDefines.join(';') + ` /* ` + str;
		});
	
	let builder = new MicroBuildConfig();
	let helper = new MicroBuildHelper(builder);
	
	try {
		console.error('include config file...');
		run_script(code, filename, {
			build: builder,
			helper: helper,
		});
	} catch (e) {
		if (e.message.indexOf('JsonEnv is not defined') !== -1) {
			console.error('used json env, retry...');
			const JsonEnv = injectJsonEnv();
			console.error('create builder...');
			builder = new MicroBuildConfig();
			builder.addPlugin(EPlugins.jenv);
			let helper = new MicroBuildHelper(builder);
			run_script(code, filename, {
				build: builder,
				helper: helper,
				JsonEnv,
			});
		} else {
			throw e;
		}
	}
	
	builder.runOnConfig();
	
	console.error('\x1B[38;5;10mconfig success!\x1B[0m');
	
	lastBuilder = builder;
	
	return builder;
}
