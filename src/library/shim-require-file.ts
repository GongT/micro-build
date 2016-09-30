import {Script} from "vm";
import * as assert from "assert";
const extend = require("util")._extend;

export function run_script(code: string, filename: string, context: any, options?: {}) {
	const Module = require("module");
	const wrapper = Module.wrap(code);
	const wrapperScript = new Script(wrapper, extend({
		filename: filename,
		lineOffset: 0,
		columnOffset: 0,
		displayErrors: true,
		timeout: 0,
	}, options));
	
	const newContenxt = extend({iswrapped: true}, global);
	newContenxt.global = newContenxt;
	extend(newContenxt, context);
	const compiledWrapper = wrapperScript.runInNewContext(newContenxt);
	
	const wrapModule = new Module(filename, module);
	const path = require('path');
	const dirname = path.dirname(filename);
	const _require = function (path) {
		assert(path, 'missing path');
		assert(typeof path === 'string', 'path must be a string');
		
		return Module._load(path, wrapModule, false);
	};
	const args = [wrapModule.exports, _require, wrapModule, filename, dirname];
	compiledWrapper.apply(wrapModule.exports, args);
	return wrapModule.exports;
}
