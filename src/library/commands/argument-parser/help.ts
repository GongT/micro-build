import {ArgumentError, IArgumentCommand, IArgumentOption, IArgumentParam} from "./base";
import {CommandParser} from "./index";
import {die, exit} from "../../../bin/bin";
const stringWidth = require('string-width');

const isOption = /^-/;

export class UsageHelper {
	private obj: IArgumentCommand;
	
	constructor(obj: CommandParser);
	constructor(obj: IArgumentCommand);
	constructor(obj: IArgumentCommand|CommandParser) {
		if (obj instanceof CommandParser) {
			this.obj = obj.getObject();
		} else {
			this.obj = obj;
		}
	}
	
	getString() {
		const obj = this.obj;
		const parts = [`Usage:\n\t${obj.$0 + ' '}${this.getUsageLine()} `];
		
		if (obj.subCommands.length) {
			parts.push(`Available Commands:\n${this.getCommandLines()}`);
		}
		parts.push(`Description:\n  ${obj.description || obj.descriptionFull}`);
		
		if (obj.options.length || (obj.globalOptions && obj.globalOptions.length)) {
			parts.push(`Options:\n${this.getOptionsLines()}`);
		}
		
		if (obj.params.length) {
			parts.push(`Params:\n${this.getParamsLines()}`);
		}
		
		if (obj.subCommands.length) {
			parts.push(`use \`${this.insertHelp(obj.$0? obj.$0 + ' ' + obj.name : obj.name)} [command]' check usage for sub command.`);
		}
		
		return parts.join('\n\n');
	}
	
	private insertHelp(str: string) {
		return str.replace(/^(\S+)(\s|$)/, '$1 --help$2');
	}
	
	private getParamsLines() {
		const options = this.obj.params.map((opt: IArgumentParam) => {
			return [opt.name, opt.description];
		});
		return formatColumn(options);
	}
	
	private getOptionsLines() {
		const options = [].concat(
			this.obj.options,
			this.obj.globalOptions || []
		).map((opt: IArgumentOption) => {
			return ['--' + opt.name, opt.description];
		});
		return formatColumn(options);
	}
	
	private getCommandLines() {
		return formatColumn(this.obj.subCommands.filter((e) => {
			return e.description !== null;
		}).map((e) => {
			return [
				(new UsageHelper(e)).getUsageLine(),
				e.description,
			];
		}));
	}
	
	private getUsageLine(name: boolean = true) {
		const obj = this.obj;
		const columns = process.stdout['columns'] || Infinity;
		
		let usage = name? `${obj.name}` : '';
		
		if (obj.globalOptions && obj.globalOptions.length) {
			obj.globalOptions.forEach((e) => {
				const long = e.name.length > 1;
				const name = long? `--${e.name}` : `-${e.name}`;
				if (e.acceptValue) {
					if (e.defaultValue) {
						usage += ` [${name}]`;
					} else {
						usage += ` <${name}${long? '=' : ' '}value>`;
					}
				} else {
					usage += ` [${name}]`;
				}
			})
		}
		
		if (obj.subCommands.length) {
			usage += ' <command>';
		}
		
		if (obj.params.length) {
			usage += obj.params.map((e) => {
				if (e.isRequired) {
					return ` <${e.name}>`
				} else {
					return ` [${e.name}]`
				}
			}).join('')
		}
		
		return usage.trim();
	}
	
	print(exitCode: number) {
		if (exitCode === 0) {
			console.log(this.getString() + '\n');
		} else {
			console.error(this.getString() + '\n');
		}
		exit(exitCode);
	}
	
	error(e: ArgumentError) {
		let self: UsageHelper = this;
		if (e.helpObject) {
			self = new UsageHelper(e.helpObject);
		}
		die('%s\n\n\x1B[38;5;9mError:\n\t%s\x1B[0m\n', self.getString(), e.message);
	}
}

function formatColumn(aoa: string[][]) {
	let ret = [];
	const terminal = terminalWidth();
	const left = Math.round(terminal / 4);
	
	aoa.forEach(([usageStr, desc]) => {
		const usage = '    ' + usageStr + '';
		let line = usage;
		
		if (terminal > 30) {
			/*
			 * |  xxxxx  blablabl|
			 * |         ablablab|
			 * |         labla.  |
			 */
			const usageWidth = stringWidth(usage);
			// console.log('usageWidth = ', usageWidth);
			// console.log('descWidth = ', stringWidth(desc));
			// console.log('|%s|', line);
			if (left - usageWidth > 0) {
				// console.log('%s - %s > 0', left, usageWidth);
				line += createPad(left - usageWidth);
				// console.log('|%s|', line);
				line += positionStringPack(desc, left, 0);
			} else {
				// console.log('%s - %s < 0', left, usageWidth);
				line += '\n' + createPad(left);
				// console.log('|%s|', line);
				line += positionStringPack(desc, left, 0);
			}
		} else {
			/*
			 * | xxxxx:    |
			 * |   blablabl|
			 * | ablablabla|
			 * | bla.      |
			 */
			// console.log('-----------',ret)
			line += '\n      ' + desc;
		}
		
		ret.push(line);
	});
	
	return ret.join('\n');
}

function terminalWidth() {
	return parseInt(process.stdout['columns']);
}

function positionStringPack(string, left = 4, right = 0) {
	const columns = terminalWidth();
	if (!columns) {
		return string;
	}
	if (columns < left + right + 10) {
		if (columns < left + 10) {
			return string;
		} else {
			right = 0;
		}
	}
	
	const padleft = createPad(left);
	
	return packingString(string, columns - left - right).join('\n' + padleft).trim();
}

function createPad(width) {
	return (new Array(width)).fill(' ').join('');
}

function packingString(str: string, column: number) {
	if (!column || isNaN(column) || column < 0) {
		return [str];
	}
	// const guess = Math.floor(stringWidth(str) / column);
	let ret: string[] = [];
	while (str.length > 0) {
		let strLength = column; // stringWidth(str{column}) >= column
		let currentWidth: number = stringWidth(str.substr(0, strLength));
		// console.log('->init: %s(%s)', str.substr(0, strLength), currentWidth)
		
		while (currentWidth > column) {
			const delta = Math.ceil((currentWidth - column) / 2);
			strLength -= delta;
			currentWidth -= stringWidth(str.substr(strLength, delta));
			// console.log('result strLength=%s, delta=%s... [%s] %s(%s)',
			// 	strLength, delta,
			// 	str[strLength],
			// 	str.substr(strLength, delta), stringWidth(str.substr(strLength, delta)));
			// console.log('->part:', str.substr(0, strLength));
		}
		// console.log('-- commit', str.substr(0, strLength))
		ret.push(str.substr(0, strLength));
		str = str.substr(strLength);
	}
	
	return ret;
}
