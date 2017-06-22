import {MicrobuildCommandParser} from "@gongt/micro-build";

MicrobuildCommandParser.addCommand('logs').aliases('log')
                       .addOption('f').defaultValue(true).notAcceptValue();
