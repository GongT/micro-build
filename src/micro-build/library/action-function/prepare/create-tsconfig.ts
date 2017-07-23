import {ConfigJsonFile} from "@gongt/ts-stl-server/file-operation/config-json-file";
import {resolve} from "path";
import {MICROBUILD_ROOT, PathResolver} from "../../common/paths";

export function createTsConfig(path: PathResolver) {
	const target = path.resolveHelperFile('tsconfig.json');
	
	const tsconfig = new ConfigJsonFile<any>(path.resolveTemplateFile('tsconfig.json'));
	tsconfig.content.compilerOptions.paths['@gongt/micro-build'] = [MICROBUILD_ROOT];
	tsconfig.content.compilerOptions.paths['@gongt/micro-build/*'] = [resolve(MICROBUILD_ROOT, '*')];
	tsconfig.content.compilerOptions.baseUrl = MICROBUILD_ROOT;
	tsconfig.writeTo(target);
}
