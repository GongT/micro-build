import {pathExistsSync} from "fs-extra";
import {PathResolver} from "../common/paths";
import {BuildDependency} from "../dependencies/dependency";
import {PluginBase} from "../plugins/base";
import {PluginsHandler} from "../plugins/handler";
import {readConfigFile} from "./read-config-file";

export interface ConfigFileOutput {
	plugins: PluginsHandler;
	dependencies: Array<BuildDependency>;
	project: string;
}

export class ConfigFile {
	protected exportData: ConfigFileOutput;
	protected pr: PathResolver;
	
	private _exists: boolean;
	
	private static $current: ConfigFile;
	
	constructor(pr: PathResolver) {
		if (ConfigFile.$current && pr === ConfigFile.$current.pr) {
			return ConfigFile.$current;
		}
		this.pr = pr;
		
		this.load = this.load.bind(this);
		pr.onChange(this.load);
		this.load();
	}
	
	get path() {
		return this.pr.configFile;
	}
	
	public get exists() {
		return this._exists;
	}
	
	plugin<ParamType>(plugin: PluginBase<ParamType>) {
		return this.exportData.plugins.pushStack(plugin);
	}
	
	dependency(depend: BuildDependency) {
		this.exportData.dependencies.push(depend);
	}
	
	public load() {
		this._exists = pathExistsSync(this.pr.configFile);
		
		this.exportData = {
			plugins: new PluginsHandler,
			dependencies: [],
			project: '',
		};
		
		if (this._exists) {
			readConfigFile(this.pr, this);
		}
	}
}
