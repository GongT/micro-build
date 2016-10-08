import {TemplateVariables} from "./base";
import {getTempPath} from "../library/file-paths";
import {resolve} from "path";
import {help_message} from "../library/parse-build-arguments";

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
	
	ARGUMENT_HELP_MESSAGE() {
		return help_message(this.config);
	}
	
	private walkArg(run: boolean|undefined, fn: Function, split = '\n') {
		return this.walk(this.config.toJSON().arguments, function (d, n) {
			if (run === undefined || run === d.runArg) {
				return fn(d, n);
			}
		}, split);
	}
	
	RUN_ARGUMENTS_ONE_ITEM() {
		return this.walkArg(true, function (d, n) {
				return `--${n}=*`;
			}, '|') || 'no-value';
	}
	
	RUN_ARGUMENTS() {
		return this.walkArg(true, function (d, n) {
				return `--${n}|-${n}`;
			}, '|') || 'no-value';
	}
	
	BUILD_ARGUMENTS_ONE_ITEM() {
		return this.walkArg(false, function (d, n) {
				return `--${n}=*`;
			}, '|') || 'no-value';
	}
	
	BUILD_ARGUMENTS() {
		return this.walkArg(false, function (d, n) {
				return `--${n}|-${n}`;
			}, '|') || 'no-value';
	}
	
	RUN_ARGUMENT_CHECK() {
		return this.walkArg(true, function (d, n) {
			return n;
		}, ' ');
	}
	
	BUILD_ARGUMENT_CHECK() {
		return this.walkArg(false, function (d, n) {
			return n;
		}, ' ');
	}
	
	OPTIONAL_ARGUMENTS() {
		return this.walkArg(undefined, function (d, n) {
			if (d.defaultValue !== null) {
				return n;
			}
		}, '|');
	}
	
	OPTIONAL_ARGUMENTS_VALUE_MAP() {
		return this.walkArg(undefined, function (d, n) {
			if (d.defaultValue !== null) {
				return `${n})
			echo ${JSON.stringify(d.defaultValue)}
			echo -n "using default " >&2
		;;`;
			}
		});
	}
}
