import {PathResolver} from "../library/common/paths";
import {ApplicationConfig} from "../library/config/application-config";

const pr: PathResolver = new PathResolver;
export const config = new ApplicationConfig(pr);
