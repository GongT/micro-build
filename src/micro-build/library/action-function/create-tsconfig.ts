import {ConfigJsonFile} from "@gongt/ts-stl-server/file-operation/config-json-file";
import {resolve} from "path";
import {MICROBUILD_ROOT, PathResolver} from "../common/paths";

export function createTsConfig(mb: ap) {
	const helperFolder = resolve(MICROBUILD_ROOT, 'template/_');
	const target = path.resolveHelperFile('tsconfig.json');
	
	const tsconfig = new ConfigJsonFile<any>(resolve(helperFolder, 'tsconfig.json'));
	
	
	tsconfig.content.compilerOptions.baseUrl = resolve(MICROBUILD_ROOT, '..');
	tsconfig.writeTo();
}
