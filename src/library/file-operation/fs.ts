import * as fs from "fs";

export const fileExists = (path: string): boolean => {
	return fs.existsSync(path) && fs.lstatSync(path).isFile();
};

export const folderExists = (path: string): boolean => {
	return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
};

export const linkExists = (path: string): boolean => {
	try {
		return fs.lstatSync(path).isSymbolicLink();
	} catch (e) {
		if (/no such file or directory/.test(e.message)) {
			return false;
		} else {
			throw e;
		}
	}
};

export function readFile(path: string): string {
	return fs.readFileSync(path, 'utf8');
}
export function writeFile(path: string, data: string) {
	fs.writeFileSync(path, data, 'utf8');
}
