declare const JsonEnv: any;

interface Console {
	assert(test?: boolean, message?: string, ...optionalParams: any[]): void;
	clear(): void;
	count(countTitle?: string): void;
	debug(message?: string, ...optionalParams: any[]): void;
	dir(value?: any, ...optionalParams: any[]): void;
	dirxml(value: any): void;
	error(message?: any, ...optionalParams: any[]): void;
	group(groupTitle?: string): void;
	groupCollapsed(groupTitle?: string): void;
	groupEnd(): void;
	info(message?: any, ...optionalParams: any[]): void;
	log(message?: any, ...optionalParams: any[]): void;
	profile(reportName?: string): void;
	profileEnd(): void;
	time(timerName?: string): void;
	timeEnd(timerName?: string): void;
	trace(message?: any, ...optionalParams: any[]): void;
	warn(message?: any, ...optionalParams: any[]): void;
}

declare var console: Console;

declare namespace NodeJS {
	export interface WritableStream {
		fd?: number;
	}
}

declare interface KVP<V> {
	[id: string]: V;
}

declare interface IPackageJson {
	name?: string;
	version?: string;
	description?: string;
	repository?: any;
	bin?: {
		[id: string]: string;
	}
	scripts?: {
		start: string;
		build: string;
		service: string;
		"post-install": string;
	},
	dependencies?: {
		[name: string]: string;
	};
	devDependencies?: {
		[name: string]: string;
	};
}

interface WritableStream {
	fd: number;
}

declare module 'nodejs-fs-utils' {
	type NodejsCallback = (err: NodeJS.ErrnoException, result: any) => void;
	export function copy(path: string, target: string, callback?: NodejsCallback): void;
	
	export function copySync(path: string, target: string): string;
	
	export function rmdirs(path: string, callback?: NodejsCallback): void;
	
	export function rmdirsSync(path: string): string;
	
	export function remove(path: string, callback?: NodejsCallback): void;
	
	export function removeSync(path: string): string;
	
	export function fsize(path: string, callback?: NodejsCallback): void;
	
	export function fsizeSync(path: string): string;
	
	export function walk(path: string, callback?: NodejsCallback): void;
	
	export function walkSync(path: string): string;
	
	export function mkdirs(path: string, callback?: NodejsCallback): void;
	
	export function mkdirsSync(path: string): string;
	
	export function ensureDir(path: string, callback?: NodejsCallback): void;
	
	export function ensureDirSync(path: string): string;
	
	export function move(path: string, target: string, callback?: NodejsCallback): void;
	
	export function moveSync(path: string, target: string): string;
	
	export function emptyDir(path: string, callback?: NodejsCallback): void;
	
	export function emptyDirSync(path: string): string;
	
	export function isEmpty(path: string, callback?: NodejsCallback): void;
	
	export function isEmptySync(path: string): string;
	
	export function createFile(path: string, callback?: NodejsCallback): void;
	
	export function createFileSync(path: string): string;
	
	export function ensureFile(path: string, callback?: NodejsCallback): void;
	
	export function ensureFileSync(path: string): string;
}
