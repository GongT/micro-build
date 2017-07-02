import {existsSync, lstatSync, readFileSync, writeFileSync} from "fs";

export function fileExists(path: string): boolean {
	return existsSync(path) && lstatSync(path).isFile();
}

export function folderExists(path: string): boolean {
	return existsSync(path) && lstatSync(path).isDirectory();
}

export function linkExists(path: string): boolean {
	try {
		return lstatSync(path).isSymbolicLink();
	} catch (e) {
		if (/no such file or directory/.test(e.message)) {
			return false;
		} else {
			throw e;
		}
	}
}

export function readFile(path: string): string {
	return readFileSync(path, 'utf8');
}
export function writeFile(path: string, data: string) {
	writeFileSync(path, data, 'utf8');
}

export function contentSame(a: string, b: string) {
	return readFileSync(a, 'utf8') === readFileSync(b, 'utf8');
}
