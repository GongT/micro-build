import {MicroBuildConfig} from "../library/microbuild-config";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplateScripts} from "../replace/replace-scripts";
import {saveFile, saveFilePublic} from "../library/config-file/fast-save";
import {createPublicFiles} from "./public-gen";
import {UnitFileVariables} from "../replace/instructions-scripts-unitfile";
import {readBuildConfig} from "../library/read-config";
import {isSystemdRunning} from "../library/system/detect-system-type";

function createServiceControl(config: MicroBuildConfig) {
	let adminScript;
	const replacer = new ScriptVariables(config);
	
	createPublicFiles(config);
	
	adminScript = renderTemplateScripts('run-control', 'run-script.sh', replacer);
	saveFile('run-script.sh', adminScript, '0755');
	
	adminScript = renderTemplateScripts('admin', 'control.sh', replacer);
	saveFile('control.sh', adminScript, '0755');
	
	adminScript = renderTemplateScripts('run-control', 'start.sh', replacer);
	saveFile('start.sh', adminScript, '0755');
	
	adminScript = renderTemplateScripts('run-control', 'stop.sh', replacer);
	saveFile('stop.sh', adminScript, '0755');
	
	if (isSystemdRunning()) {
		const adminScript = renderTemplateScripts('admin', 'systemd.sh', new ScriptVariables(config));
		saveFilePublic('control-script.sh', adminScript);
	} else {
		const adminScript = renderTemplateScripts('admin', 'upstart.sh', new ScriptVariables(config));
		saveFilePublic('control-script.sh', adminScript);
	}
}

function createServiceConfig(config: MicroBuildConfig) {
	if (isSystemdRunning()) {
		const systemdFile = renderTemplateScripts('service', 'systemd.service', new UnitFileVariables(config));
		saveFilePublic('system-service.service', systemdFile);
	} else {
		const upstartFile = renderTemplateScripts('service', 'upstart.conf', new UnitFileVariables(config));
		saveFilePublic('system-service.conf', upstartFile);
	}
}

export function createServiceFile(config: MicroBuildConfig = readBuildConfig()) {
	createServiceConfig(config);
	createServiceControl(config);
}
