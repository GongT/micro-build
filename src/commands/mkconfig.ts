import {readBuildConfig, createBuildTempFiles} from "../build/all";
import update from "./update";
export default function mkconfig(...args) {
	update();
	
	const builder = readBuildConfig();
	
	return createBuildTempFiles(builder);
}
