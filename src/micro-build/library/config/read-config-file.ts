import {hideGlobal} from "@gongt/ts-stl-library/pattern/hide-global";
import {FileChange} from "@gongt/ts-stl-server/file-operation/file-change";
import {pathExistsSync} from "fs-extra";
import {println, programSection, programSectionEnd} from "../../bin/error";
import {createTsConfig} from "../action-function/prepare/create-tsconfig";
import {PathResolver} from "../common/paths";
import {ScriptsRunner} from "../engine/script-run";
import {ConfigFile} from "./config-file";

export async function readConfigFile(path: PathResolver, config: ConfigFile) {
	const filePath = path.configFile;
	const tempFile = path.resolveTempFile('config.js');
	const changer = new FileChange(filePath, path.resolveTempFile('config.md5'));
	
	if (!pathExistsSync(tempFile) || changer.changed) {
		programSection('recompile config file');
		println('compiling config file...');
		const runner = new ScriptsRunner('tscp');
		createTsConfig(path);
		await runner.assumeSuccess(path.resolveHelperFile('tsconfig.json'));
		changer.store();
		println('config file compiled.');
		programSectionEnd();
	}
	
	const un = hideGlobal('config', config);
	try {
		programSection('run config file');
		require(tempFile);
		programSectionEnd();
	} catch (e) {
		throw e;
	}
	un();
}
