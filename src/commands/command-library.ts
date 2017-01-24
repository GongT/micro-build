import {CommandParser, SubCommandParser} from "./argument-parser/index";
import {IArgumentOption, IArgumentCommand, ArgumentError} from "./argument-parser/base";
import {NormalizedArguments} from "./argument-parser/real-parse";
import {extractArgs} from "./argument-parser/function-arguments";
export interface CommandDefine {
	command: string;
	description: string;
	aliases?: string[];
	builder?: (parser: SubCommandParser) => void;
}

export const parser = new CommandParser;
parser.commandName('microbuild');
parser.help('--help', '-h');

const switchProject: IArgumentOption = {
	multipleTimes: false,
	acceptValue: true,
	name: 'project',
	alias: ['P'],
	description: '先切换到这个项目，然后再运行命令',
	defaultValue: '.',
};

parser.addOption(switchProject);

export function createCommand(func: Function, config: CommandDefine): SubCommandParser {
	const commander:SubCommandParser = parser.addCommand(config.command, func)
	                        .description(config.description);
	
	if (config.aliases) {
		commander.aliases(...config.aliases);
	}
	if (config.builder) {
		config.builder(commander);
	}
	return commander;
}

export function die(...args: any[]) {
	console.error.apply(console, args);
	process.exit(1);
}

export function callCommandFunction(config: IArgumentCommand, argument: NormalizedArguments) {
	const realArgs = [];
	extractArgs(config.callback).forEach((arg) => {
		if (arg.isVaArg) {
			realArgs.push(argument.paramsList);
		} else if (argument.namedOptions.hasOwnProperty(arg.name)) {
			realArgs.push(argument.namedOptions[arg.name]);
		} else if (argument.namedParams.hasOwnProperty(arg.name)) {
			realArgs.push(argument.namedParams[arg.name]);
		} else {
			throw new ArgumentError('Expected argument: ' + arg.name);
		}
	});
	const promise = config.callback.apply(argument, realArgs);
	if (promise && promise.then) {
		promise.then(() => {
			process.exit(0);
		}, exit);
	} else {
		exit(promise);
	}
}

function exit(e: any = 0) {
	if (typeof e === 'number') {
		process.exit(e);
	} else {
		console.error(e);
		process.exit(1);
	}
}
