import {writeFileSync, readFileSync, existsSync} from "fs";
import {resolve} from "path";
import {MicroBuildConfig, EPlugins} from "../microbuild-config";
import {injectJsonEnv} from "../cli/json-env-cli";
import {getProjectPath} from "../common/file-paths";

export class ConfigFileHelper {
	private fileContent;
	
	constructor(private build: MicroBuildConfig, content: string = '') {
		const port = build.toJSON().port;
		const baseDomain = build.toJSON().domain;
		
		let isDebug = false;
		if (build.getPlugin(EPlugins.jenv)) {
			isDebug = injectJsonEnv().isDebug;
		}
		
		this.fileContent = '/// <reference types="node"/>';
		this.fileContent += `
// 发布这个包的服务当前的状态
export const IS_PACKAGE_DEBUG_MODE: boolean = ${isDebug? "true" : "false"};
export const PACKAGE_SUPPORT_HTTPS: boolean = IS_PACKAGE_DEBUG_MODE;

// 试图探测客户端的状态
let clientDebugging: boolean = IS_PACKAGE_DEBUG_MODE;
let currentIsHttps: boolean = PACKAGE_SUPPORT_HTTPS;
if(typeof window === 'object'){
	if(window.hasOwnProperty('IS_DEBUG')){
		clientDebugging = window['IS_DEBUG'];
	} else if(global && global.process && global.process.env.NODE_ENV) {
		clientDebugging = global.process.env.NODE_ENV !== 'production';
	}
	// currentIsHttps = /^https:/.test(location.href);
} else {
	currentIsHttps = false;
	if(global.hasOwnProperty('JsonEnv')){
		clientDebugging = global['JsonEnv'].isDebug;
	} else {
		clientDebugging = global.process.env.NODE_ENV !== 'production';
	}
}
export function setDebugMode(debugMode = true){
	clientDebugging = debugMode;
}

export const PACKAGE_USING_HTTPS: boolean = currentIsHttps;
let https = currentIsHttps? 'https' : 'http';
let supportHttps = PACKAGE_SUPPORT_HTTPS? 'https' : 'http';

// 运行端口（默认端口省略）（在docker运行时永远省略）
const DEBUG_PORT = '${port}';
export const CONFIG_PORT: string = IS_PACKAGE_DEBUG_MODE ? DEBUG_PORT : '';
const portPart = CONFIG_PORT? ':' + CONFIG_PORT : '';

// 服务器客户端通用的请求url
export const CONFIG_BASE_DOMAIN: string = https + '://${baseDomain}' + portPart;
export const CONFIG_BASE_DOMAIN_CLIENT: string = supportHttps + '://${baseDomain}' + portPart;
export const CONFIG_BASE_DOMAIN_SERVER: string = 'http://${baseDomain}' + portPart;

${content}
`;
	}
	
	save(path: string) {
		const absPath = resolve(getProjectPath(), path);
		if (!existsSync(absPath) || readFileSync(absPath, 'utf-8') !== this.fileContent) {
			writeFileSync(absPath, this.fileContent, 'utf-8');
		}
		this.build.registerIgnore(path);
	}
}
