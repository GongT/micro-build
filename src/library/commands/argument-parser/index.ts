///<reference path="base.ts"/>
import {IArgumentCommand, IArgumentOption, IArgumentParam} from "./base";
import {NormalizedArguments, realParseArguments} from "./real-parse";
import {CommandHelper, OptionHelper, ParamHelper} from "./chain-helper";
import {EventEmitter} from "events";

export abstract class ArgumentStore extends CommandHelper {
	addOption(optionDefine: IArgumentOption|string) {
		if (typeof optionDefine === 'string') {
			optionDefine = <any>{
				acceptValue: true,
				name: optionDefine,
				description: '*no description*',
			};
		}
		return new OptionHelper(<any>optionDefine, this);
	}
	
	addParam(paramDefine: IArgumentParam|string) {
		if (typeof paramDefine === 'string') {
			paramDefine = <any>{
				name: paramDefine,
				description: '*no description*',
			};
		}
		return new ParamHelper(<any>paramDefine, this);
	}
	
	addCommand(commandDefine: IArgumentCommand|string, commandFunction?: Function): SubCommandParser {
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
	
	getCommand(name:string): SubCommandParser {
		console.log(this.object)
//		return this.object.
		return null;
	}
}

export class SubCommandParser extends ArgumentStore {
	abstract(abstract: boolean = true) {
		this.object.isRequired = abstract;
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
	
	attachData(data: any) {
		this.object.metadata = data;
	}
}

export class CommandParser extends ArgumentStore {
	public readonly events: EventEmitter;
	protected _last_result: NormalizedArguments;
	
	constructor(name: string = process.argv[1]) {
		super(<any>{}, null);
		this.commandName(name);
		this.events = new EventEmitter;
		this.object.globalOptions = [];
	}
	
	get result(): NormalizedArguments {
		return this._last_result;
	}
	
	parse(argv: string[] = process.argv.slice(2)): NormalizedArguments {
		return this._last_result = realParseArguments(argv, this.object);
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
			this.object.globalOptions.push(this.object.options.pop());
		}
		
		return this;
	}
	
	globalOption(optionDefine: IArgumentOption|string) {
		const opt = this.addOption(optionDefine);
		this.object.globalOptions.push(this.object.options.pop());
		return opt;
	}
	
	commandName(name: string) {
		return this.object.name = name;
	}
}
