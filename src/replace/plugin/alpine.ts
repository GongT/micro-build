import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";

export function alpineUninstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	return [
		`apk del ${installList.join(' ')}`
	];
}

export function alpineInstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	if (!config.getPlugin(EPlugins.alpine)) {
		config.addPlugin(EPlugins.alpine, {
			version: '3.4'
		});
	}
	if (config.getPluginList(EPlugins.alpine).length > 1) {
		throw new Error('you enabled plugin EPlugins.alpine more than once.');
	}
	
	if (config.toJSON().gfwConfig.active) {
		const alpineConfig = config.getPlugin(EPlugins.alpine) || {};
		const version = alpineConfig.version || '3.4';
		
		return [
			`update-resolve`,
			`echo "http://mirrors.aliyun.com/alpine/v${version}/main" > /etc/apk/repositories`,
			`echo "http://mirrors.aliyun.com/alpine/v${version}/community" >> /etc/apk/repositories`,
			`apk -U add ${installList.join(' ')}`,
		];
	} else {
		return [
			`update-resolve`,
			`apk -U add ${installList.join(' ')}`
		];
	}
}
