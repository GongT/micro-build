export interface IArgument {
	name: string;
	description: string;
	defaultValue: string;
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
}

export interface IArgumentParam extends IArgumentRequired {
	placement: number;
	variable_length: boolean;
}

export interface ArgumentValueChecker {
	(value: string): any|void;
}

export class ArgumentError extends Error {
}

export function getOptionByName(optionList: IArgumentCommand[], name: string): IArgumentCommand;
export function getOptionByName(optionList: IArgumentOption[], name: string): IArgumentOption;
export function getOptionByName<T extends IArgumentWithAlias>(optionList: T[], name: string): T {
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
	return getOptionByName(self.subCommands, name);
}
