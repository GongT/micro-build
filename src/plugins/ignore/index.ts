import {PluginBase} from "../../library/plugins/base";
import {PluginsHandler} from "../../library/plugins/handler";

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
