import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";

export function createServiceFile(config: MicroBuildConfig) {
	const upstartFile = renderTemplate('service', 'upstart.conf', new ScriptVariables(config));
	saveFile('upstart.conf', upstartFile);
	
	const systemdFile = renderTemplate('service', 'systemd.service', new ScriptVariables(config));
	saveFile('systemd.service', systemdFile);
	
	let adminScript;
	adminScript = renderTemplate('admin', 'detect-current.sh', new ScriptVariables(config));
	saveFile('detect-current.sh', adminScript, '755');
	adminScript = renderTemplate('admin', 'systemd.sh', new ScriptVariables(config));
	saveFile('systemd.sh', adminScript, '755');
	adminScript = renderTemplate('admin', 'upstart.sh', new ScriptVariables(config));
	saveFile('upstart.sh', adminScript, '755');
	adminScript = renderTemplate('admin', 'control.sh', new ScriptVariables(config));
	saveFile('control.sh', adminScript, '755');
}

// /etc/systemd/system/multi-user.target.wants
// /etc/init/
// /etc/init.d/
