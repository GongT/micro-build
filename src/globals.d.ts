/// <reference types="node"/>

declare const JsonEnv: any;

declare interface KVP<V> {
	[id: string]: V;
}

interface WritableStream {
	fd: number;
}
