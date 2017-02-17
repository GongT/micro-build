import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";

export default function scss(config: MicroBuildConfig) {
	const scss_plugin = config.getPluginList(EPlugins.node_scss);
	
	if (!scss_plugin || !scss_plugin.length) {
		return '# scss plugin not enabled';
	}
	
	const build = scss_plugin.map(({options}) => {
		const SOURCE = options.source || './public/scss';
		const TARGET = options.target || './public/stylesheets';
		return `node-sass --recursive ${SOURCE} \\
		--output ${TARGET} \\
		--source-map true --source-map-contents scss`;
	});
	
	let content = '# scss compile \n';
	
	content += 'COPY ' + scss_plugin.map(({options}) => {
			const SOURCE = options.source || './src';
			return `"${SOURCE}" "/data/${SOURCE}"`;
		}).join('\nCOPY ');
	
	content += '\nRUN ' + ['set -x'].concat(
			['/install/npm/global-installer node-sass'],
			build,
			['/install/npm/global-installer uninstall node-sass']
		).join(' && \\\n\t');
	
	return content;
}
