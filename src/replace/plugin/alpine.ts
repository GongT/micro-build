import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";

export function alpineInstall(config: MicroBuildConfig) {
	if (!config.getPlugin(EPlugins.alpine)) {
		config.addPlugin(EPlugins.alpine, {
			version: '3.4'
		});
	}
	if (config.getPluginList(EPlugins.alpine).length > 1) {
		throw new Error('you enabled plugin EPlugins.alpine more than once.');
	}
	
	if (config.toJSON().isChina) {
		const alpineConfig = config.getPlugin(EPlugins.alpine) || {};
		const version = alpineConfig.version || '3.4';
		
		return `
# install system package of alpine (in china)
RUN echo "http://mirrors.aliyun.com/alpine/v${version}/main" > /etc/apk/repositories && \\
    echo "http://mirrors.aliyun.com/alpine/v${version}/community" >> /etc/apk/repositories && \\
    apk -U add ${config.toJSON().systemInstall.join(' ')}
`;
	} else {
		return `
# install system package of alpine
RUN apk -U add ${config.toJSON().systemInstall.join(' ')}
`;
	}
}
