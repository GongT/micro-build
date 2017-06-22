import {CallbackList} from "@gongt/ts-stl-library/pattern/callback-list";
import {fileExists} from "./library/common/filesystem";
import {BuildDependency} from "./library/dependencies/dependency";
import {getPathConfigFile} from "./library/paths";
import {PluginBase} from "./library/plugins/base";
import {PluginsHandler} from "./library/plugins/handler";

export interface ConfigFileOutput {
	plugins: PluginsHandler;
	dependencies: Array<BuildDependency>;
	environments: Map<string, {content: string; append: boolean;}>;
	domain: string;
	project: string;
	cmds: string[];
	shell: string[];
	exists: boolean;
	filePath: string;
	onConfig: CallbackList<boolean>;
}

export class ConfigFile {
	protected exportData: ConfigFileOutput;
	
	constructor() {
		const filePath = getPathConfigFile();
		this.exportData = {
			filePath: filePath,
			onConfig: new CallbackList,
			exists: fileExists(filePath),
			domain: '',
			project: '',
			cmds: [],
			shell: [],
			environments: new Map(),
			dependencies: [],
			plugins: new PluginsHandler,
		};
	}
	
	registerPlugin<ParamType>(plugin: PluginBase<ParamType>) {
		return this.exportData.plugins.pushStack(plugin);
	}
	
	protected _exists: boolean;
	
	setBaseDomain(domain: string) {
		this.exportData.domain = domain;
	}
	
	setProjectName(project: string) {
		this.exportData.project = project;
	}
	
	startupCommand(cmds: string[]) {
		this.exportData.cmds = cmds;
	}
	
	shellCommand(shell: string[]) {
		this.exportData.shell = shell;
	}
	
	environmentVariable(name: string, content: string, append?: boolean) {
		this.exportData.environments.set(name, {content, append});
	}
	
	dependency(depend: BuildDependency) {
		this.exportData.dependencies.push(depend);
	}
	
	onConfig(cb: (isBuild: boolean) => void) {
		this.exportData.onConfig.add(cb);
	}
	
	onBuild(cb: () => any) {
		this.exportData.onConfig.add((isBuild) => {
			if (isBuild) {
				return cb();
			}
		});
	}
	
	onDebug(cb: () => any) {
		this.exportData.onConfig.add((isBuild) => {
			if (!isBuild) {
				return cb();
			}
		});
	}
}
