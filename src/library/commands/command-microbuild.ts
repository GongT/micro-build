import {CommandParser, SubCommandParser} from "./argument-parser/index";
import {IArgumentOption} from "./argument-parser/base";
import {__} from "../common/i18n";
import {platform} from "os";

export interface CommandDefine {
	command: string;
	description: string;
	aliases?: string[];
	builder?: (parser: SubCommandParser) => void;
}

const isLinux = /linux/i.test(platform());

export const parser = new CommandParser;
parser.commandName('microbuild');
parser.help('--help', '-h');

const switchProject: IArgumentOption = {
	multipleTimes: false,
	acceptValue: true,
	name: 'project',
	alias: ['P'],
	description: __('cmd_desc.project'),
	defaultValue: '.',
};

parser.addOption(switchProject);

parser.addCommand('init')
      .description(__('command.init'))
      .addParam('location')
      .description(__('command.init.location'))
      .defaultValue('.');

const install = parser.addCommand('deploy');
install.addParam('all');

const create = parser.addCommand('create');
create.addCommand('dockerfile').aliases('docker').required();
create.addCommand('service');

const run = parser.addCommand('run');
run.addCommand('debug');
run.addCommand('docker');

const service = parser.addCommand('service');
service.addCommand('status');
service.addCommand('install');
service.addCommand('uninstall');
service.addCommand('display');

const enable = service.addCommand('autostart');
enable.addParam('on');
enable.addParam('off');

const control = service.addCommand('control');
control.addCommand('start');
control.addCommand('restart');
control.addCommand('stop');
control.addCommand('reset');
control.addCommand('kill');

parser.addCommand('logs').aliases('log')
      .addOption('f').defaultValue(true).notAcceptValue();
parser.addCommand('build');

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
