import {hintErrorStack} from "@gongt/ts-stl-library/strings/hint-error-stack";
import {format} from 'util';

export enum ExitCode {
	success = 0,
	critical,
	input,
	config_exists,
	config_error,
}

export class ExitStatus extends Error {
	constructor(public readonly code: ExitCode|number, message: string) {
		super(message);
	}
	
	stringify() {
		return `\nError \x1B[38;5;11m${ExitCode[this.code] || this.code}\x1B[0m:\n\t${this.message}`;
	}
}

const status = [];

export function programSection(_status: string) {
	status.push(_status);
}

export function programSectionEnd() {
	status.pop();
}

function statusHint() {
	if (status.length) {
		if (status.length === 1) {
			println('[MicroBuild] Main Program Status: %s', status[0])
		} else {
			println('[MicroBuild] Main Program Status: \n%s', status.map((str, index) => {
				return `  ${index + 1}: ${str}`;
			}).join('\n'));
		}
	} else {
		console.error('[MicroBuild] Main Program Status: \x1B[38;5;9mUnknown\x1B[0m');
	}
}

export function die(message: string, ...args: any[]) {
	statusHint();
	throw new ExitStatus(ExitCode.critical, format(message, ...args));
}

export function errorCode(err: Error) {
	return (err instanceof ExitStatus)? err.code : 1;
}

export function criticalErrorHandler(err) {
	exit(handleError(err));
}

export function handleError(err: Error) {
	if (err instanceof ExitStatus) {
		console.error(err.message);
		return err.code;
	} else if (err instanceof Error) {
		if (process.env.DBG) {
			hintErrorStack(err.stack, Infinity);
		} else {
			hintErrorStack(err.stack);
		}
		return 1;
	} else {
		printRed('Error: %s', err);
		return 1;
	}
}

export function print(message: string, ...args: any[]) {
	process.stderr.write(format('\x1B[2m' + message + '\x1B[0m', ...args));
}

export function println(message: string, ...args: any[]) {
	console.error('\x1B[2m' + message + '\x1B[0m', ...args);
}

export function printRed(message: string, ...args: any[]) {
	console.error('\x1B[38;5;9m' + message, ...args);
	process.stderr.write('\x1B[0m');
}

export function printGreen(message: string, ...args: any[]) {
	console.error('\x1B[38;5;10m' + message, ...args);
	process.stderr.write('\x1B[0m');
}

export function exit(ret: number|string = 0) {
	// NOTICE: FINAL error handler, don't throw any error. must exit.
	if (typeof ret === 'number') {
		if (ret === 0) {
			printGreen('Complete.');
		} else {
			statusHint();
			printRed('  Exit: %s.', ret);
		}
		process.exit(ret);
	} else {
		console.error(ret);
		process.exit(1);
	}
}

export function ignoreError(e: Error) {
	statusHint();
	console.error('\x1B[38;5;1;2m  Warning: %s\x1B[0m', e.message);
}

