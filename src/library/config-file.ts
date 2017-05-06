import {fileExists} from "./file-operation/fs";

export class ConfigFile {
	private exists: boolean;
	
	constructor(protected root: string) {
		this.exists = fileExists(root);
	}
	
	static read() {
	
	}
}
