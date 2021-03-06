import {resolve} from "path";
import {getProjectPath} from "../library/common/file-paths";
import {ScriptVariables} from "./instructions-scripts";

export class UnitFileVariables extends ScriptVariables {
	DEPEND_SERVICES_UPSTART() {
		return this.walk(this.config.toJSON().serviceDependencies, (_, serviceName) => {
			return ' and started ' + serviceName;
		}, ' ');
	}
	
	DEPEND_SERVICES_SYSTEMD() {
		return this.walk(this.config.toJSON().serviceDependencies, (_, serviceName) => {
			return serviceName + '.service';
		}, ' ');
	}
	
	CONFIG_SYSTEMD() {
		const service = this.config.toJSON().service;
		const ret: string[] = [];
		const sdType = (service.type || 'simple').toLowerCase();
		const type = sdType === 'simple'? 'notify' : sdType;
		ret.push(`Type=${type}`);
		
		const sdWatch = service.watchdog;
		if (sdWatch) {
			ret.push(`WatchdogSec=${sdWatch}`);
		}
		
		let startTimeout = service.startTimeout || parseInt(process.env.SYSTEMD_TIMEOUT) || 10;
		let stopTimeout = service.stopTimeout || 10;
		const multi = parseFloat(process.env.SYSTEMD_TIMEOUT_MULTIPLIER);
		if (multi > 0) {
			startTimeout = Math.floor(startTimeout * multi);
			stopTimeout = Math.floor(stopTimeout * multi);
		}
		ret.push(`TimeoutStartSec=${startTimeout}s`);
		ret.push(`TimeoutStopSec=${stopTimeout}s`);
		
		ret.push(`Environment=SYSTEMD_TYPE=${sdType}`);
		ret.push(`NotifyAccess=all`);
		ret.push(`PrivateNetwork=no`);
		
		if (service.commands) {
			const fullCmd = (cmd) => {
				if (/^\.\//.test(cmd)) {
					return '/bin/bash -c ' + JSON.stringify(resolve(getProjectPath(), cmd));
				} else {
					return '/bin/bash -c ' + JSON.stringify(cmd);
				}
			};
			if (service.commands.postStart) {
				ret.push(`ExecStartPost=-${fullCmd(service.commands.postStart)}`);
			}
		}
		
		return ret.join('\n');
	}
	
	STOP_DOCKER_COMMAND() {
		const stopCommandArgs = this.walk(this.config.toJSON().stopCommand, (v) => {
			return JSON.stringify(v);
		}, ' ');
		const SERVICE_NAME = this.config.toJSON().projectName;
		if (stopCommandArgs) {
			return `docker exec '${SERVICE_NAME}' ${stopCommandArgs}`;
			// docker stop --time=5 '@{SERVICE_NAME}'
		} else {
			return `docker stop --time=5 '${SERVICE_NAME}'`;
		}
	}
	
	RELOAD_DOCKER_COMMAND() {
		const reload = this.config.toJSON().reloadCommand;
		return reload? reload : '';
	}
}
