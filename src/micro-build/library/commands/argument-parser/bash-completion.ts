import {TEMP_FOLDER_REL} from "../../common/paths";
import {ArgumentError, IArgumentCommand, IArgumentOption} from "./base";
import {CommandParser} from "./index";

export function createBashCompletion(config: CommandParser);
export function createBashCompletion(config: IArgumentCommand);
export function createBashCompletion(config: IArgumentCommand|CommandParser) {
	let obj: IArgumentCommand;
	if (config instanceof CommandParser) {
		obj = config.getObject();
	} else {
		obj = config;
	}
	let ret = ['# GENERATED FILE, DO NOT MODIFY\n'];
	
	ret.push(createFunction(obj, '', `
_mc_debug ""
COMPREPLY=( )
local cur prev words cword
_get_comp_words_by_ref -n : cur prev words cword
_mc_debug -e "\\ecprev=\${prev}, words=\${words}, cword=\${cword},"
local BASE=1
`));
	ret.push(bash_function('_mc_debug', '[ -n "${PTS}" ] && echo "$@" > /dev/pts/${PTS}'));
	ret.push(bash_function('_mc_debug_set', 'export PTS="${PTS_ID}"', ['PTS_ID']));
	ret.push('');
	ret.push('# end');
	ret.push(`complete -F _${obj.name} microbuild`);
	
	return ret.join('\n');
}

function createFunction(obj: IArgumentCommand, path: string, prepare: string = '') {
	return bash_function(`${path}_${obj.name}`, `
_mc_debug "call \\\`${path}_${obj.name}\\\` with: '$1' '$2' '$3' '$4'"
${prepare? '\n' + prepare.trim() + '\n\n' : ''}# option supports
${skipOptionFunctions()}

# main body
${createSwitch(obj)}
`, ['CMD', 'INPUT']);
}

function bash_array_value(name: string, index: number|string) {
	if (name === '@') {
		return `\${${index}}`
	} else {
		return `"\${${name}[${bash_array_index(name, index)}]}"`;
	}
}
function bash_array_index(name: string, index: number|string) {
	if (typeof index === 'string') {
		return index;
	} else if (!index) {
		return '0';
	} else if (index > 0) {
		return index;
	} else if (index < 0) {
		return `\${#${name}[@]}${index}`;
	} else {
		throw TypeError('unknown from: ' + index);
	}
}

function bash_array_slice(name: string, from?: number, length?: number) {
	return `\${${name}[@]:${bash_array_index(name, from)}:${length || ''}`;
}
function bash_array_shift(name: string) {
	return `\${${name}[0]} ; ${name}=${bash_array_slice(name, 1, null)}`
}
function bash_function(name: string, body: string, args: string[] = []) {
	if (args.length) {
		body = args.map((n, i) => `local ${n}=${bash_array_value('@', i + 1)}`).join('\n') + '\n' + body;
	}
	
	body = body.trim();
	return `function ${name} { # ${args.join(', ')}
${body? indent(body) : ';'}
}`
}
function bash_range(from: number, to: number, step = 1) {
	return `{${from}..${to}..${step}}`
}
function bash_for(varName: string, condition: string, body: string) {
	return `local ${varName}; for ${varName} in ${condition} ; do
${indent(body.trim())}
done`
}
function bash_while(condition: string, body: string) {
	return `while ${condition} ; do
${indent(body.trim())}
done`
}
function bash_switch(name: string, maps: object, brk = true) {
	const prepend = brk? '' : ' while false ; do';
	const append = brk? ';;' : 'done ;&';
	const body = Object.keys(maps).map((k) => {
		return `${k}) _mc_debug "  case ${k}"; ${prepend}
${indent(maps[k].trim())}
${append}`
	}).join('\n');
	
	return `_mc_debug switch ${name.replace(/\$/g, '\\$')} = \\"${name}\\"
case ${name} in
${body}
esac`
}
function bash_if(maps: object) {
	const ks = Object.keys(maps);
	if (ks.length === 0) {
		return '';
	}
	let ret = '';
	ret += ks.map((key) => {
		return `if ${key} ; then
${indent(maps[key] || "echo empty here.")}
`
	}).join('el');
	
	if (ret) {
		ret += 'fi'
	}
	
	return ret;
}
function bash_argument(s) {
	return JSON.stringify(s);
}
function START_WITH(varName) {
	return `[ "\${${varName}#-}" != "\${${varName}}" ]`;
}
function indent(str: string, length = 1) {
	if (length === 0) {
		return str;
	}
	const ts = length === 1? '\t' : (new Array(length)).fill('\t').join('');
	return ts + str.replace(/\n/g, '\n' + ts);
}
function completion_emit(list: string) {
	return `COMPREPLY+=( $(compgen -W ${bash_argument(list)} -- $\{INPUT}) )
_mc_debug "COMPREPLY += ${bash_argument(list)}"`;
}
function completion_emit_file() {
	return `_filedir`;
}

enum SWITCH_TYPE {
	SHORT = 1,
	LONG = 2,
	SHO_LON = SHORT + LONG,
	
	COMBINE = 4,
	SPLIT = 8,
	COM_SPL = COMBINE + SPLIT,
	
	ALL = SHO_LON + COM_SPL,
}

