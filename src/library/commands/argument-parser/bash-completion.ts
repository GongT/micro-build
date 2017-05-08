import {CommandParser} from "./index";
import {ArgumentError, IArgumentCommand, IArgumentOption} from "./base";
import {TEMP_FOLDER_NAME} from "../../paths";

export function createBashCompletion(config: CommandParser);
export function createBashCompletion(config: IArgumentCommand);
export function createBashCompletion(config: IArgumentCommand|CommandParser) {
	let obj: IArgumentCommand;
	if (config instanceof CommandParser) {
		obj = config.getObject();
	} else {
		obj = config;
	}
	let ret = createFunction(obj, '');
	
	ret += `

# end
complete -F _${obj.name} microbuild
`;
	return '# GENERATED FILE, DO NOT MODIFY\n\n' + ret;
}

function createFunction(obj: IArgumentCommand, path: string) {
	let ret = `
function ${path}_${obj.name} {
	local INPUT=$2
	COMPREPLY=( )
	local BASE=1
	
${indent(skipGlobalSwitch(obj))}

${indent(createSwitch(obj))}
}
`;
	
	return ret;
}

function bash_array_value(name: string, index: number|string) {
	return `"\${${name}[${bash_array_index(name, index)}]}"`;
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
function bash_switch(name: string, maps: object) {
	const body = Object.keys(maps).map((k) => {
		return `${k})
${indent(maps[k])}
;;`
	}).join('\n');
	
	return `case ${name} in
${indent(body)}
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
		ret += 'fi\n'
	}
	
	return ret;
}
function bash_argument(s) {
	return JSON.stringify(s);
}
function indent(str: string, length = 1) {
	if (length === 0) {
		return str;
	}
	const ts = length === 1? '\t' : (new Array(length)).fill('\t').join('');
	return ts + str.replace(/\n/g, '\n' + ts);
}
function completion_emit(list: string) {
	return `COMPREPLY+=( $(compgen -W ${bash_argument(list)} -- $\{INPUT}) )`;
}
function completion_emit_file() {
	return `_filedir`;
}

function fullSwitchName(opt: IArgumentOption, type: ''|'same'|'diff'|'space' = ''): string {
	const split = type === 'space'? ' ' : '|';
	return (opt.alias || []).concat(opt.name).map((s) => {
		const isLong = s.length > 1;
		const needSame = type !== 'same' && type !== 'space';
		const needDiff = type !== 'diff';
		
		const base = isLong? '--' + s : '-' + s;
		let name = [];
		if (opt.acceptValue) {
			if (needSame) {
				name.push(`${base}=*`);
			}
			if (needDiff) {
				name.push(base);
			}
		}
		return name.join(split);
	}).filter(e => !!e).join(split);
}
function optionCompletionValue(paramSw: Object, opt: IArgumentOption) {
	let name: string, value: string;
	switch (opt.completion) {
	case 'path':
		name = fullSwitchName(opt, 'diff');
		value = `${completion_emit_file()} ; return 0`;
		paramSw[name] = value;
		break;
	case '':
		return false;
	default:
		throw new ArgumentError('unknown completion option: ' + opt.completion);
	}
}
function skipGlobalSwitch(obj: IArgumentCommand) {
	if (obj.globalOptions.length === 0) {
		return '';
	}
	
	const lastSwitch = {};
	const skipNames = [];
	const skipNames2 = [];
	
	[].concat(obj.options, obj.globalOptions).map((opt) => {
		const names = fullSwitchName(opt);
		if (opt.acceptValue) {
			skipNames2.push(names);
			optionCompletionValue(lastSwitch, opt);
		} else {
			skipNames.push(names);
		}
	});
	const switches = {};
	if (skipNames.length) {
		Object.assign(lastSwitch, {
			[skipNames.join('|')]: `BASE=$((BASE+1))`,
		});
	}
	if (skipNames2.length) {
		Object.assign(lastSwitch, {
			[skipNames2.join('|')]: `BASE=$((BASE+2))`,
		});
	}
	Object.assign(switches, {
		'*': 'break'
	});
	return `{ while true; do
	${bash_switch(bash_array_value('COMP_WORDS', '${BASE}'), switches)}
done }
${bash_switch('${prev}', lastSwitch)}
`;
}
function createSwitch(obj: IArgumentCommand, level: number = 0) {
	let ret = '';
	if (obj.options.length || (obj.globalOptions && obj.globalOptions.length)) {
		const argList = [].concat(
			obj.options,
			obj.globalOptions || []
		).map((opt: IArgumentOption) => {
			return (opt.alias || []).concat(opt.name).map((s) => {
				let ret = s.length > 1? '--' + s : '-' + s;
				if (opt.acceptValue) {
					ret += '=';
				}
				return ret;
			}).join(' ');
		}).join(' ');
		
		ret += bash_if({
			'[ "${INPUT#-}" != "${INPUT}" ]': completion_emit(argList) + '\nreturn 0'
		});
	}
	
	if (obj.subCommands.length) {
		const commandList = [];
		const map = {};
		obj.subCommands.filter((e) => {
			return e.description !== null;
		}).forEach((e) => {
			commandList.push(e.name);
			map[e.name] = createSwitch(e, level + 1);
		});
		
		const options = obj.options.map((opt) => {
			return fullSwitchName(opt, 'space');
		});
		if (options.length) {
			map['-*'] = completion_emit(options.join(' '));
		}
		
		map['*'] = `[ -e "\${PROJECT}/${TEMP_FOLDER_NAME}/completion.sh" ] &&
	source "\${PROJECT}/${TEMP_FOLDER_NAME}/completion.sh" &&
	\${COMPLETEION_FUNCTION_NAME} "$@"
` + completion_emit(commandList.join(' '));
		
		ret += bash_switch(bash_array_value('COMP_WORDS', `$((BASE+${level}))`), map);
	}
	
	if (obj.params.length) {
		// TODO
	}
	
	ret += 'return 0';
	
	return indent(ret, level);
}
