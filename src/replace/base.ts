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
		return this.tpl.replace(/(^#|@)\{([A-Z_0-9]+)}/gm, (m0, type, name) => {
			if (!this.saved[name]) {
				if (!ins[name]) {
					throw new Error(`unknown variable ${name} in template ${this.fileName}`);
				}
				this.saved[name] = ins[name]();
				if (type === '#') {
					this.saved[name] = '# INSTRUCTION ' + name + '\n' + this.saved[name];
				}
			}
			return this.saved[name];
		});
	}
}

export class TemplateVariables {
	protected config: MicroBuildConfig;
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
	
	SHELL() {
		return this.config.toJSON().shell;
	}
	
	COMMAND() {
		return this.config.toJSON().command;
	}
	
	protected walk(vars: any, cb: Function, split = '\n') {
		let list;
		if (Array.isArray(vars)) {
			list = vars.map((val, index) => {
				return cb(val, index);
			});
		} else {
			list = Object.keys(vars).map((name) => {
				return cb(vars[name], name);
			});
		}
		list = list.filter((s) => {
			return s !== undefined && s !== null;
		});
		if (list.length) {
			let ret = list.join(split).trim();
			if (split === '\n') {
				ret += split;
			}
			return ret;
		} else {
			return '';
		}
	}
	
	protected wrapJson(v: any) {
		if (v === false || v === undefined || v === null) {
			return '';
		} else if (v === true) {
			return 'yes';
		} else if (typeof v === 'object') {
			return JSON.stringify(JSON.stringify(v));
		} else {
			return JSON.stringify(v);
		}
	}
}
