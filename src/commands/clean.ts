import {readdirSync, lstatSync, unlinkSync} from "fs";
import {getTempPath} from "../library/file-paths";
import {resolve} from "path";
import {rmdirsSync} from "nodejs-fs-utils";

const protectedFiles = [
	'.',
	'..',
	'x',
	'config.ts',
	'start.sh',
	'stop.sh',
];

export default function clean() {
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
}
