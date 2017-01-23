export interface ArgDefine {
	inspect: string;
	name: string;
	isOptional: boolean;
	isVaArg: boolean;
}

const ARROW_ARG = /^([^(]+?)=>/;
const FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m;
const FN_ARG_SPLIT = /,/;
const VA_ARGS = /^\.\.\./;
const DEFAULT_ARGS = /^(\S+)\s*=/;

export function extractArgs(fn): ArgDefine[] {
	const fnText = Function.prototype.toString.call(fn);
	const args = fnText.match(ARROW_ARG) || fnText.match(FN_ARGS);
	if (!args) {
		throw new Error(`some handler not a normal function`);
	}
	if (args[1].trim()) {
		return args[1].split(FN_ARG_SPLIT).map(arg => {
			arg = arg.trim();
			const def = DEFAULT_ARGS.exec(arg);
			const name = def? def[1] : arg;
			
			return {
				inspect: arg,
				name: name.replace(/^\.\.\./, ''),
				isOptional: !!def,
				isVaArg: /^\.\.\./.test(name),
			};
		});
	} else {
		return [];
	}
}
