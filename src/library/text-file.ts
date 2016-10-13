import {BaseFile} from "./base-file";

export class TextFile extends BaseFile<string[]> {
	protected create_default(): string[] {
		return [];
	}
	
	protected parse_file(content: string): string[] {
		content = content.trim();
		if (content) {
			return content.split(/\n/g);
		} else {
			return [];
		}
	}
	
	protected stringify_file(): string {
		return this._content.join('\n');
	}
	
	public append(line: string|string[]) {
		if (Array.isArray(line)) {
			line.forEach((l) => {
				this._content.push(l);
			});
		} else {
			this._content.push(line);
		}
	}
	
	public uniqueAppend(line: string|string[]) {
		if (Array.isArray(line)) {
			line.forEach((l) => {
				this.uniqueAppend(l);
			})
		} else if (this._content.indexOf(line) === -1) {
			this.append(line);
		} else if (line === '') {
			this.append('');
		}
	}
	
	hasLine(line: string) {
		return this._content.indexOf(line) !== -1
	}
}
