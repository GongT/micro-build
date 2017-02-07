import {writeFileSync, readFileSync, existsSync} from "fs";
import {resolve} from "path";
import {getProjectPath} from "../file-paths";
import {MicroBuildConfig} from "../microbuild-config";

export class TextFileHelper {
	private fileContent;
	
	constructor(private build: MicroBuildConfig, content: string = '') {
		this.fileContent = content;
	}
	
	save(path: string) {
		const absPath = resolve(getProjectPath(), path);
		if (!existsSync(absPath) || readFileSync(absPath, 'utf-8') !== this.fileContent) {
			writeFileSync(absPath, this.fileContent, 'utf-8');
		}
		this.build.registerIgnore(path);
	}
}
