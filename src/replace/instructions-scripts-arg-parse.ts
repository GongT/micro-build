import {ScriptVariables} from "./instructions-scripts";
import {help_message} from "../library/parse-build-arguments";

export class ArgParseVars extends ScriptVariables {
	private NO_VALUE_STR = '"[[NO-VALUE]]"';
	private NO_VALUE_PARAM = '# NO-VALUE';
	private NO_VALUE_LINE = '# NO-VALUE';
	
	ARGUMENT_HELP_MESSAGE() {
		return help_message(this.config);
	}
	
	private walkArg(run: boolean|undefined, split: string, empty: string, fn: Function) {
		return this.walk(this.config.toJSON().arguments, function (d, n) {
				if (run === undefined || run === d.runArg) {
					return fn(d, d.name);
				}
			}, split) || empty;
	}
	
	RUN_ARGUMENTS_ONE_ITEM() {
		return this.walkArg(true, '|', this.NO_VALUE_STR, function (d, n) {
			return `--${n}=*`;
		});
	}
	
	RUN_ARGUMENTS() {
		return this.walkArg(true, '|', this.NO_VALUE_STR, function (d, n) {
			return `--${n}|-${n}`;
		});
	}
	
	BUILD_ARGUMENTS_ONE_ITEM() {
		return this.walkArg(false, '|', this.NO_VALUE_STR, function (d, n) {
			return `--${n}=*`;
		});
	}
	
	BUILD_ARGUMENTS() {
		return this.walkArg(false, '|', this.NO_VALUE_STR, function (d, n) {
			return `--${n}|-${n}`;
		});
	}
	
	RUN_ARGUMENT_CHECK() {
		return this.walkArg(true, ' ', this.NO_VALUE_PARAM, function (d, n) {
			return n;
		});
	}
	
	BUILD_ARGUMENT_CHECK() {
		return this.walkArg(false, ' ', this.NO_VALUE_PARAM, function (d, n) {
			return n;
		});
	}
	
	OPTIONAL_ARGUMENTS() {
		return this.walkArg(undefined, '|', this.NO_VALUE_STR, function (d, n) {
			if (d.defaultValue !== null) {
				return n;
			}
		});
	}
	
	OPTIONAL_ARGUMENTS_VALUE_MAP() {
		return this.walkArg(undefined, '\n', this.NO_VALUE_LINE, function (d, n) {
			if (d.defaultValue !== null) {
				return `${n})
			echo ${JSON.stringify(d.defaultValue)}
			echo -n "using default " >&2
		;;`;
			}
		});
	}
}
