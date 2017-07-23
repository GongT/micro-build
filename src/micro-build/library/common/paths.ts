import {EventEmitter} from "events";
import {ensureDirSync, mkdirpSync, removeSync, unlinkSync} from "fs-extra";
import {resolve} from "path";
import {NormalizedArguments} from "../commands/argument-parser/real-parse";
import {programSection, programSectionEnd} from "../../bin/error";

export const MICROBUILD_ROOT: string = resolve(__dirname, '../../..');
export const DEBUG_MICROBUILD_SOURCE: string = resolve(MICROBUILD_ROOT, '../src');

export const BUILD_CONFIG_FILENAME: string = 'config.ts';
export const BUILD_FOLDER_NAME: string = 'build';
const TEMP_FOLDER_NAME: string = '.temp';
const CONTENT_FOLDER_NAME: string = 'store';

export const TEMP_FOLDER_REL = 'build/.temp/';

export class PathResolver {
	protected basePath: string;
	private _event: EventEmitter;
	
	constructor() {
		this._event = new EventEmitter;
		this.switchProject(process.cwd());
	}
	
	ensure() {
		mkdirpSync(this.resolveHelperFile('.'));
		mkdirpSync(this.resolveContent('.'));
		mkdirpSync(this.getTempFileFolder('.'));
	}
	
	switchProjectFromArguments(args: NormalizedArguments) {
		if (args.namedOptions.project && args.namedOptions.project !== '.') {
			const target = resolve(process.cwd(), args.namedOptions.project);
			this.switchProject(target);
		} else {
			this.switchProject(process.cwd());
		}
	}
	
	/* basic - project */
	switchProject(path: string) {
		if (this.basePath === path) {
			return;
		}
		programSection('switching project root');
		this.basePath = path;
		this._event.emit('change');
		programSectionEnd();
	}
	
	get id(){
		return this.basePath;
	}
	
	onChange(fn: () => void) {
		this._event.addListener('change', fn);
	}
	
	get project() {
		return this.basePath;
	}
	
	get buildPath() {
		return this.resolveBuild();
	}
	
	/* temp */
	private random() {
		return Date.now().toString() + '' + (Math.random() * 10000).toFixed(0);
	}
	
	resolveTempFile(knownName?: string) {
		let ext = '';
		if (/^\./.test(knownName)) {
			ext = knownName;
			knownName = '';
		}
		
		const temp = this.resolveBuild(
			TEMP_FOLDER_NAME,
			knownName || (this.random() + ext),
		);
		if (!knownName) {
			process.on('exit', () => {
				unlinkSync(temp);
			});
		}
		return temp;
	}
	
	getTempFileFolder(knownName?: string) {
		const temp = this.resolveBuild(
			TEMP_FOLDER_NAME,
			knownName || (this.random() + '.d'),
		);
		ensureDirSync(temp);
		if (!knownName) {
			process.on('exit', () => {
				removeSync(temp);
			});
		}
		return temp;
	}
	
	/* contents */
	get configFile() {
		return this.resolveBuild(BUILD_CONFIG_FILENAME);
	}
	
	/* template */
	public resolveTemplateFile(f: string) {
		return resolve(MICROBUILD_ROOT, 'template', f);
	}
	
	/* helper */
	public resolveHelperFile(name: string) {
		return this.resolveBuild('_', name);
	}
	
	public resolveContent(...paths: string[]) {
		return this.resolveBuild(CONTENT_FOLDER_NAME, ...paths);
	}
	
	public resolveProject(...paths: string[]) {
		return resolve(this.project, ...paths);
	}
	
	public resolveBuild(...paths: string[]) {
		return this.resolveProject(BUILD_FOLDER_NAME, ...paths);
	}
}
