import {readdirSync, lstatSync, unlinkSync} from "fs";
import {resolve} from "path";
import {rmdirsSync} from "nodejs-fs-utils";
import {CommandDefine} from "../command-library";
import {getGeneratePath} from "../../library/common/file-paths";

export const commandDefine: CommandDefine = {
	command: 'clean',
	description: 'cleanup micro-build temp files in current folder.',
};

const protectedFiles = [
	'.',
	'..',
	'check-external-dependencies.sh',
	'EnvironmentFile.sh',
];

export function clean() {
	const t = getGeneratePath();
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
