import {readFileSync} from "fs";
import {injectJsonEnv} from "../library/json-env-cli";
import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";

export class TemplateRender {
	private tpl;
	private saved = {};
	private fileName;
	
	constructor(fileName: string) {
		this.tpl = readFileSync(fileName, 'utf-8');
		this.fileName = fileName;
	}
	
	render(ins: TemplateVariables) {
		return this.tpl.replace(/(^#|@)\{([A-Z_0-9]+)}/gm, (m0, m1, name) => {
			if (!this.saved[name]) {
				if (!ins[name]) {
					throw new Error(`unknown variable ${name} in template ${this.fileName}`);
				}
				this.saved[name] = ins[name]();
			}
			return this.saved[name];
		});
	}
}

export class TemplateVariables {
	protected config;
	protected jsonEnvEnabled = false;
	
	constructor(config: MicroBuildConfig, extra: KVP<Function> = {}) {
		this.config = config;
		
		if (!global.hasOwnProperty('JsonEnv')) {
			const options = this.config.getPlugin(EPlugins.jenv);
			if (options) {
				injectJsonEnv();
				this.jsonEnvEnabled = true;
			}
		} else {
			this.jsonEnvEnabled = true;
		}
		
		Object.keys(extra).forEach((name) => {
			this[name] = extra[name];
		});
	}
	
	COMMANDS() {
		return `CMD ${this.COMMAND()}
ENTRYPOINT ${this.SHELL()}`;
	}
	
	SHELL() {
		return this.config.toJSON().shell;
	}
	
	COMMAND() {
		return this.config.toJSON().command;
	}
}
