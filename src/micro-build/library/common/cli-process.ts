export function die(...args: any[]) {
	console.error.apply(console, args);
	exit(1);
}

export function exit(e: any = 0) {
	if (typeof e === 'number') {
		process.exit(e);
	} else {
		console.error(e);
		process.exit(1);
	}
}
