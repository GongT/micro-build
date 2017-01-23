
export function displayError(stack) {
	const err = stack.split(/\n/g).slice(0, 4);
	if (err[1]) {
		err[1] = '\x1B[2m' + err[1];
	}
	console.error(err.join('\n') + '\x1B[0m');
}
