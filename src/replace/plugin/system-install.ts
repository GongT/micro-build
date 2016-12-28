import {MicroBuildConfig} from "../../library/microbuild-config";
import {alpineInstall, alpineUninstall} from "./alpine";

export function systemUninstall(config: MicroBuildConfig, systemInstallList = config.toJSON().systemInstall): string[] {
	if (systemInstallList.length === 0) {
		return [];
	}
	
	let method = config.toJSON().systemMethod;
	if (!method) {
		const base = config.toJSON().base;
		if (base.indexOf('alpine')) {
			method = 'apk';
		}
	}
	switch (method) {
	case 'apk':
		return alpineUninstall(config, systemInstallList);
	default:
		throw new Error(`unknown system uninstall method: ${method || 'undefined'}.`);
	}
}
export function systemInstall(config: MicroBuildConfig, systemInstallList = config.toJSON().systemInstall): string[] {
	if (systemInstallList.length === 0) {
		return [];
	}
	
	let method = config.toJSON().systemMethod;
	if (!method) {
		const base = config.toJSON().base;
		if (base.indexOf('alpine')) {
			method = 'apk';
		}
	}
	switch (method) {
	case 'apk':
		return alpineInstall(config, systemInstallList);
	default:
		throw new Error(`unknown system install method: ${method || 'undefined'}.`);
	}
}
