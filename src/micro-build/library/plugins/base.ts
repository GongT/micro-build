import {PluginList} from "./handler";

export interface PluginMeta {
	readonly id: string;
	readonly name: string;
}

export interface PluginOptionBase {

}

export abstract class PluginBase<ParamType extends PluginOptionBase> {
	public abstract readonly id: string;
	readonly name: string;
	
	constructor(protected options: ParamType) {
		this.name = this.constructor.name;
		Object.freeze(options);
	}
	
	abstract onCreate(handler: PluginList);
	
	serialize(): PluginMeta&ParamType {
		return Object.assign({}, this.options, {
			id: this.id,
			name: this.name,
		});
	}
}
