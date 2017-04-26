import {existsSync, readFileSync, writeFileSync} from "fs";
import {dirname} from "path";
import {sync as mkdirpSync} from "mkdirp";

export type BufferEncoding = "buffer" | "utf8";

export abstract class BaseFile<ContentType> {
	protected _fileName: string;
	protected _content: ContentType;
	protected _create: boolean;
	protected _exists: boolean;
	protected _charset: string;
	private _old_content: string;
	
	protected abstract create_default(): ContentType;
	
	protected abstract parse_file(content: string): ContentType;
	
	protected abstract stringify_file(): string;
	
	constructor(fileName: string);
	constructor(fileName: string, charset: BufferEncoding, create: boolean);
	constructor(fileName: string, charset: BufferEncoding);
	constructor(fileName: string, create: boolean);
	constructor(fileName: string, charset: BufferEncoding|boolean = 'utf8', create: boolean = false) {
		this._fileName = fileName;
		if (typeof charset === 'boolean') {
			create = charset;
			charset = 'utf8';
		}
		
		this._create = create;
		this._charset = charset;
		this.reload();
	}
	
	reload() {
		if (existsSync(this._fileName)) {
			this._old_content = readFileSync(this._fileName, this._charset);
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
		console.error('\x1B[2msaving file %s...\x1B[0m', this._fileName);
		let content;
		try {
			content = this.stringify_file();
		} catch (e) {
			console.error(this._content);
			throw new Error(`can't stringify file content, file: ${this._fileName}.`);
		}
		
		if (this._exists && content === this._old_content) {
			return false;
		}
		
		this._old_content = content;
		
		if (!existsSync(dirname(this._fileName))) {
			console.error('  mkdir: %s', dirname(this._fileName));
			mkdirpSync(dirname(this._fileName));
		}
		
		console.error('  write to file: %s', this._fileName);
		writeFileSync(this._fileName, content, this._charset);
		this._exists = true;
		return true;
	}
	
	writeTo(otherFilePath: string) {
		writeFileSync(otherFilePath, this.stringify_file(), 'utf-8');
	}
	
	replaceContent(content: ContentType) {
		this._content = content;
	}
	
	get fileName() {
		return this._fileName;
	}
	
	get content(): ContentType {
		return this._content;
	}
}
