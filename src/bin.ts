/// <reference path="./globals.d.ts"/>
import {UsageHelper} from "./commands/argument-parser/help";
import {callCommandFunction, createCommand, parser} from "./commands/command-library";
import {build, commandDefine as cmdBuild} from "./commands/list/build";
import {clean, commandDefine as cmdClean} from "./commands/list/clean";
import {
	disableDefine,
	enableDefine,
	installDefine,
	psDefine,
	restartDefine,
	startDefine,
	statusDefine,
	stopDefine,
	uninstallDefine,
} from "./commands/list/control";
import {commandDefine as cmdDebug, debug} from "./commands/list/debug";
import {commandDefine as cmdDeploy, deploy} from "./commands/list/deploy";
import {commandDefine as cmdDistClean, dist_clean} from "./commands/list/dist_clean";
import {commandDefine as cmdExec, exec} from "./commands/list/exec";
import {commandDefine as cmdForeground, foreground} from "./commands/list/foreground";
import {commandDefine as cmdInitialize, initialize} from "./commands/list/initialize";
import {commandDefine as cmdMkConfig, mkconfig} from "./commands/list/mkconfig";
import {commandDefine as cmdUpToDate, up_to_date} from "./commands/list/up-to-date";
import {commandDefine as cmdReload, reload} from "./commands/list/reload";
import {commandDefine as cmdRun, run} from "./commands/list/run";
import {commandDefine as cmdUpdate, update} from "./commands/list/update";
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

createCommand(up_to_date, cmdUpToDate);

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
