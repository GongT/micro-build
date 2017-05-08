import {PluginsHandler} from "./handler";
export abstract class PluginBase<ParamType> {
	public readonly id: string;
	readonly name: string;
	
	constructor(protected options: ParamType) {
		this.name = this.constructor.name;
		this.id = this.name + '-' + (Math.random() * 10000).toFixed(0);
	}
	
	abstract onCreate(handler: PluginsHandler);
	
}
