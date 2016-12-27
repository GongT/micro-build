import {readFileSync} from "fs";
import {injectJsonEnv} from "../library/json-env-cli";
import {MicroBuildConfig, EPlugins} from "../library/microbuild-config";

export class TemplateRender {
	private tpl;
	private fileName;
	
	constructor(fileName: string) {
		this.tpl = readFileSync(fileName, 'utf-8');
		this.fileName = fileName;
	}
	
	render(ins: TemplateVariables) {
		return this.tpl.replace(/(^#|@)\{([A-Z_0-9]+)}/gm, (m0, type, name) => {
			if (!ins.saved[name]) {
				if (!ins[name]) {
					throw new Error(`unknown variable ${name} in template ${this.fileName}`);
				}
				try {
					ins.saved[name] = ins[name]();
					// console.log('instruction: %s -> %s', name, ins.saved[name].split(/\n/)[0]);
				} catch (e) {
					e.message += ` (in file ${this.fileName})`;
					throw e;
				}
				if (type === '#') {
					ins.saved[name] = '# INSTRUCTION ' + name + '\n' + ins.saved[name];
				}
			}
			return ins.saved[name];
		});
	}
}

export abstract class TemplateVariables {
	protected config: MicroBuildConfig;
	protected jsonEnvEnabled = false;
	public saved: any = {};
	
	constructor(config: MicroBuildConfig|TemplateVariables, extra: KVP<Function> = {}) {
		if (config instanceof MicroBuildConfig) {
			this.config = config;
		} else if (config instanceof TemplateVariables) {
			this.saved = config.saved;
			this.config = config.config;
		}
		
		const jenv = this.config.getPlugin(EPlugins.jenv);
		if (jenv && jenv.options) {
			injectJsonEnv();
			this.jsonEnvEnabled = true;
		}
		
		Object.keys(extra).forEach((name) => {
			this[name] = extra[name];
		});
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
	
	protected wrapEnvStrip(v: any) {
		return this.wrapEnv(v).replace(/^"|"$/g, '');
	}
	
	protected wrapEnv(v: any) {
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
