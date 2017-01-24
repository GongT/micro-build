import {Script} from "vm";
import {dirname} from "path";
import {MicroBuildRoot} from "./file-paths";
const extend = require("util")._extend;

if (!process.env.NODE_PATH) {
	process.env.NODE_PATH = MicroBuildRoot+'/node_modules';
} else {
	process.env.NODE_PATH += ':' + MicroBuildRoot+'/node_modules';
}

export function run_script(code: string, filename: string, context: any, options?: {}) {
	const Module = require("module");
	const wrapper = Module.wrap(code);
	const dir = dirname(filename);
	let wrapperScript;
	try {
		wrapperScript = new Script(wrapper, extend({
			filename: filename,
			lineOffset: 0,
			columnOffset: 0,
			displayErrors: true,
			timeout: 0,
		}, options));
	} catch (e) {
		console.error('=======================\n%s\n=======================', code)
		throw e;
	}
	
	const newContenxt = extend({iswrapped: true}, global);
	newContenxt.global = newContenxt;
	extend(newContenxt, context);
	const compiledWrapper = wrapperScript.runInNewContext(newContenxt);
	
	const wrapModule = new Module(filename, module);
	const args = [wrapModule.exports, require, wrapModule, filename, dir];
	compiledWrapper.apply(wrapModule.exports, args);
	return wrapModule.exports;
}
