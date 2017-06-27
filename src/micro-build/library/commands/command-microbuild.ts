import {__} from "../common/my-i18n";
import {IArgumentOption} from "./argument-parser/base";
import {CommandParser} from "./argument-parser/index";

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

parser.addCommand('init')
      .description(__('command.init'));

const create = parser.addCommand('create');
create.addCommand('dockerfile');
create.addCommand('service');
create.addCommand('job');
create.addCommand('all');

const run = parser.addCommand('run');
run.addCommand('debug');
run.addCommand('docker');
const service = run.addCommand('service');
service.addOption('restart')
       .aliases('r')
       .description(__('command.restart'));

parser.addCommand('build');
