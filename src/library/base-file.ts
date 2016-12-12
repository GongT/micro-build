import {existsSync, readFileSync, writeFileSync} from "fs";

export abstract class BaseFile<ContentType> {
	protected _fileName: string;
	protected _content: ContentType;
	protected _create: boolean;
	protected _exists: boolean;
	private _old_content: string;
	
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
			this._old_content = readFileSync(this._fileName, 'utf-8').trim();
			this._content = this.parse_file(this._old_content);
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
		let content;
		try {
			content = this.stringify_file().trim();
		} catch (e) {
			console.log(this._content);
			throw new Error(`can't stringify file content, file: ${this._fileName}.`);
		}
		if (this._exists && content === this._old_content) {
			return;
		}
		this._old_content = content;
		console.error('wirte to file: %s', this._fileName);
		writeFileSync(this._fileName, content + '\n', 'utf-8');
		this._exists = true;
	}
	
	writeTo(otherFilePath: string) {
		writeFileSync(otherFilePath, this.stringify_file() + '\n', 'utf-8');
	}
	
	get fileName() {
		return this._fileName;
	}
	
	get content(): ContentType {
		return this._content;
	}
}
