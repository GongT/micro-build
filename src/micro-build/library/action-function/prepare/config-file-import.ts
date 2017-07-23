import {TextFile} from "@gongt/ts-stl-server/file-operation/text-file";
import {ConfigFile} from "../../config/config-file";

export function updateConfigFileImports({path}: ConfigFile) {
	const config = new TextFile(path.configFile, 'utf8', true);
	if (!config.exists()) {
		const template = new TextFile(path.resolveTemplateFile('config.ts'), 'utf8', false);
		config.replaceContent(template.content);
	}
	config.write();
}
