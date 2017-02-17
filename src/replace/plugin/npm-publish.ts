import {CustomInstructions} from "../instructions-dockerfile";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {renderTemplateScripts} from "../replace-scripts";
import {getNpmScriptReplacer} from "./npm";
import {existsSync} from "fs";
import {resolve} from "path";
import {saveFile} from "../../library/config-file/fast-save";
import {getProjectPath, getTempPath} from "../../library/common/file-paths";

export function npm_publish_command(config: MicroBuildConfig) {
	const replacer = getNpmScriptReplacer(config);
	const helperScript = renderTemplateScripts('plugin', 'npm-publish-private-package.sh', replacer);
	saveFile('plugins/npm-publish-private', helperScript, '755');
	
	return `COPY ${getTempPath(true)}/plugins/npm-publish-private /install/npm/npm-publish-private
`;
}

export function npm_publish_after(replacer: CustomInstructions) {
	const config = replacer.config;
	const ret = [];
	
	config.getPluginList(EPlugins.npm_publish).forEach(({options}) => {
		if (!options.path) {
			throw new Error('npm publish require a path. where package.json placed in');
		}
		if (!existsSync(resolve(getProjectPath(), options.path))) {
			throw new Error(`npm publish: package.json not found in ${options.path}`);
		}
		const target = `/data/${options.path}`;
		ret.push(`cd ${JSON.stringify(target)} && /install/npm/npm-publish-private`)
	});
	
	if (ret.length) {
		return 'RUN ' + ret.join('&& \\\n\t');
	} else {
		return '# no npm publish';
	}
}
