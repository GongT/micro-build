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
	description: '在这个目录中运行，而不是当前目录',
	defaultValue: '.',
};

parser.addOption(switchProject);

export function die(...args: any[]) {
	console.error.apply(console, args);
	process.exit(1);
}

function exit(e: any = 0) {
	if (typeof e === 'number') {
		process.exit(e);
	} else {
		console.error(e);
		process.exit(1);
	}
}
