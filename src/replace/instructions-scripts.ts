import {TemplateVariables} from "./base";
import {getTempPath} from "../library/file-paths";
import {resolve} from "path";

export class ScriptVariables extends TemplateVariables {
	SERVICE_NAME() {
		return this.config.toJSON().projectName;
	}
	
	DOMAIN_NAME() {
		return this.config.toJSON().domain;
	}
	
	JENV_FILE_NAME_REL() {
		if (this.jsonEnvEnabled) {
			return JsonEnv.JENV_FILE_NAME_REL;
		} else {
			throw new Error('json env error: used but not enable');
		}
	}
	
	JENV_FILE_NAME() {
		if (this.jsonEnvEnabled) {
			return resolve(getTempPath(), 'json-env-data.json');
		} else {
			throw new Error('json env error: used but not enable');
		}
	}
	
	BASE_DOMAIN_NAME() {
		return this.config.getDomainBase();
	}
	
	PWD() {
		return getTempPath();
	}
	
	SCSS_PLUGIN_START() {
		
	}
}
