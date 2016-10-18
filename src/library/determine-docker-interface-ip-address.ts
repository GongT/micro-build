import {networkInterfaces} from "os";

export function determineDockerInterfaceIpAddress(ifName: string = 'docker0') {
	const nets = networkInterfaces();
	if (!nets[ifName]) {
		throw new Error(`can't find interface "${ifName}" on this system`);
	}
	
	const ret = [];
	
	nets[ifName].forEach((config) => {
		if (config.family === 'IPv4') {
			ret[0] = config.address;
		} else if (config.family === 'IPv6') {
			ret[1] = config.address;
		} else {
			console.error('unknown if config: ', config);
		}
	});
	
	if (!ret[0]) {
		throw new Error(`can't determine ipaddress on interface "${ifName}"`);
	}
	
	return ret;
}
