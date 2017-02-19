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
		const ret: string[] = [];
		const type = this.config.toJSON().service.type;
		ret.push(`Type=${type}`);
		
		const sdWatch = this.config.toJSON().service.watchdog;
		if (sdWatch) {
			ret.push(`WatchdogSec=${sdWatch}s`);
		}
		
		const sdType = (this.config.toJSON().service.type || 'simple').toLowerCase();
		ret.push(`Environment=SYSTEMD_TYPE=${sdType}`);
		if (sdType === 'notify') {
			ret.push(`NotifyAccess=all`);
			ret.push(`PrivateNetwork=no`);
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
