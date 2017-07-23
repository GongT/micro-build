import {PluginBase, PluginMeta, PluginOptionBase} from "./base";

export interface PluginsData<T> {
	before: string[];
	after: string[];
	name: string;
	id: string;
}

export class PluginList {
	protected list: PluginBase<any>[] = [];
	protected nameMap: Map<string, PluginBase<any>[]> = new Map;
	protected idMap: Map<string, PluginBase<any>> = new Map;
	
	protected idMetaMap: Map<string, PluginsData<any>> = new Map;
	
	constructor() {
	}
	
	protected wrap<T>(plugin: PluginBase<T>): PluginsData<T> {
		return {
			id: plugin.id,
			name: plugin.name,
			before: [],
			after: [],
		};
	}
	
	pushStack(plugin: PluginBase<any>) {
		const data = this.wrap(plugin);
		this.idMap.set(data.id, plugin);
		this.idMetaMap.set(data.id, data);
		
		if (!this.nameMap.has(data.name)) {
			this.nameMap.set(data.name, []);
		}
		this.nameMap.get(data.name).push(plugin);
		
		plugin.onCreate(this);
		
		return this.list.push(plugin);
	}
	
	serialize(): (PluginMeta&PluginOptionBase)[] {
		const ret = [];
		for (let i of this.list) {
			ret.push(i.serialize());
		}
		return ret;
	}
}
