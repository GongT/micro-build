import {existsSync, readFileSync, writeFileSync} from "fs";
import {sync as mkdirpSync} from "mkdirp";
import {dirname, resolve} from "path";
import {getProjectPath} from "../common/file-paths";
import {MicroBuildConfig} from "../microbuild-config";

export class TextFileHelper {
	private fileContent;
	
	constructor(private build: MicroBuildConfig, content: string = '') {
		this.fileContent = content;
	}
	
	save(path: string) {
		const absPath = resolve(getProjectPath(), path);
		if (!existsSync(absPath) || readFileSync(absPath, {encoding: 'utf8'}) !== this.fileContent) {
			if (!existsSync(dirname(absPath))) {
				mkdirpSync(dirname(absPath));
			}
			writeFileSync(absPath, this.fileContent, {encoding: 'utf8'});
		}
		this.build.registerIgnore(path);
	}
}
