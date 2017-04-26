import {fileExists} from "./file-operation/fs";
export function readConfigFile(baseDir: string) {
	
}

export class ConfigFile {
	private exists: boolean;
	
	constructor(protected root: string) {
		this.exists = fileExists(root);
	}
	
}
