import {MicrobuildCommandParser} from "@gongt/micro-build";

const service = MicrobuildCommandParser.addCommand('service');
service.abstract();
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
