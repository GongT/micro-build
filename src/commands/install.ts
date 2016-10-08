import {spawnMainCommand} from "../library/spawn-child";
import mkconfig from "./mkconfig";
export function install() {
	mkconfig.apply({}, arguments);
	
	return spawnMainCommand('control.sh', ['install']);
}
export function uninstall() {
	mkconfig.apply({}, arguments);
	
	return spawnMainCommand('control.sh', ['uninstall']);
}
