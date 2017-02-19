import {saveFile, saveFilePublic} from "../library/config-file/fast-save";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {ScriptVariables} from "../replace/instructions-scripts";
import {MicroBuildConfig} from "../library/microbuild-config";
import {UnitFileVariables} from "../replace/instructions-scripts-unitfile";
import {isSystemdRunning, isUpstartRunning} from "../library/system/detect-system-type";
import {readBuildConfig} from "../library/read-config";

export function createServiceConfig(config: MicroBuildConfig = readBuildConfig()) {
	let adminScript;
	
	if (isSystemdRunning()) {
		const systemdFile = renderTemplateScripts('service', 'systemd.service', new UnitFileVariables(config));
		saveFilePublic('system-service.service', systemdFile);
	} else {
		const upstartFile = renderTemplateScripts('service', 'upstart.conf', new UnitFileVariables(config));
		saveFilePublic('system-service.conf', upstartFile);
	}
}

export function createServiceControl(config: MicroBuildConfig = readBuildConfig()) {
	let adminScript;
	
	const replacer = new ScriptVariables(config, {});
	adminScript = renderTemplateScripts('run-control', 'start.sh', replacer);
	saveFilePublic('start-docker.sh', adminScript, '0755');
	adminScript = renderTemplateScripts('run-control', 'stop.sh', replacer);
	saveFilePublic('kill-docker.sh', adminScript, '0755');
	
	adminScript = renderTemplateScripts('run-control', 'run-script.sh', replacer);
	saveFile('run-script.sh', adminScript, '0755');
	
	adminScript = renderTemplateScripts('run-control', 'control.sh', replacer);
	saveFile('control.sh', adminScript, '0755');
	
	if (isSystemdRunning()) {
		const adminScript = renderTemplateScripts('service', 'systemd.sh', new ScriptVariables(config));
		saveFilePublic('control-script.sh', adminScript);
	} else if (isUpstartRunning()) {
		const adminScript = renderTemplateScripts('service', 'upstart.sh', new ScriptVariables(config));
		saveFilePublic('control-script.sh', adminScript);
	} else {
		throw new Error('only support upstart and systemd.');
	}
}
