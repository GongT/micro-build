import {mkconfig} from "./mkconfig";
import {CommandDefine} from "../command-library";
import {spawnMainCommand} from "../../library/system/spawn/spawn-child";
import {switchEnvironment} from "../../library/common/runenv";

function control(action: string, ...args: string[]) {
	switchEnvironment('docker');
	mkconfig(true, false);
	
	return spawnMainCommand('control.sh', [action, ...args]);
}

function createControlCommand(method: string, desc: string): {handler: Function, config: CommandDefine} {
	const obj = createServiceCommand(method, desc);
	obj.config.builder = (parser) => {
		// TODO local args
		parser.addParam('...args')
		      .description(`program ${method} arguments`);
	};
	return obj;
}

export function createServiceCommand(method: string, desc: string): {handler: Function, config: CommandDefine} {
	return {
		handler(...args) {
			return control(method, ...args);
		},
		config: {
			command: method,
			description: desc || `/* ${method} */`,
		}
	};
}

export const startDefine = createControlCommand('start', '启动这个服务，和它依赖的所有服务');
export const stopDefine = createControlCommand('stop', '停止这个服务，所有依赖这项服务的服务都会停止');
export const restartDefine = createControlCommand('restart', '重新启动这个服务，不影响任何依赖');
export const statusDefine = createServiceCommand('status', '检查当前服务的外部运行状态');
export const psDefine = createServiceCommand('ps', '检查当前服务的容器运行状态');
export const enableDefine = createServiceCommand('enable', '将此服务设为随系统启动自动运行');
export const disableDefine = createServiceCommand('disable', '禁止此服务随系统启动自动运行，但允许手动或作为依赖裕兴');
export const installDefine = createServiceCommand('install', '在操作系统注册当前服务');
export const uninstallDefine = createServiceCommand('uninstall', '从操作系统反注册当前服务');
