export interface MyCallback<Argument> {
	(param?: Argument): void|undefined|boolean;
}
export class CallbackList<Argument> {
	protected list: MyCallback<Argument>[] = [];
	
	add(...items: MyCallback<Argument>[]) {
		return this.list.push(...items);
	}
	
	remove(...items: MyCallback<Argument>[]) {
		items.forEach((item) => {
			const found = this.list.indexOf(item);
			if (found !== -1) {
				return this.list.splice(found, 1);
			}
		});
	}
	
	run(argument: Argument) {
		return this.list.some((cb) => {
			const ret = cb(argument);
			return ret === undefined? true : !!ret;
		});
	}
}
