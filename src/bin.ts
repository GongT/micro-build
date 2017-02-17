/// <reference path="./globals.d.ts"/>
import {UsageHelper} from "./commands/argument-parser/help";
import {
	startDefine,
	stopDefine,
	restartDefine,
	statusDefine,
	psDefine,
	enableDefine,
	disableDefine,
	uninstallDefine,
	installDefine
} from "./commands/list/control";
import {createCommand, parser, callCommandFunction} from "./commands/command-library";
import {debug, commandDefine as cmdDebug} from "./commands/list/debug";
import {build, commandDefine as cmdBuild} from "./commands/list/build";
import {exec, commandDefine as cmdExec} from "./commands/list/exec";
import {dist_clean, commandDefine as cmdDistClean} from "./commands/list/dist_clean";
import {clean, commandDefine as cmdClean} from "./commands/list/clean";
import {update, commandDefine as cmdUpdate} from "./commands/list/update";
import {initialize, commandDefine as cmdInitialize} from "./commands/list/initialize";
import {run, commandDefine as cmdRun} from "./commands/list/run";
import {foreground, commandDefine as cmdForeground} from "./commands/list/foreground";
import {reload, commandDefine as cmdReload} from "./commands/list/reload";
import {mkconfig, commandDefine as cmdMkConfig} from "./commands/list/mkconfig";
import {deploy, commandDefine as cmdDeploy} from "./commands/list/deploy";
import {updateCurrentDir} from "./library/common/file-paths";

createCommand(debug, cmdDebug);
createCommand(build, cmdBuild);

createCommand(installDefine.handler, installDefine.config);
createCommand(uninstallDefine.handler, uninstallDefine.config);

createCommand(startDefine.handler, startDefine.config);
createCommand(stopDefine.handler, stopDefine.config);
createCommand(restartDefine.handler, restartDefine.config);
createCommand(statusDefine.handler, statusDefine.config);

createCommand(psDefine.handler, psDefine.config);
createCommand(enableDefine.handler, enableDefine.config);
createCommand(disableDefine.handler, disableDefine.config);

createCommand(exec, cmdExec);
createCommand(initialize, cmdInitialize);
createCommand(update, cmdUpdate);
createCommand(run, cmdRun);
createCommand(foreground, cmdForeground);
createCommand(reload, cmdReload);
createCommand(mkconfig, cmdMkConfig);
createCommand(deploy, cmdDeploy);

createCommand(clean, cmdClean);
createCommand(dist_clean, cmdDistClean);

const argv = process.argv.slice(2);
const args = parser.parse(argv);

if (args.namedOptions['help']) {
	if (args.next) {
		new UsageHelper(args.nextConfig).print();
	} else {
		console.log('\n    [Micro Build] is a collection of tools, to build micro-service with docker.\n');
		parser.usageInstance().print();
	}
}

if (!args.next) {
	parser.usageInstance().error(new Error('Command is required'));
}

if (args.namedParams['project']) {
	updateCurrentDir(args.namedParams['project']);
}

callCommandFunction(args.nextConfig, args.next);
