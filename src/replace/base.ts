import {readFileSync} from "fs";
import {injectJsonEnv} from "../library/cli/json-env-cli";
import {EPlugins, MicroBuildConfig} from "../library/microbuild-config";
import {safeEnvStringInValue, safeScriptValue, walkValueKey} from "./parts/wrapper";

export const RSPLIT_END = '\\';
export const RSPLIT_START = ' && ';
export const DOCKERFILE_RUN_SPLIT = RSPLIT_END + '\n' + RSPLIT_START;

export class TemplateRender {
	private tpl;
	private fileName;
	
	constructor(fileName: string) {
		this.tpl = readFileSync(fileName, 'utf-8');
		this.fileName = fileName;
	}
	
	render(ins: TemplateVariables) {
		if (!ins) {
			throw new Error('no variables instance passed into template.')
		}
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
	public readonly config: MicroBuildConfig;
	protected jsonEnvEnabled = false;
	public readonly saved: any = {};
	
	constructor(config: MicroBuildConfig|TemplateVariables, extra: KVP<Function> = {}) {
		if (config instanceof MicroBuildConfig) {
			this.config = config;
		} else if (config instanceof TemplateVariables) {
			this.saved = config.saved || {};
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
	
	PROJECT_NAME() {
		return this.config.toJSON().projectName;
	}
	
	walk(vars: any, cb: Function, split = '\n') {
		return walkValueKey(vars, cb, split);
	}
	
	wrapEnvStrip(v: any) {
		return safeEnvStringInValue(v);
	}
	
	wrapEnv(v: any) {
		return safeScriptValue(v);
	}
}
