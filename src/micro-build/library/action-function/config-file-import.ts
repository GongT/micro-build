import {TextFile} from "@gongt/ts-stl-server/file-operation/text-file";
import {PathResolver} from "../common/paths";

export function updateConfigFileImports(path: PathResolver) {
	const file = new TextFile(path.configFile, 'utf8', true);
	file.uniqueAppend('import {config} from "@gongt/micro-build";');
	file.write();
}
