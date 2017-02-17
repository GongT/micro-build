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
	
	public remove(line: string|string[]) {
		if (Array.isArray(line)) {
			line.forEach(this.remove, this);
		} else {
			const exists = this._content.indexOf(line);
			if (exists !== -1) {
				this._content.splice(exists, 1);
			}
		}
	}
	
	public section(start: string, end: string, content: string|string[]) {
		start = '### ' + start.trim();
		end = '### ' + end.trim();
		
		let startLine = this._content.indexOf(start);
		let endLine = this._content.indexOf(end);
		if (startLine === -1) {
			startLine = 0;
			endLine = 0;
		}
		if (endLine <= startLine) {
			const x = startLine;
			startLine = endLine;
			endLine = x;
		}
		if (startLine >= 0 && endLine === -1) {
			throw new Error(`can't parse file ${this.fileName}`);
		}
		if (endLine > startLine) {
			this._content.splice(startLine, endLine - startLine + 1);
		}
		if (this._content[0] !== '') {
			this._content.unshift('');
		}
		
		this._content = [].concat(start, '# DO NOT EDIT THIS BY HAND', content, end, this._content);
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
