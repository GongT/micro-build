import {hideGlobal} from "@gongt/ts-stl-library/pattern/hide-global";
import {FileChange} from "@gongt/ts-stl-server/file-operation/file-change";
import {readFileSync} from "fs";
import {pathExistsSync} from "fs-extra";
import {ExitCode, ExitStatus} from "../../bin/command-switch";
import {output} from "../common/cli-process";
import {PathResolver} from "../common/paths";
import {runExternalCommand} from "../common/spawn";
import {ConfigFile} from "./config-file";

export function readConfigFile(path: PathResolver, config: ConfigFile) {
	const filePath = path.configFile;
	process.stderr.write('read config: ' + filePath);
	
	const tempFile = path.getTempFile('config.js');
	const changer = new FileChange(filePath, path.getTempFile('config.md5'));
	
	if (!pathExistsSync(tempFile) || changer.changed) {
		process.stderr.write(', recompiling...\r');
		const [ret, stdout] = runExternalCommand(path, [
			'tsc', '-p', path.resolveHelperFile('tsconfig.json'),
		]);
		if (ret !== 0) {
			output('\n\n' + stdout);
			throw new ExitStatus(ExitCode.config_error, 'compile failed');
		}
		changer.store();
		console.error('compiled: %s\x1B[K', tempFile);
	} else {
		output(' -> %s', tempFile);
	}
	
	const un = hideGlobal('config', config);
	try {
		require(tempFile);
	} catch (e) {
		throw e;
	}
	un();
}
