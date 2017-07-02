export function die(...args: any[]) {
	console.error.apply(console, args);
	exit(1);
}

export function output(message: string, ...args: any[]) {
	console.error('\x1B[2m' + message + '\x1B[0m', ...args);
}

export function exit(e: any = 0) {
	if (typeof e === 'number') {
		process.exit(e);
	} else {
		console.error(e);
		process.exit(1);
	}
}
