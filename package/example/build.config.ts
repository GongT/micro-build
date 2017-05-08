import {ConfigFile} from "@gongt/micro-build/config-file";
import {IgnorePlugin} from "@gongt/micro-build/plugins/ignore";

declare const JsonEnv: any;

const build = new ConfigFile();
export default build;

build.setProjectName('the project');
build.setBaseDomain(JsonEnv.BaseDomain);

build.registerPlugin(new IgnorePlugin({}));

