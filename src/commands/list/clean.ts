import {readdirSync, lstatSync, unlinkSync} from "fs";
import {resolve} from "path";
import {rmdirsSync} from "nodejs-fs-utils";
import {CommandDefine} from "../command-library";
import {getTempPath} from "../../library/file-paths";

export const commandDefine: CommandDefine = {
	command: 'clean',
	description: 'cleanup micro-build temp files in current folder.',
};

const protectedFiles = [
	'.',
	'..',
	'x',
	'config.ts',
	'start.sh',
	'stop.sh',
	'functions.sh',
];

export function clean() {
	const t = getTempPath();
	readdirSync(t).forEach((f) => {
		if (protectedFiles.indexOf(f) !== -1) {
			return;
		}
		const p = resolve(t, f);
		
		if (lstatSync(p).isDirectory()) {
			console.log('remove dir: %s', p);
			rmdirsSync(p);
		} else {
			console.log('remove file: %s', p);
			unlinkSync(p);
		}
	});
	console.log('cleanup complete.');
}
