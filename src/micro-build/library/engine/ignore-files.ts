import {MemoryTextFile, TextFile} from "@gongt/ts-stl-server/file-operation/text-file";

const START_SIGNAL = 'START MICRO-BUILD SECTION >>>';
const FINISH_SIGNAL = '<<< END MICRO-BUILD SECTION';

export class IgnoreFile {
	protected text: TextFile;
	protected $mainSec: MemoryTextFile;
	
	constructor(filePath: string) {
		this.text = new TextFile(filePath, 'utf8', true);
		this.$mainSec = this.text.section(START_SIGNAL, FINISH_SIGNAL);
		this.$mainSec.replaceContent([]);
	}
	
	register(line: string|string[]) {
		this.$mainSec.uniqueAppend(line);
	}
	
	write() {
		return this.text.write();
	}
}
