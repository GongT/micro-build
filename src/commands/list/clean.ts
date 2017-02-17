import {readdirSync, lstatSync, unlinkSync, rmdirSync} from "fs";
import {resolve} from "path";
import {CommandDefine} from "../command-library";
import {getGeneratePath} from "../../library/common/file-paths";

export const commandDefine: CommandDefine = {
	command: 'clean',
	description: 'cleanup micro-build temp files in current folder.',
};

const protectedFiles = [
	'start-docker.sh',
	'kill-docker.sh',
	'functions.sh',
	'control-script.sh',
	'run-config-env',
	'service.pid',
];

export function clean() {
	clearDirDeep(getGeneratePath());
	console.error('cleanup complete.');
}

function clearDirDeep(p) {
	if (p.indexOf(getGeneratePath()) !== 0) {
		throw new Error('remove files: walk escape from temp dir.');
	}
	
	let allRemoved = true;
	readdirSync(p).forEach((f) => {
		const s = resolve(p, f);
		if (protectedFiles.find(item => s.indexOf(item) !== -1)) {
			// console.error('do not remove item: %s', s);
			allRemoved = false;
			return;
		}
		
		if (lstatSync(s).isDirectory()) {
			const sub = clearDirDeep(s);
			allRemoved = allRemoved && sub;
		} else {
			console.error('- %s', s);
			unlinkSync(s);
		}
	});
	
	if (allRemoved) {
		console.error('- %s', p);
		rmdirSync(p);
	}
	
	return allRemoved;
}
