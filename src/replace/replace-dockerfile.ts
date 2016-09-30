import {resolve} from "path";
import {TemplateRender} from "./base";
import {CustomInstructions} from "./instructions-dockerfile";

const templateDir = resolve(__dirname, '../../template/Dockerfile');

export function renderTemplate(fileName: string, ins: CustomInstructions) {
	const renderObject = new TemplateRender(resolve(templateDir, fileName));
	return renderObject.render(ins);
}
export function renderFile(fileName: string, ins: CustomInstructions) {
	const renderObject = new TemplateRender(fileName);
	return renderObject.render(ins);
}
