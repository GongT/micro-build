import {spawn} from "child_process";

export type SpawnResult = {
	code: number;
	signal: string;
	output: string;
};

export function runExternalCommandInteractive(cwd: string, cmd: string, args: string[]): Promise<SpawnResult> {
	return new Promise((resolve, reject) => {
		// console.error("\x1B[2m%s %s\x1B[0m", cmd, args.join(" "));
		const p = spawn(cmd, args, {
			cwd: cwd,
			stdio: ['inherit', 'inherit', 'inherit'],
			shell: '/bin/bash',
		});
		p.on('error', (e) => reject(e));
		p.on('exit', (code, signal) => resolve({
			code,
			signal,
			output: null,
		}));
	});
}

export function runExternalCommand(cwd: string, cmd: string, args: string[]): Promise<SpawnResult> {
	return new Promise((resolve, reject) => {
		// console.error("\x1B[2m%s %s\x1B[0m", cmd, args.join(" "));
		const p = spawn(cmd, args, {
			cwd: cwd,
			stdio: ['inherit', 'pipe', 'pipe'],
			shell: '/bin/bash',
		});
		
		let output: Buffer = new Buffer(0);
		
		p.stderr.on('data', (n: Buffer) => {
			output = Buffer.concat([output, n]);
		});
		p.stdout.on('data', (n: Buffer) => {
			output = Buffer.concat([output, n]);
		});
		
		p.on('error', (e) => reject(e));
		p.on('exit', (code, signal) => resolve({
			code,
			signal,
			output: output.toString('utf8'),
		}));
	});
}
