import {MicrobuildCommandParser} from "@gongt/micro-build";

const install = MicrobuildCommandParser.addCommand('deploy');
install.addParam('all');
