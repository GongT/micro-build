import {EPlugins, MicroBuildConfig} from "../../library/microbuild-config";

export default function typescript(config: MicroBuildConfig) {
	const ts_plugin = config.getPluginList(EPlugins.typescript);
	
	if (!ts_plugin || !ts_plugin.length) {
		return '# typescript plugin not enabled';
	}
	const build = ts_plugin.map(({options}) => {
		const SOURCE = options.source || './src';
		const TARGET = options.target || './dist';
		return `mkdir -p "${TARGET}" && \\
	tsc -p "${SOURCE}" --outDir "${TARGET}"`;
	});
	
	let content = '# typescript compile \n';
	
	content += 'COPY ' + ts_plugin.map(({options}) => {
			const SOURCE = options.source || './src';
			return `"${SOURCE}" "/data/${SOURCE}"`;
		}).join('\nCOPY ') + '\n';
	
	if (config.getPlugin(EPlugins.jenv)) {
		content += 'COPY .jsonenv/_current_result.json.d.ts /data/.jsonenv/_current_result.json.d.ts\n';
	}
	
	content += 'RUN ' + ['set -x'].concat(
			['/install/npm/global-installer typescript@latest'],
			build,
			['/install/npm/global-installer uninstall typescript']
		).join(' && \\\n\t');
	
	return content;
}
