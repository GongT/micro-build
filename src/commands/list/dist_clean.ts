import {readdirSync, lstatSync, unlinkSync} from "fs";
import {resolve} from "path";
import {rmdirsSync} from "nodejs-fs-utils";
import {CommandDefine} from "../command-library";

export const commandDefine: CommandDefine = {
	command: 'dist-clean',
	description: 'completely cleanup & uninstall current project.'
};

export function dist_clean() {
	throw new Error('not impl');
}
