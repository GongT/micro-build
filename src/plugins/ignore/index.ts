import {PluginBase, PluginsHandler} from "@gongt/micro-build";

export interface Extra {
	active?: boolean;
	excludes: string[];
	includes: string[];
}
export interface IgnoreArgument {
	git?: boolean|Extra;
	docker?: boolean|Extra;
}

export class IgnorePlugin extends PluginBase<IgnoreArgument> {
	onCreate(handler: PluginsHandler) {
	}
	
}
