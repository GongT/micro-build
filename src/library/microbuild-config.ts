import {existsSync, lstatSync, mkdirSync} from "fs";
import {getProjectPath} from "./file-paths";
import {resolve} from "path";
import {determineDockerInterfaceIpAddress} from "./determine-docker-interface-ip-address";
export interface MicroServiceConfig {
	forwardPort: {
		host: number,
		client: number,
		method: string,
	}[];
	volume: KeyValueObject<{
		path: string,
		isFolder: boolean,
	}>;
	command: string[];
	shell: string[];
	debugStartCommand: string[];
	reloadCommand: string[];
	stopCommand: string[];
	domain: string;
	appendDockerFile: string[];
	prependDockerFile: string[];
	projectName: string;
	plugins: any[];
	base: string;
	dockerRunArguments: string[];
	arguments: KeyValueObject<{
		name: string,
		defaultValue: string,
		runArg: boolean,
		desc?: string,
	}>;
	serviceDependencies: KeyValueObject<string>;
	containerDependencies: KeyValueObject<{imageName: string, runCommandline: string|string[]}>;
	environments: {
		insideOnly: boolean;
		name: string;
		value: string;
		append: boolean | string;
	}[];
	labels: KeyValueObject<string|Object|any[]>;
	specialLabels: KeyValueObject<string|Object|any[]>;
	install: string[];
	networking: {
		hostIp: string;
		hostIp6: string;
		bridge: boolean;
		ifName: string;
	};
}

export enum ELabelNames{
	sync_hosts,
	proxy,
	alias,
}

export enum EPlugins{
	jenv,
	node_scss,
	typescript,
	browserify,
}

export interface KeyValueObject<T> {
	[id: string]: T;
}

export class MicroBuildConfig {
	private storage: MicroServiceConfig = {
		volume: {},
		forwardPort: [],
		stopCommand: ['echo', 'no stop command.'],
		reloadCommand: [],
		debugStartCommand: [],
		domain: '',
		projectName: '',
		command: ['npm', 'start'],
		shell: ['/bin/sh', '-c'],
		appendDockerFile: [],
		prependDockerFile: [],
		plugins: [],
		base: 'node:latest',
		dockerRunArguments: [],
		arguments: {},
		serviceDependencies: {},
		containerDependencies: {},
		environments: [],
		labels: {},
		specialLabels: {},
		install: [],
		networking: {
			hostIp: '',
			hostIp6: '',
			bridge: true,
			ifName: 'docker0',
		},
	};
	
	constructor(data?: any) {
		if (data) {
			this.storage = data;
		}
	}
	
	netInterface(ifName: string) {
		this.storage.networking.hostIp = '';
		this.storage.networking.hostIp6 = '';
		if (ifName === 'host') {
			this.storage.networking.ifName = 'lo';
			this.storage.networking.bridge = false;
		} else {
			this.storage.networking.ifName = ifName;
			this.storage.networking.bridge = true;
		}
	}
	
	netAddress(ipaddr: string, ipaddr6?: string) {
		this.storage.networking.ifName = '';
		this.storage.networking.bridge = true;
		this.storage.networking.hostIp = ipaddr;
		this.storage.networking.hostIp6 = ipaddr6;
	}
	
	forwardPort(clientPort: number, method?: string) {
		const obj = {
			host: null,
			client: clientPort,
			method: method || '',
		};
		
		this.storage.forwardPort.push(obj);
		return {
			publish(hostPort: number){
				obj.host = hostPort;
			}
		}
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
	
	stopCommand(...stop: string[]) {
		this.storage.stopCommand = stop;
	}
	
	reloadCommand(...command: string[]) {
		this.storage.reloadCommand = command;
	}
	
	debugCommand(...command: string[]) {
		this.storage.debugStartCommand = command;
	}
	
	dependService(otherService: string, otherServiceGitUrl?: string) {
		this.storage.serviceDependencies[otherService] = otherServiceGitUrl || null;
	}
	
	dependIsolate(containerName: string, imageName: string = '', runCommandline: string|string[] = '') {
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
	
	volume(hostFodler: string, imageMountpoint: string = '') {
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
		if (imageMountpoint) {
			if (!/^\//.test(imageMountpoint)) {
				imageMountpoint = resolve('/data', imageMountpoint);
			}
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
		this.storage.plugins.push({options, name});
	}
	
	buildArgument(name: string, description: string, defaultValue: string = null) {
		const dockerfile_name = name.replace(/-/g, '_');
		this.storage.arguments[name] = {name: dockerfile_name, runArg: false, defaultValue, desc: description};
	}
	
	dockerRunArgument(...args: string[]) {
		this.storage.dockerRunArguments = args;
	}
	
	runArgument(name: string, description: string, defaultValue: string = null) {
		const dockerfile_name = name.replace(/-/g, '_');
		this.storage.arguments[name] = {name: dockerfile_name, runArg: true, defaultValue, desc: description};
	}
	
	/**
	 * insideOnly:
	 *      default: always
	 *      true: only in docker
	 *      false: only debug
	 **/
	environmentVariable(name: string, value: string, insideOnly = null) {
		this.storage.environments.push({
			name, value, insideOnly, append: false
		});
	}
	
	environmentVariableAppend(name: string, value: string, insideOnly = null, sp?: string) {
		this.storage.environments.push({
			name, value, insideOnly, append: sp || true
		});
	}
	
	label(name: string, value: any) {
		this.storage.labels[name] = value;
	}
	
	specialLabel(name: ELabelNames, value: any) {
		this.storage.specialLabels[name] = value;
	}
	
	/** @deprecated */
	nsgLabel(name: ELabelNames, value: any) {
		this.storage.specialLabels[name] = value;
	}
	
	/** getters **/
	toJSON(): MicroServiceConfig {
		if (!this.storage.projectName) {
			throw new Error(`project name is not defined in build script`);
		}
		return this.storage;
	}
	
	getDomainBase() {
		return this.storage.domain.replace(this.storage.projectName, '').replace(/^\./, '');
	}
	
	getPlugin(name: EPlugins): any {
		return this.getPluginList(name).pop();
	}
	
	getPluginList(name: EPlugins): any[] {
		return this.storage.plugins.filter((opt) => {
			return opt.name === name;
		});
	}
	
	getSpecialLabel(name: ELabelNames) {
		return this.storage.specialLabels[name];
	}
	
	getSpecialLabelList(): KeyValueObject<any> {
		const ret = {};
		Object.keys(this.storage.specialLabels).forEach((n) => {
			ret[ELabelNames[n]] = this.storage.specialLabels[n];
		});
		
		return ret;
	}
	
	private normalizeNetworking() {
		const nw = this.storage.networking;
		if (!nw.hostIp) {
			const ip = determineDockerInterfaceIpAddress();
			nw.hostIp = ip[0];
			nw.hostIp6 = ip[1];
			console.log('get host ip-addr= %s ; %s', nw.hostIp, nw.hostIp6);
		}
	}
	
	getNetworkTypeArg() {
		this.normalizeNetworking();
		
		const nw = this.storage.networking;
		const ret = [];
		ret.push(`--net=${nw.bridge? 'bridge' : 'host'}`);
		ret.push(`--add-host=host-lo:${nw.hostIp}`);
		return ret;
	}
	
	getNetworkConfig() {
		this.normalizeNetworking();
		
		const nw = this.storage.networking;
		const ret = {
			HOST_LOOP_IP: nw.hostIp,
			HOST_LOOP_IP6: undefined,
		};
		if (nw.hostIp6) {
			ret.HOST_LOOP_IP6 = nw.hostIp;
		}
		return ret;
	}
}
