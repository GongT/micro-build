import {existsSync, lstatSync, mkdirSync} from "fs";
import {getProjectPath} from "./file-paths";
import {resolve} from "path";
export interface MicroServiceConfig {
	forwardPort: KeyValueObject<number>;
	volume: KeyValueObject<{
		path: string,
		isFolder: boolean,
	}>;
	command: string[];
	shell: string[];
	port: number[];
	domain: string;
	appendDockerFile: string[];
	prependDockerFile: string[];
	projectName: string;
	plugins: KeyValueObject<any>;
	base: string;
	arguments: KeyValueObject<{
		defaultValue: string,
		runArg: boolean,
		desc?: string,
	}>;
	serviceDependencies: KeyValueObject<string>;
	containerDependencies: KeyValueObject<{imageName: string, runCommandline: string|string[]}>;
	environments: KeyValueObject<string>;
	labels: KeyValueObject<string|Object|any[]>;
	nagLabels: KeyValueObject<string|Object|any[]>;
	install: string[];
}

export enum ELabelNames{
	sync_hosts,
	proxy,
	alias,
}

export enum EPlugins{
	jenv,
	node_scss,
}

export interface KeyValueObject<T> {
	[id: string]: T;
}

export class MicroBuildConfig {
	private storage: MicroServiceConfig = {
		volume: {},
		port: [80],
		forwardPort: {},
		domain: '',
		projectName: '',
		command: ['npm', 'start'],
		shell: ['/bin/sh', '-c'],
		appendDockerFile: [],
		prependDockerFile: [],
		plugins: {},
		base: 'node:latest',
		arguments: {},
		serviceDependencies: {},
		containerDependencies: {},
		environments: {},
		labels: {},
		nagLabels: {},
		install: [],
	};
	
	constructor(data?: any) {
		if (data) {
			this.storage = data;
		}
	}
	
	exposePort(...ports: number[]) {
		this.storage.port = ports;
	}
	
	forwardPort(hostPort: number, mapTo: number) {
		this.storage.forwardPort[hostPort] = mapTo;
	}
	
	baseAlpine(baseImage: string) {
		this.baseImage(baseImage, 'alpine');
	}
	
	baseImage(baseImage: string, version: string = 'latest') {
		this.storage.base = `${baseImage}:${version}`;
	}
	
	projectName(name: string) {
		if (!/[a-z0-9\-_\.]/i.test(name)) {
			throw new Error(`ca't use ${name} as project name.`);
		}
		this.storage.projectName = name;
	}
	
	domainName(name: string) {
		if (!/[a-z0-9\-_\.]/i.test(name)) {
			throw new Error(`ca't use ${name} as project name.`);
		}
		this.storage.domain = name;
	}
	
	startupCommand(...command: string[]) {
		this.storage.command = command;
	}
	
	shellCommand(...shell: string[]) {
		this.storage.shell = shell;
	}
	
	dependService(otherService: string, otherServiceGitUrl?: string) {
		this.storage.serviceDependencies[otherService] = otherServiceGitUrl || null;
	}
	
	dependIsolate(containerName: string, imageName: string, runCommandline: string|string[]) {
		this.storage.containerDependencies[containerName] = {imageName, runCommandline};
	}
	
	prependDockerFile(filePath: string) {
		if (existsSync(filePath)) {
			this.storage.prependDockerFile.push(filePath);
		} else {
			throw new Error(`can't find prepend Dockerfile at ${filePath}`);
		}
	}
	
	appendDockerFile(filePath: string) {
		if (existsSync(filePath)) {
			this.storage.appendDockerFile.push(filePath);
		} else {
			throw new Error(`can't find append Dockerfile at ${filePath}`);
		}
	}
	
	volume(hostFodler: string, imageMountpoint?: string) {
		if (/^\./.test(hostFodler)) {
			hostFodler = resolve(getProjectPath(), hostFodler);
			if (hostFodler.indexOf(getProjectPath()) === 0) {
				if (!existsSync(hostFodler)) { // auto create volume folder if in current project
					mkdirSync(hostFodler);
				}
			}
		}
		if (!existsSync(hostFodler)) {
			throw new Error(`volumn is not exists: ${hostFodler}`);
		}
		this.storage.volume[imageMountpoint || hostFodler] = {
			path: hostFodler,
			isFolder: lstatSync(hostFodler).isDirectory(),
		};
	}
	
	install(packageJsonRelativePath: string) {
		if (this.storage.install.indexOf(packageJsonRelativePath) === -1) {
			if (!/package\.json$/.test(packageJsonRelativePath)) {
				throw new Error('microbuild.install only accept file name `package.json`');
			}
			this.storage.install.push(packageJsonRelativePath);
		}
	}
	
	addPlugin(name: EPlugins, options: any = true) {
		this.storage.plugins[name] = options;
	}
	
	buildArgument(name: string, description: string, defaultValue: string = null) {
		this.storage.arguments[name] = {runArg: false, defaultValue, desc: description};
	}
	
	runArgument(name: string, description: string, defaultValue: string = null) {
		this.storage.arguments[name] = {runArg: true, defaultValue, desc: description};
	}
	
	environmentVariable(name: string, value: string) {
		this.storage.environments[name] = value;
	}
	
	label(name: string, value: any) {
		this.storage.labels[name] = value;
	}
	
	nsgLabel(name: ELabelNames, value: any) {
		this.storage.nagLabels[ELabelNames[name]] = value;
	}
	
	/** getters **/
	toJSON() {
		if (!this.storage.projectName) {
			throw new Error(`project name is not defined in build script`);
		}
		return this.storage;
	}
	
	getDomainBase() {
		return this.storage.domain.replace(this.storage.projectName, '').replace(/^\./, '');
	}
	
	getPlugin(name: EPlugins) {
		return this.storage.plugins[name];
	}
	
	getNsgLabel(name: ELabelNames) {
		return this.storage.nagLabels[name];
	}
}
