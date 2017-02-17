import {resolve} from "path";
import {TemplateRender} from "./base";
import {ScriptVariables} from "./instructions-scripts";
import {MicroBuildRoot} from "../library/common/file-paths";

const templateDir = resolve(MicroBuildRoot, 'template/control-bin');

export function renderTemplateScripts(type: string, fileName: string, ins: ScriptVariables) {
	const renderObject = new TemplateRender(resolve(templateDir, type, fileName));
	return renderObject.render(ins);
}
export function renderFile(fileName: string, ins: ScriptVariables) {
	const renderObject = new TemplateRender(fileName);
	return renderObject.render(ins);
}
