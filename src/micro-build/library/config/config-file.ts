import {fileExists} from "../common/filesystem";
import {getPathConfigFile} from "../common/paths";
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
	protected exportData: Partial<ConfigFileOutput>;
	public readonly filePath: string;
	public readonly exists: boolean;
	
	constructor(path: string = getPathConfigFile()) {
		this.filePath = path;
		this.exists = fileExists(path);
		
		this.exportData = {
			plugins: new PluginsHandler,
			dependencies: [],
			project: '',
		};
		
		if (this.exists) {
			this.read();
		}
	}
	
	plugin<ParamType>(plugin: PluginBase<ParamType>) {
		return this.exportData.plugins.pushStack(plugin);
	}
	
	dependency(depend: BuildDependency) {
		this.exportData.dependencies.push(depend);
	}
	
	private read() {
		readConfigFile(this, this.filePath);
	}
}
