import {IArgument, IArgumentCommand, IArgumentOption, IArgumentParam} from "./base";
import {ArgumentStore, SubCommandParser} from "./index";
export abstract class HelperBase<Z extends IArgument> {
	protected object: Z;
	protected parent: ArgumentStore;
	
	constructor(object: Z, parent: ArgumentStore) {
		this.object = object;
		this.parent = parent;
	}
	
	finish(): SubCommandParser {
		if (!this.parent) {
			throw TypeError('nothing to finish().');
		}
		return <any> this.parent;
	}
	
	description(description) {
		this.object.description = description;
		return this;
	}
	
	defaultValue(defaultValue: string|boolean) {
		this.object.defaultValue = <any> defaultValue;
		return this;
	}
	
	getObject(): Z {
		return this.object;
	}
}

export class OptionHelper extends HelperBase<IArgumentOption> {
	constructor(object: IArgumentOption, parent: ArgumentStore) {
		super(object, parent);
		parent.getObject().options.push(object);
	}
	
	multiple(multiple = true) {
		this.object.multipleTimes = multiple;
		return this;
	}
	
	aliases(...aliases: string[]) {
		this.object.alias = aliases;
		return this;
	}
	
	acceptValue(acceptValue = true) {
		this.object.acceptValue = acceptValue;
		return this;
	}
	
	notAcceptValue() {
		this.object.acceptValue = false;
		return this;
	}
}

export class ParamHelper extends HelperBase<IArgumentParam> {
	constructor(object: IArgumentParam, parent: ArgumentStore) {
		if (object.name.indexOf('...') === 0) {
			object.variable_length = true;
		}
		super(object, parent);
		object.placement = parent.getObject().params.push(object);
	}
	
	variableLength(multiple = true) {
		this.object.variable_length = multiple;
		return this;
	}
	
	required(required: boolean = true) {
		this.object.isRequired = required;
		return this;
	}
}

export abstract class CommandHelper extends HelperBase<IArgumentCommand> {
	constructor(object: IArgumentCommand, parent: ArgumentStore) {
		super(object, parent);
		this.object.options = [];
		this.object.subCommands = [];
		this.object.params = [];
		if (parent) {
			this.object.globalOptions = parent.object.globalOptions;
			parent.object.subCommands.push(this.object);
			if (parent.object.$0) {
				this.object.$0 = parent.object.$0 + ' ' + parent.object.name;
			} else if (parent.object.name) {
				this.object.$0 = parent.object.name;
			} else {
				throw new TypeError('parent object no name: ' + JSON.stringify(parent));
			}
		} else {
			this.object.$0 = '';
		}
	}
}
