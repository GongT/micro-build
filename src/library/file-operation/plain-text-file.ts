import {BaseFile} from "./base-file";

export class PlainTextFile extends BaseFile<string> {
	protected create_default(): string {
		return '';
	}
	
	protected parse_file(content: string): string {
		return content;
	}
	
	protected stringify_file(): string {
		return this._content;
	}
}
