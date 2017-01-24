///<reference path="base.ts"/>
import {UsageHelper} from "./help";
import {IArgumentCommand, IArgumentOption, IArgumentParam, ArgumentValueChecker, ArgumentError} from "./base";
import {realParseArguments, NormalizedArguments} from "./real-parse";
import {OptionHelper, ParamHelper, CommandHelper} from "./chain-helper";

export abstract class ArgumentStore extends CommandHelper {
	addOption(optionDefine: IArgumentOption | string) {
		if (typeof optionDefine === 'string') {
			optionDefine = <any>{
				acceptValue: true,
				name: optionDefine,
				description: '*no description*',
			};
		}
		return new OptionHelper(<any>optionDefine, this);
	}
	
	addParam(paramDefine: IArgumentParam | string) {
		if (typeof paramDefine === 'string') {
			paramDefine = <any>{
				name: paramDefine,
				description: '*no description*',
			};
		}
		return new ParamHelper(<any>paramDefine, this);
	}
	
	addCommand(commandDefine: IArgumentCommand | string, commandFunction?: Function) {
		if (typeof commandDefine === 'string') {
			commandDefine = <any>{
				name: commandDefine,
				description: '*no description*',
			};
		}
		const ret = new SubCommandParser(<any>commandDefine, this);
		if (commandFunction) {
			ret.callback(commandFunction);
		}
		return ret;
	}
}

export class SubCommandParser extends ArgumentStore {
	required(required: boolean = true) {
		this.object.isRequired = required;
		return this;
	}
	
	callback(fn: Function) {
		this.object.callback = fn;
		return this;
	}
	
	aliases(...aliases: string[]) {
		this.object.alias = aliases;
		return this;
	}
}

import {EventEmitter} from 'events';

export class CommandParser extends ArgumentStore {
	public readonly events: EventEmitter;
	private usage: UsageHelper;
	
	constructor(name: string = process.argv[1]) {
		super(<any>{}, null);
		this.commandName(name);
		this.events = new EventEmitter;
		this.usage = new UsageHelper(this.object);
		this.object.globalOptions = [];
	}
	
	parse(argv: string[]): NormalizedArguments {
		try {
			return realParseArguments(argv, this.object);
		} catch (e) {
			if (e instanceof ArgumentError) {
				this.usage.error(e);
			} else {
				throw e;
			}
		}
	}
	
	usageInstance() {
		return this.usage;
	}
	
	help(alias: string, ...aliases: string[]) {
		const options: string[] = [];
		const commands: string[] = [];
		[alias, ...aliases].forEach((name) => {
			if (/^-/.test(name)) {
				options.push(name.replace(/^-+/, ''));
			} else {
				commands.push(name);
			}
		});
		
		if (commands.length) {
			this.addCommand(commands[0])
			    .aliases(...commands)
			    .description('show help message');
		}
		if (options.length) {
			this.addOption(options[0])
			    .aliases(...options)
			    .description('show help message')
			    .notAcceptValue()
			;
			this.object.globalOptions.push(this.object.options.pop())
		}
		
		return this;
	}
	
	commandName(name: string) {
		return this.object.name = name;
	}
}
