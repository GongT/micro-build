import {writeFileSync, readFileSync, existsSync} from "fs";
import {resolve} from "path";
import {MicroBuildConfig, EPlugins} from "../microbuild-config";
import {injectJsonEnv} from "../cli/json-env-cli";
import {getProjectPath} from "../common/file-paths";
import {isDockerMode} from "../common/runenv";

export class ConfigFileHelper {
	private fileContent;
	
	constructor(private build: MicroBuildConfig, content: string = '') {
		const port = build.toJSON().port;
		const resultPort: string = port && !build.isBuilding() ? port.toFixed(0) : '';
		const baseDomain = build.toJSON().domain;
		
		let isDebug = false;
		if (build.getPlugin(EPlugins.jenv)) {
			isDebug = injectJsonEnv().isDebug;
		}
		
		this.fileContent = '/// <reference types="node"/>';
		this.fileContent += `

${content}

// 发布这个包的服务当前的状态
export const IS_PACKAGE_DEBUG_MODE = JSON.parse('${isDebug ? "true" : "false"}');

// 试图探测客户端的状态
let clientDebugging = IS_PACKAGE_DEBUG_MODE;
if(typeof window === 'object'){
	if(window.hasOwnProperty('IS_DEBUG')){
		clientDebugging = window['IS_DEBUG'];
	} else if(global && global.process && global.process.env.NODE_ENV) {
		clientDebugging = global.process.env.NODE_ENV !== 'production';
	}
} else {
	if(global.hasOwnProperty('JsonEnv')){
		clientDebugging = global['JsonEnv'].isDebug;
	} else {
		clientDebugging = global.process.env.NODE_ENV !== 'production';
	}
}
export function setDebugMode(debugMode = true){
	clientDebugging = debugMode;
}

// 是否支持使用https只跟服务端状态有关
//    - 部署到了docker的
//    - 并且不是测试模式
export const PACKAGE_SUPPORT_HTTPS: boolean = JSON.parse('${isDockerMode()}') && IS_PACKAGE_DEBUG_MODE === false;
let https = PACKAGE_SUPPORT_HTTPS? 'https' : 'http';

// 是否实际使用https - 不在浏览器的时候不管支持不支持都不能用
if(typeof window !== 'object'){
	https = 'http';
}
export const PACKAGE_USING_HTTPS: boolean = https === 'https';

// 运行端口（默认端口省略）（在docker运行时永远省略）
export const CONFIG_PORT: string = '${resultPort}';
const portPart = CONFIG_PORT? ':' + CONFIG_PORT : '';

// 服务器客户端通用的请求url
// const debug_prefix = CONFIG_PORT? 'debug-' : '';
export const CONFIG_BASE_DOMAIN: string = https + '://' /*+ debug_prefix*/ + '${baseDomain}' + portPart;
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
