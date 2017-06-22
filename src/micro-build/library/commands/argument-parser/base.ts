export interface IArgument {
	name: string;
	description: string;
	defaultValue: string;
	completion?: any; // TODO
}

export interface IArgumentWithAlias extends IArgument {
	alias: string[];
}
export interface IArgumentRequired extends IArgument {
	isRequired: boolean;
}

export interface IArgumentOption extends IArgumentWithAlias {
	multipleTimes: boolean;
	acceptValue: boolean;
}

export interface IArgumentCommand extends IArgumentWithAlias, IArgumentRequired {
	descriptionFull: string;
	$0: string;
	options: IArgumentOption[];
	globalOptions?: IArgumentOption[];
	subCommands: IArgumentCommand[];
	params: IArgumentParam[];
	callback: Function;
	metadata?: any;
}

export interface IArgumentParam extends IArgumentRequired {
	placement: number;
	variable_length: boolean;
}

export interface ArgumentValueChecker {
	(value: string): any|void;
}

export class ArgumentParserError extends Error {
}
export class ArgumentError extends Error {
	readonly helpObject: IArgumentCommand;
	
	constructor(message: string, obj?: IArgumentCommand) {
		super(message);
		this.helpObject = obj;
	}
	
	static fromParser(e: ArgumentParserError, obj: IArgumentCommand): ArgumentError {
		const ne = new ArgumentError(e.message, obj);
		const st = e.stack.split(/\n/g);
		st[0] = ne.message;
		ne.stack = st.join('\n');
		return ne;
	}
	
	static handle(e: Error, config: IArgumentCommand) {
		if (e instanceof ArgumentParserError) {
			throw ArgumentError.fromParser(e, config);
		} else {
			throw e;
		}
	}
}

export function getOptionByName(optionList: IArgumentOption[], name: string): IArgumentOption {
	return optionList.find((e) => {
		if (e.name === name) {
			return true;
		}
		return e.alias && e.alias.indexOf(name) !== -1;
	});
}

export function getKnownOption(self: IArgumentCommand, name): IArgumentOption {
	return getOptionByName(self.options, name)
}

export function getKnownCommand(self: IArgumentCommand, name): IArgumentCommand {
	const optionList = self.subCommands;
	let result = optionList.find((e) => {
		if (e.name === name) {
			return true;
		}
		return e.alias && e.alias.indexOf(name) !== -1;
	});
	
	if (!result) {
		const like = optionList.filter((e) => {
			return e.name.toLowerCase().indexOf(name.toLowerCase()) === 0
		});
		if (like.length === 1) {
			result = like[0];
		}
	}
	
	return result;
}
