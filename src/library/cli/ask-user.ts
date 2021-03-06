import {inputAvailable} from "./output";
const readlineSync: any = require("readline-sync");

export function selection(prompt: string, selection: KVP<string>, defaultValue: string|boolean) {
	let ret;
	
	console.error(prompt);
	console.error('available config set:');
	Object.keys(selection).forEach((index) => {
		console.error('  [%s] %s', index, selection[index]);
	});
	
	if (inputAvailable) {
		do {
			ret = readlineSync.question('type number and press Enter> ');
		} while (!selection.hasOwnProperty(ret));
	} else {
		if (defaultValue === false) {
			throw new Error('you must have tty input to do this.');
		}
		
		console.error('no input, auto select> %s', defaultValue);
		ret = defaultValue;
	}
	
	return ret;
}

export function input(prompt: string) {
	if (!inputAvailable) {
		throw new Error('you must have tty input to do this.');
	}
	let ret;
	console.error(prompt + ': ');
	do {
		ret = readlineSync.question('> ');
	} while (!ret.trim());
	
	return ret;
}

export function yes_no(prompt: string, defaultValue: boolean) {
	if (!inputAvailable) {
		return defaultValue;
	}
	readlineSync
}
