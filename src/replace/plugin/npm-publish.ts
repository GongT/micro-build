import {resolve} from "path";
import {getTempPath} from "../../library/common/file-paths";
import {saveFile} from "../../library/config-file/fast-save";
import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";
import {DOCKERFILE_RUN_SPLIT} from "../base";
import {CustomInstructions} from "../instructions-dockerfile";
import {renderTemplateScripts} from "../replace-scripts";
import {getNpmScriptReplacer} from "./npm";

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
		
		const copyInstructions: string[] = ['set -x && '];
		if (options.copy) {
			Object.keys(options.copy).forEach((from) => {
				const sourceFile = resolve('/data', from);
				const targetPath = resolve('/data', options.copy[from]);
				copyInstructions.push(`{ if [ ! -e ${JSON.stringify(sourceFile)} ]; then echo "No ${sourceFile} for copy" >&2; exit 1; fi ; }` +
				                      `${DOCKERFILE_RUN_SPLIT}\tcp -rv ${JSON.stringify(sourceFile)} ${JSON.stringify(targetPath)}${DOCKERFILE_RUN_SPLIT}\t`);
			});
		}
		
		const target = `/data/${options.path}`;
		ret.push(`${copyInstructions.join('')}cd ${JSON.stringify(target)}${DOCKERFILE_RUN_SPLIT}` +
		         `  { if [ ! -e "./package.json" ]; then echo "No package.json for publish" >&2; exit 1; fi ; }${DOCKERFILE_RUN_SPLIT}` +
		         `  /install/npm/npm-publish-private`)
	});
	
	if (ret.length) {
		return 'RUN ' + ret.join(DOCKERFILE_RUN_SPLIT);
	} else {
		return '# no npm publish';
	}
}
