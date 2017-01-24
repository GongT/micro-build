import {
	ArgumentError,
	IArgumentOption,
	IArgumentCommand,
	getKnownOption,
	getKnownCommand,
	getOptionByName,
	IArgumentParam
} from "./base";

export interface NormalizedArguments {
	name: string;
	paramsList: string[];
	namedParams: {[id: string]: string};
	remaining: string[];
	nextConfig: IArgumentCommand;
	next?: NormalizedArguments;
	options: {
		name: string;
		value: any;
		config: IArgumentOption;
	}[];
	namedOptions: {[id: string]: any};
}

export function realParseArguments(argv: string[], config: IArgumentCommand) {
	const argument = tokenizeOptions(argv, config);
	
	let argItr = argument;
	while (argItr.nextConfig) {
		// console.log('next: ', argItr.next.name);
		argItr = argItr.next = tokenizeOptions(argument.remaining, argument.nextConfig);
	}
	
	return argument;
}

const GET_NAME_FROM_PAIR = /^-+(\S+?)=/;
const GET_NAME_SINGLE = /^-+(\S+)$/;
const ANY_ARG = /^-/;
const SHORT_ARG = /^-(?!-)/;
const LONG_ARG = /^--/;
const LONG_ARG_WITH_VALUE = /^--\S+?=/;

function tokenizeOptions(argv: string[], config: IArgumentCommand): NormalizedArguments {
	argv = argv.slice();
	let paramsDefineItr: number = 0;
	
	const ret: NormalizedArguments = {
		name: config.name,
		paramsList: [],
		namedParams: {},
		options: [],
		namedOptions: {},
		remaining: [],
		nextConfig: null,
	};
	
	const globalArgs = config.globalOptions;
	let watchingGlobalOptions = (!!globalArgs) && globalArgs.length > 0;
	let watchingOptions = true;
	
	for (let argPart = argv[0], itrIndex = 0; itrIndex < argv.length; itrIndex += 1, argPart = argv[itrIndex]) {
		// console.log('parse: %s -> %s', itrIndex, argPart);
		let isShort: boolean;
		
		if (watchingOptions && (
				(isShort = SHORT_ARG.test(argPart)) || LONG_ARG.test(argPart)
			)) {
			const name = (GET_NAME_FROM_PAIR.exec(argPart) || GET_NAME_SINGLE.exec(argPart))[1];
			
			if (isShort && name.length > 1) {
				const names = [...name].map(e => `-${e}`);
				argv.splice(itrIndex, 1, ...names);
				itrIndex--;
				continue;
			}
			
			if (argPart === '--') {
				watchingOptions = false;
				continue;
			}
			
			const option = (() => {
				const globalOption = watchingGlobalOptions? getOptionByName(globalArgs, name) : null;
				if (globalOption) {
					return globalOption;
				}
				
				const otherOption = getKnownOption(config, name);
				if (otherOption) {
					watchingGlobalOptions = false;
				}
				
				if (!otherOption && !globalOption) {
					throw new ArgumentError('Unknown option: ' + argPart);
				}
				return otherOption;
			})();
			
			const hasDefault = option.hasOwnProperty('defaultValue');
			if (option.acceptValue) {
				const inlineValue = LONG_ARG_WITH_VALUE.test(argPart)?
					argPart.replace(GET_NAME_FROM_PAIR, '') : undefined;
				const lookAhead = argv[itrIndex + 1];
				
				if (!inlineValue && !lookAhead) {
					throw new ArgumentError('Expected value for option: ' + argPart + ', but no more arguments.');
				}
				
				if (!inlineValue && ANY_ARG.test(lookAhead)) {
					if (hasDefault) {
						ret.options.push({
							name: option.name,
							value: option.defaultValue,
							config: option,
						});
					} else {
						throw new ArgumentError('Expected value for option: ' + argPart + ', but got ' + lookAhead);
					}
				} else {
					ret.options.push({
						name: option.name,
						value: lookAhead,
						config: option,
					});
					if (!inlineValue) {
						argv.splice(itrIndex + 1, 1);
					}
				}
			} else {
				ret.options.push({
					name: option.name,
					value: true,
					config: option,
				});
			}
		} else {
			watchingGlobalOptions = false;
			const isCommand = getKnownCommand(config, argPart);
			if (isCommand) {
				ret.nextConfig = isCommand;
				ret.remaining = argv.splice(itrIndex + 1, argv.length)
			} else {
				const item = config.params[paramsDefineItr];
				if (!item) {
					throw new ArgumentError('Unexpected param: ' + argPart + '.');
				}
				if (item.variable_length) {
					watchingOptions = false;
					ret.paramsList.push(argPart);
				} else {
					ret.namedParams[item.name] = argPart;
					paramsDefineItr++;
				}
			}
		}
	}
	
	ret.options.forEach(({name, value, config}) => {
		if (config.multipleTimes) {
			if (config.acceptValue) {
				if (ret.namedOptions.hasOwnProperty(name)) {
					ret.namedOptions[name].push(value);
				} else {
					ret.namedOptions[name] = [value];
				}
			} else {
				if (ret.namedOptions.hasOwnProperty(name)) {
					ret.namedOptions[name]++;
				} else {
					ret.namedOptions[name] = 1;
				}
			}
		} else {
			if (ret.namedOptions.hasOwnProperty(name)) {
				throw new ArgumentError('Duplicate options: ' + name);
			}
			ret.namedOptions[name] = value;
		}
	});
	
	[].concat(config.globalOptions || [], config.options || []).forEach((e: IArgumentOption) => {
		if (<any>e.defaultValue === false && !ret.namedOptions.hasOwnProperty(e.name)) {
			if (e.defaultValue) {
				ret.namedOptions[e.name] = e.defaultValue;
			} else {
				throw new ArgumentError('Missing required options: --' + e.name);
			}
		}
	});
	config.params.forEach((e: IArgumentParam) => {
		if (!ret.namedParams.hasOwnProperty(e.name)) {
			if (e.defaultValue) {
				ret.namedParams[e.name] = e.defaultValue;
			} else if (e.isRequired) {
				throw new ArgumentError('Missing required param: ' + e.name);
			} else {
				ret.namedParams[e.name] = undefined;
			}
		}
	});
	
	return ret;
}
