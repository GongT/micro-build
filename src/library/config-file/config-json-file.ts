import {BaseFile} from "./base-file";

const re = /^\{\s*\n(\s*)/;
export class ConfigJsonFile<T> extends BaseFile<T> {
	private _tab: string;
	
	protected create_default(): T {
		this._tab = '\t';
		return <any>{};
	}
	
	set_tab(t: string) {
		this._tab = t.substr(0, 1);
	}
	
	parse_file(content: string): T {
		const tabcfg = re.exec(content);
		if (tabcfg && tabcfg[1]) {
			this._tab = tabcfg[1];
		} else {
			this._tab = '\t';
		}
		return JSON.parse(content.trim());
	}
	
	stringify_file(): string {
		return JSON.stringify(this._content, null, 1).replace(/^\s+/gm, (sp) => {
				return (new Array(sp.length)).fill(this._tab).join('');
			}).trim();
	}
}
