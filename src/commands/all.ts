import update from "./update";
import init from "./init";
import mkconfig from "./mkconfig";
import debug from "./debug";
import build from "./build";
import clean from "./clean";
import {install, uninstall} from "./install";

export const commandList = {
	init,
	update,
	mkconfig,
	debug,
	build,
	clean,
	install,
	uninstall,
};
