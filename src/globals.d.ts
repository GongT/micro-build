/// <reference types="node"/>

declare const JsonEnv: any;

declare interface KVP<V> {
	[id: string]: V;
}

declare interface JspmPackageConfig {
	directories?: {
		[id: string]: string;
		baseURL?: string;
		packages?: string;
	},
	configFiles?: {
		[id: string]: string;
		jspm: string;
	},
	configFile?: string;
	dependencies?: {
		[id: string]: string;
	};
	overrides?: {
		[id: string]: any;
	};
}

declare interface IPackageJson {
	private?: boolean;
	name?: string;
	version?: string;
	description?: string;
	repository?: any;
	bin?: {
		[id: string]: string;
	};
	scripts?: {
		start?: string;
		build?: string;
		service?: string;
		[id: string]: string;
	};
	dependencies?: {
		[name: string]: string;
	};
	devDependencies?: {
		[name: string]: string;
	};
	jspm: JspmPackageConfig;
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
