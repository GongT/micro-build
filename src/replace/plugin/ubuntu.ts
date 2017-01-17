import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {updateResolve} from "../../build/scripts";

export function ubuntuUninstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	return [
		`apt-get autoremove -y ${installList.join(' ')}`
	];
}

export function ubuntuInstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	
	// todo ubuntu version and aliyun repo
	
	if (config.toJSON().gfwConfig.active) {
		return [
			`update-resolve`,
			`apt-get update`,
			`apt-get install -y ${installList.join(' ')}`,
		];
	} else {
		return [
			`update-resolve`,
			`apt-get update`,
			`apt-get install -y ${installList.join(' ')}`
		];
	}
}
