import {ensureDirSync, mkdirpSync, removeSync, unlinkSync} from "fs-extra";
import {resolve} from "path";
import {NormalizedArguments} from "../commands/argument-parser/real-parse";

export const MICROBUILD_ROOT: string = resolve(__dirname, '..');

const BUILD_CONFIG_FILENAME: string = 'config.ts';
const BUILD_FOLDER_NAME: string = 'build';
const TEMP_FOLDER_NAME: string = '.temp';
const CONTENT_FOLDER_NAME: string = 'store';

export class PathResolver {
	protected basePath: string;
	
	constructor() {
		this.switchProject(process.cwd());
	}
	
	ensure() {
		mkdirpSync(this.getTempFileFolder('.'));
		mkdirpSync(this.contentDir);
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
		this.basePath = path;
	}
	
	get project() {
		return this.basePath;
	}
	
	get buildPath() {
		return this.resolve();
	}
	
	/* temp */
	private random() {
		return Date.now().toString() + '' + (Math.random() * 10000).toFixed(0);
	}
	
	getTempFile(knownName?: string) {
		let ext = '';
		if (/^\./.test(knownName)) {
			ext = knownName;
			knownName = '';
		}
		
		const temp = this.resolve(
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
		const temp = this.resolve(
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
		return this.resolve(BUILD_CONFIG_FILENAME);
	}
	
	get contentDir() {
		return this.contentPath();
	}
	
	public contentPath(...paths: string[]) {
		return this.resolve(CONTENT_FOLDER_NAME, ...paths);
	}
	
	/* helper */
	public resolveProject(...paths: string[]) {
		return resolve(this.project, ...paths);
	}
	
	public resolve(...paths: string[]) {
		return this.resolveProject(BUILD_FOLDER_NAME, ...paths);
	}
}
