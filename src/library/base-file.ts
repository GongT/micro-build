import {existsSync, readFileSync, writeFileSync} from "fs";

export abstract class BaseFile<ContentType> {
	protected _fileName: string;
	protected _content: ContentType;
	protected _create: boolean;
	protected _exists: boolean;
	
	protected abstract create_default(): ContentType;
	
	protected abstract parse_file(content: string): ContentType;
	
	protected abstract stringify_file(): string;
	
	constructor(fileName: string, create = false) {
		this._fileName = fileName;
		this._create = create;
		this.reload();
	}
	
	reload() {
		if (existsSync(this._fileName)) {
			const content = readFileSync(this._fileName, 'utf-8').trim();
			this._content = this.parse_file(content);
			this._exists = true;
		} else {
			if (!this._create) {
				throw new Error(`file not exists: ${this._fileName}`);
			}
			this._exists = false;
			this._content = this.create_default();
		}
	}
	
	exists() {
		return this._exists;
	}
	
	write() {
		writeFileSync(this._fileName, this.stringify_file() + '\n', 'utf-8');
		this._exists = true;
	}
	
	get content(): ContentType {
		return this._content;
	}
}
