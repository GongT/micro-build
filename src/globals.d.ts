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
