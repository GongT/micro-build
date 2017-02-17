export function walkValueKey(vars: any, cb: Function, split = '\n') {
	let list;
	if (Array.isArray(vars)) {
		list = vars.map((val, index) => {
			return cb(val, index);
		});
	} else {
		list = Object.keys(vars).map((name) => {
			return cb(vars[name], name);
		});
	}
	list = list.filter((s) => {
		return s !== undefined && s !== null;
	});
	if (list.length) {
		let ret = list.join(split).trim();
		if (split === '\n') {
			ret += split;
		}
		return ret;
	} else {
		return '';
	}
}

export function safeEnvStringInValue(v: any) {
	return safeScriptValue(v).replace(/^"|"$/g, '');
}

export function safeScriptValue(v: any) {
	if (v === false || v === undefined || v === null) {
		return '';
	} else if (v === true) {
		return 'yes';
	} else if (typeof v === 'object') {
		return JSON.stringify(JSON.stringify(v));
	} else {
		return JSON.stringify(v);
	}
}
