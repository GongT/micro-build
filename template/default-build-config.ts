/// <reference path="./.jsonenv/_current_result.json.d.ts"/>
import {JsonEnv} from "@gongt/jenv-data";
import {ELabelNames, EPlugins, MicroBuildConfig} from "./.micro-build/x/microbuild-config";
import {MicroBuildHelper} from "./.micro-build/x/microbuild-helper";
declare const build: MicroBuildConfig;
declare const helper: MicroBuildHelper;
/*
 +==================================+
 |  **DON'T EDIT ABOVE THIS LINE**  |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

/* Example config file */

const projectName = 'your-project-name';

build.baseImage('node', 'alpine');
build.projectName(projectName);
build.domainName(projectName + '.' + JsonEnv.baseDomainName);

build.isInChina(JsonEnv.gfw.isInChina, JsonEnv.gfw);
build.npmCacheLayer(JsonEnv.gfw.npmRegistry);
build.npmInstall('./package.json');

// build.forwardPort(80, 'tcp'); // .publish(8080);

// build.startupCommand('command other than npm', 'some', 'argument');
// build.shellCommand('/bin/sh', '-c');
// build.stopCommand('stop.sh');

// build.specialLabel(ELabelNames.alias, []);

build.addPlugin(EPlugins.jenv);
// build.disablePlugin(EPlugins.jenv);

/*
 build.addPlugin(EPlugins.node_scss, {
 source: 'public/scss',
 target: 'public/stylesheets',
 });
 build.addPlugin(EPlugins.typescript, {
 source: 'src/tsconfig.json',
 target: 'dist/server',
 });
 */

// build.environmentVariable('AlwaysVar', 'TheValue');
// build.environmentVariable('AutoVar', 'production value', true);
// build.environmentVariable('AutoVar', 'debug value', false);

// build.volume('./host/folder/path', '/mnt/in/container');

// build.prependDockerFile('/path/to/docker/file');
// build.appendDockerFile('/path/to/docker/file');

build.onConfig((isBuild) => {
	const config = helper.createTextFile(`text file content`);
	// config.write('./xxxxx.txt');
});
