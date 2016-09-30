import {resolve} from "path";
import {TemplateRender} from "./base";
import {ScriptVariables} from "./instructions-scripts";

const templateDir = resolve(__dirname, '../../template/control-bin');

export function renderTemplate(type: string, fileName: string, ins: ScriptVariables) {
	const renderObject = new TemplateRender(resolve(templateDir, type, fileName));
	return renderObject.render(ins);
}
export function renderFile(fileName: string, ins: ScriptVariables) {
	const renderObject = new TemplateRender(fileName);
	return renderObject.render(ins);
}
