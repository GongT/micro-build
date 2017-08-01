import {MicroBuildConfig, EPlugins} from "../../library/microbuild-config";
import {updateResolve} from "../../build/scripts";

export function alpineUninstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	return [
		`HTTP_PROXY='' HTTPS_PROXY='' apk del --purge ${installList.join(' ')}`
	];
}

export function alpineInstall(config: MicroBuildConfig, installList: string[]): string[] {
	if (installList.length === 0) {
		return [];
	}
	
	return [
		`update-resolve`,
		`update-alpine`,
		`HTTP_PROXY='' HTTPS_PROXY='' apk -U add ${installList.join(' ')}`,
	];
}
