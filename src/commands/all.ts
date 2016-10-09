import update from "./update";
import init from "./init";
import mkconfig from "./mkconfig";
import debug from "./debug";
import build from "./build";
import clean from "./clean";
import control from "./control";
import foreground from "./foreground";
import run from "./run";
import script from "./script";

export const commandList = {
	init,
	update,
	mkconfig,
	foreground,
	run,
	debug,
	build,
	clean,
	install: control,
	uninstall: control,
	restart: control,
	start: control,
	stop: control,
	status: control,
	enable: control,
	disable: control,
	script: script,
};
