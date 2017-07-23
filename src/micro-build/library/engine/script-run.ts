import {resolve} from "path";
import {die, programSection, programSectionEnd} from "../../bin/error";
import {MICROBUILD_ROOT} from "../common/paths";
import {runExternalCommand, runExternalCommandInteractive, SpawnResult} from "../common/spawn";

export class ScriptsRunner {
	protected file: string;
	
	constructor(name: string, protected cwd = '/tmp') {
		this.file = resolve(MICROBUILD_ROOT, 'scripts/', name + '.sh');
	}
	
	async collectOutput(...args: string[]): Promise<string> {
		const p = await this.spawn(args, true);
		this.defaultError(args, p);
		return p.output;
	}
	
	async assumeSuccess(...args: string[]) {
		const p = await this.spawn(args, false);
		this.defaultError(args, p);
	}
	
	chdir(d) {
		this.cwd = d;
	}
	
	private defaultError(args: string[], p: SpawnResult) {
		if (!p.signal && !p.code) {
			return;
		}
		if (p.output && p.output.length) {
			console.error('----------------');
			console.error(p.output.trim());
			console.error('----------------');
		}
		console.error('Failed:');
		console.error('  error while run script %s', this.file);
		console.error('  with arguments: %s', args);
		if (p.code) {
			console.error('  command return with code: %s', p.code);
		} else if (p.signal) {
			console.error('  command killed by signal: %s', p.signal);
		}
		die('sub command failed');
	}
	
	async spawn(args: string[], collect: boolean): Promise<SpawnResult> {
		programSection('external command: ' + args[0]);
		let ret;
		try {
			if (collect) {
				ret = await runExternalCommand(this.cwd, this.file, args);
			} else {
				ret = await runExternalCommandInteractive(this.cwd, this.file, args);
			}
		} catch (e) {
			die('  cannot execute command: %s', e.message);
		}
		programSectionEnd();
		return ret;
	}
}