function fullSwitchName(opt: IArgumentOption, type: SWITCH_TYPE): string[] {
	const ret = [];
	(opt.alias || []).concat(opt.name).forEach((s) => {
		const isLong = s.length > 1;
		const needShort = !!(SWITCH_TYPE.SHORT & type);
		const needLong = !!(SWITCH_TYPE.LONG & type);
		const needCombine = !!(SWITCH_TYPE.COMBINE & type);
		const needSplit = !!(SWITCH_TYPE.SPLIT & type);
		
		if ((isLong && !needLong) || (!isLong && !needShort)) {
			return;
		}
		
		const base = isLong? '--' + s : '-' + s;
		if (opt.acceptValue) {
			if (needCombine) {
				ret.push(`${base}=*`);
			}
			if (needSplit) {
				ret.push(base);
			}
		}
	});
	// const x = (new Error).stack.split('\n').slice(2, 3)[0].trim().replace(/.*\((.+)\).*/, '$1');
	// console.log('%s\n%s\n', x, ret);
	return ret;
}
function optionCompletionValue(paramSw: Object, opt: IArgumentOption) {
	let name: string, value: string;
	switch (opt.completion) {
	case 'path':
		name = fullSwitchName(opt, SWITCH_TYPE.SHO_LON + SWITCH_TYPE.SPLIT).join('|');
		value = `${completion_emit_file()} ; return 0`;
		paramSw[name] = value;
		break;
	case '':
		return false;
	default:
		throw new ArgumentError('unknown completion option: ' + opt.completion);
	}
}
function skipOptionFunctions(): string {
	const ret = [];
	const fnBodySwitch = bash_switch(bash_array_value('COMP_WORDS', '${BASE}'), {
		'--*': 'BASE=$((BASE + 2))',
		'-*': 'BASE=$((BASE + 2))',
		'*': 'break',
	});
	ret.push(bash_for('i', bash_range(1, 50), fnBodySwitch));
	ret.push(bash_if({
		'[ "${BASE}" -gt "${#COMP_WORDS[@]}" ]': 'return 0',
	}));
	/*fnBody.push(bash_if({ // TODO
	 [START_WITH('INPUT')]: `# start with -
	 ${completion_emit(argList)}
	 return 0`
	 }));*/
	
	return ret.join('\n')
}

function skipSwitches(obj: IArgumentCommand): string {
	if (obj.globalOptions.length === 0) {
		return '';
	}
	
	const ret = [];
	const lastSwitch = {};
	const skipNames = [];
	const skipNames2 = [];
	
	[].concat(obj.options, obj.globalOptions).map((opt) => {
		if (opt.acceptValue) {
			optionCompletionValue(lastSwitch, opt);
		}
		
		let names = fullSwitchName(opt, SWITCH_TYPE.COMBINE + SWITCH_TYPE.SHO_LON);
		merge(skipNames, names);
		
		names = fullSwitchName(opt, SWITCH_TYPE.SPLIT + SWITCH_TYPE.SHO_LON);
		merge(skipNames2, names);
	});
	
	if (Object.keys(lastSwitch).length > 0) {
		ret.push(bash_switch('${prev}', lastSwitch));
	}
	
	if (skipNames.length + skipNames2.length > 0) {
		const switches = {};
		if (skipNames.length) {
			Object.assign(switches, {
				[skipNames.join('|')]: `BASE=$((BASE+1))`,
			});
		}
		if (skipNames2.length) {
			Object.assign(switches, {
				[skipNames2.join('|')]: `BASE=$((BASE+2))`,
			});
		}
		Object.assign(switches, {
			'*': 'break',
		});
	} else {
		ret.push(`# TODO`);
	}
	return ret.join('\n');
}
function createSwitch(obj: IArgumentCommand, levels: string[] = []): string {
	let ret = [`# command level ${levels.length}`];
	ret.push(`_mc_debug level ${levels.length}`);
	// ret.push(skipSwitches(obj));
	
	if (obj.options.length || (obj.globalOptions && obj.globalOptions.length)) {
		const argList = [].concat(
			obj.options,
			obj.globalOptions || [],
		).map((opt: IArgumentOption) => {
			return (opt.alias || []).concat(opt.name).map((s) => {
				let ret = s.length > 1? '--' + s : '-' + s;
				if (opt.acceptValue) {
					ret += '=';
				}
				return ret;
			}).join(' ');
		}).join(' ');
	}
	
	if (obj.subCommands.length) {
		const commandList = [];
		const map = {};
		obj.subCommands.filter((e) => {
			return e.description !== null;
		}).forEach((e) => {
			commandList.push(e.name);
			const nextFuncName = '_' + (levels.length? `${levels.join('_')}_` : '') + e.name;
			map[e.name] = `
local next_func=${nextFuncName}
declare -F $next_func >/dev/null && $next_func`;
		});
		
		const options = [];
		obj.options.forEach((opt) => {
			const items = fullSwitchName(opt, SWITCH_TYPE.ALL);
			merge(options, items);
		});
		if (options.length) {
			map['-*'] = completion_emit(options.join(' '));
		}
		
		map['*'] = `[ -e "\${PROJECT}/${TEMP_FOLDER_REL}/completion.sh" ] &&
	source "\${PROJECT}/${TEMP_FOLDER_REL}/completion.sh" &&
	\${COMPLETEION_FUNCTION_NAME} "$@"
	${completion_emit(commandList.join(' '))}`;
		
		ret.push(bash_switch(bash_array_value('COMP_WORDS', `$BASE`), map));
	}
	
	if (obj.params.length) {
		// TODO
	}
	
	/*if (level > 0) {
	 ret.push('break');
	 } else {
	 ret.push('return 0');
	 }*/
	
	return ret.join('\n');
}

function merge(a1, a2) {
	a2.forEach((e) => {
		a1.push(e);
	});
}
