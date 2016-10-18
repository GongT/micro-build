import {MicroBuildConfig} from "../library/microbuild-config";
import {saveFile} from "./all";
import {ScriptVariables} from "../replace/instructions-scripts";
import {renderTemplate} from "../replace/replace-scripts";

export function createServiceFile(config: MicroBuildConfig) {
	const replacer = new ScriptVariables(config);
	const upstartFile = renderTemplate('service', 'upstart.conf', replacer);
	saveFile('upstart.conf', upstartFile);
	
	const systemdFile = renderTemplate('service', 'systemd.service', replacer);
	saveFile('systemd.service', systemdFile);
	
	let adminScript;
	
	adminScript = renderTemplate('admin', 'systemd.sh', replacer);
	saveFile('systemd.sh', adminScript);
	adminScript = renderTemplate('admin', 'upstart.sh', replacer);
	saveFile('upstart.sh', adminScript);
}

// /etc/systemd/system/multi-user.target.wants
// /etc/init/
// /etc/init.d/
