import {pathExistsSync} from "fs-extra";
import {criticalErrorHandler, ExitCode, ExitStatus, programSection, programSectionEnd} from "../../bin/error";
import {PathResolver} from "../common/paths";
import {ServiceDependency} from "../dependencies/dependency";
import {PluginBase, PluginMeta, PluginOptionBase} from "../plugins/base";
import {PluginList} from "../plugins/handler";
import {readConfigFile} from "./read-config-file";

export interface ConfigFileOutput {
	plugins: (PluginOptionBase&PluginMeta)[];
	dependencies: ServiceDependency[];
	project: string;
}

export interface MainOptions {
	bin: string;
	shell?: string;
	debugBin: string;
}

const configs: {[id: string]: ConfigFile} = {};

export class ConfigFile {
	private plugins: PluginList;
	private dependencies: ServiceDependency[];
	private project: string;
	private option: MainOptions;
	
	private _exists: boolean;
	
	constructor(public readonly path: PathResolver) {
		if (configs[path.id]) {
			return configs[path.id];
		}
		configs[path.id] = this;
		this.path = path;
		
		path.onChange(() => {
			this.reload().catch(criticalErrorHandler);
		});
	}
	
	get filename() {
		return this.path.configFile;
	}
	
	public get exists() {
		return this._exists;
	}
	
	use<ParamType>(plugin: PluginBase<ParamType>) {
		return this.plugins.pushStack(plugin);
	}
	
	dependency(depend: ServiceDependency) {
		this.dependencies.push(depend);
	}
	
	main(option: MainOptions) {
		this.option = option;
	}
	
	public serialize(): ConfigFileOutput {
		return {
			plugins: this.plugins.serialize(),
			dependencies: this.dependencies,
			project: this.project,
		};
	}
	
	public async reload() {
		this._exists = pathExistsSync(this.path.configFile);
		
		this.plugins = new PluginList;
		this.dependencies = [];
		this.project = '';
		
		if (this._exists) {
			programSection('load build config file');
			await readConfigFile(this.path, this);
			programSectionEnd();
		}
	}
}
