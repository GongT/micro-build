import {MicroBuildConfig, ELabelNames, EPlugins} from "./x/microbuild-config";
import {JsonEnv} from "../.jsonenv/_current_result.json.d.ts";
declare const build: MicroBuildConfig;
/*
 +==================================+
 | <**DON'T EDIT ABOVE THIS LINE**> |
 | THIS IS A PLAIN JAVASCRIPT FILE  |
 |   NOT A TYPESCRIPT OR ES6 FILE   |
 |    ES6 FEATURES NOT AVAILABLE    |
 +==================================+
 */

const projectName = 'your-project-name';

build.baseImage('node');
build.projectName(projectName);
build.domainName(projectName + '.localdomain');
build.install('./package.json');

// build.forwardPort(80, 'tcp').publish(8080);

// build.startupCommand('command other than npm', 'some', 'argument');
// build.shellCommand('/bin/sh', '-c');
// build.stopCommand('stop.sh');

// build.buildArgument('SOME_ARG', defaultValue);

build.label('microbuild', 'yes');

build.nsgLabel(ELabelNames.alias, []);
// build.nsgLabel(ELabelNames.proxy, 'nginx');

// build.addPlugin(EPlugins.jenv);

/*
 build.addPlugin(EPlugins.node_scss, {
 source: 'public/scss',
 target: 'public/stylesheets',
 });
 */

build.environmentVariable('DEBUG', 'some-tag:*');

// build.volume('/host/folder/path', '/mnt/in/container');

// build.prependDockerFile('/path/to/docker/file');
// build.appendDockerFile('/path/to/docker/file');

