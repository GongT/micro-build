import {readBuildConfig, createBuildTempFiles} from "../build/all";
export default function mkconfig(...args) {
	const builder = readBuildConfig();
	
	return createBuildTempFiles(builder);
}
