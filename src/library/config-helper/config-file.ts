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
		let isChina = false;
		if (build.getPlugin(EPlugins.jenv)) {
			const JsonEnv = injectJsonEnv();
			isDebug = JsonEnv.isDebug;
			isChina = JsonEnv.gfw && JsonEnv.gfw.isInChina;
		}
		
		this.fileContent = '/// <reference types="node"/>';
		this.fileContent += `
export const IS_IN_CHINA: boolean = ${isChina? "true" : "false"};
// 发布这个包的服务当前的状态
export const IS_PACKAGE_DEBUG_MODE: boolean = ${isDebug? "true" : "false"};
export const PACKAGE_SUPPORT_HTTPS: boolean = !IS_PACKAGE_DEBUG_MODE;

// 试图探测客户端的状态
let supportHttps = PACKAGE_SUPPORT_HTTPS? 'https' : 'http';

// 运行端口（默认端口省略）（在docker运行时永远省略）
const DEBUG_PORT = '${parseInt('' + port) || ''}';
export const CONFIG_PORT: string = IS_PACKAGE_DEBUG_MODE ? DEBUG_PORT : '';
const portPart = (CONFIG_PORT && (CONFIG_PORT !== '80'))? ':' + CONFIG_PORT : '';

// 服务器客户端通用的请求url
export const CONFIG_BASE_DOMAIN: string = supportHttps + '://${baseDomain}' + portPart;
export const CONFIG_BASE_DOMAIN_NO_PORT: string = supportHttps + '://${baseDomain}';
export const CONFIG_BASE_DOMAIN_CLIENT: string = '//${baseDomain}' + portPart;
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
