import {MicroBuildConfig} from "../../library/microbuild-config";
import {alpineInstall, alpineUninstall} from "./alpine";
import {ubuntuUninstall, ubuntuInstall} from "./ubuntu";

export function systemUninstall(config: MicroBuildConfig, systemInstallList = config.toJSON().systemInstall): string[] {
	if (systemInstallList.length === 0) {
		return [];
	}
	
	const method = detectSystemPackageType(config);
	switch (method) {
	case 'apk':
		return alpineUninstall(config, systemInstallList);
	case 'apt-get':
		return ubuntuUninstall(config, systemInstallList);
	default:
		throw new Error(`unknown system uninstall method: ${method || 'undefined'}.`);
	}
}
export function systemInstall(config: MicroBuildConfig, systemInstallList = config.toJSON().systemInstall): string[] {
	if (systemInstallList.length === 0) {
		return [];
	}
	
	const method = detectSystemPackageType(config);
	switch (method) {
	case 'apk':
		return alpineInstall(config, systemInstallList);
	case 'apt-get':
		return ubuntuInstall(config, systemInstallList);
	default:
		throw new Error(`unknown system install method: ${method || 'undefined'}.`);
	}
}

export function detectSystemPackageType(config: MicroBuildConfig) {
	let method = config.toJSON().systemMethod;
	if (!method) {
		const base = config.toJSON().base;
		if (base.indexOf('alpine')) {
			method = 'apk';
		}
	}
	return method;
}
