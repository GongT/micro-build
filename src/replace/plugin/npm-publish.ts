import {CustomInstructions} from "../instructions-dockerfile";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {saveFile} from "../../build/all";
import {renderTemplate} from "../replace-scripts";
import {getNpmScriptReplacer} from "./npm";
import {existsSync} from "fs";
import {resolve} from "path";
import {getProjectPath} from "../../library/file-paths";

export function npm_publish_command(config: MicroBuildConfig) {
	const replacer = getNpmScriptReplacer(config);
	const helperScript = renderTemplate('plugin', 'npm-publish-private-package.sh', replacer);
	saveFile('plugins/npm-publish-private', helperScript, '755');
	
	return `COPY .micro-build/plugins/npm-publish-private /npm-install/npm-publish-private
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
		ret.push(`cd ${JSON.stringify(target)} && /npm-install/npm-publish-private`)
	});
	
	if (ret.length) {
		return 'RUN ' + ret.join('&& \\\n\t');
	} else {
		return '# no npm publish';
	}
}
