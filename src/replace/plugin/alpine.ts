import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {updateResolve} from "../../build/scripts";

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
	
	return [
		`update-resolve`,
		`update-alpine`,
		`apk -U add ${installList.join(' ')}`,
	];
}
