import {__} from "../common/my-i18n";
import {IArgumentOption} from "./argument-parser/base";
import {CommandParser} from "./argument-parser/index";

export enum MB_COMMAND {
	INIT = 'init',
	CREATE = 'create',
	CREATE_UNIT = 'unit',
	CREATE_JOB = 'job',
	CREATE_ALL = 'all',
	BUILD = 'build',
	RUN = 'run',
	RUN_DEBUG = 'debug',
	CONTROL = 'control',
	CONTROL_RESTART = 'restart',
}

export const parser = new CommandParser;
parser.commandName('microbuild');
parser.help('--help', '-h');

export const optSwitchProject: IArgumentOption = {
	multipleTimes: false,
	acceptValue: true,
	name: 'project',
	alias: ['p'],
	description: __('cmd_desc.project'),
	defaultValue: '.',
	completion: 'path',
};

parser.addOption(optSwitchProject);

parser.addCommand(MB_COMMAND.INIT)
      .description(__('command.init'));

const create = parser.addCommand(MB_COMMAND.CREATE);
create.addCommand(MB_COMMAND.CREATE_UNIT);
create.addCommand(MB_COMMAND.CREATE_JOB);
create.addCommand(MB_COMMAND.CREATE_ALL);

const run = parser.addCommand(MB_COMMAND.RUN);
run.addCommand(MB_COMMAND.RUN_DEBUG);
const service = run.addCommand(MB_COMMAND.CONTROL);
service.addOption(MB_COMMAND.CONTROL_RESTART)
       .aliases('r')
       .description(__('command.restart'));

parser.addCommand('build');
