import {existsSync, lstatSync, mkdirSync} from "fs";
import {resolve} from "path";
import {isDockerMode} from "./common/runenv";
import {getProjectPath} from "./common/file-paths";

export interface NpmRegistry {
	url: string;
	user?: string;
	pass?: string;
	email?: string;
	scope?: string;
	upstream?: string;
}

export interface NpmInstall {
	systemDepend?: string[];
	path: string;
}

export interface GithubInterface {
	credentials: string;
	username: string;
	token: string;
}

export interface ISystemdConfig {
	type: string;
	watchdog?: number;
}

export interface GFWInterface {
	active?: boolean;
	proxy?: string;
}

export interface MicroServiceConfig {
	port: number;
	github: GithubInterface;
	forwardPort: {
		host: number;
		client: number;
		method: string;
	}[];
	volume: KeyValueObject<{
		path: string;
		isFolder: boolean;
	}>;
	command: string[];
	shell: string[];
	debugStartCommand: string[];
	reloadCommand: string[];
	stopCommand: string[];
	domain: string;
	appendDocker: {file?: string, content?: string}[];
	prependDocker: {file?: string, content?: string}[];
	projectName: string;
	plugins: any[];
	base: string;
	dockerRunArguments: string[];
	arguments: KeyValueObject<{
		name: string;
		defaultValue: string;
		runArg: boolean;
		desc?: string;
	}>;
	gfwConfig: GFWInterface;
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
	npmUpstream: NpmRegistry & {
		enabled: boolean;
	};
	dnsConfig: {
		onlyLocalCache: boolean;
	};
	systemInstall: string[];
	systemMethod: string;
	npmInstall: NpmInstall[];
	jspmInstall: string[];
	jspmConfig: string;
	networking: {
		hostIp: string;
		hostIp6: string;
		bridge: boolean;
		ifName: string;
	};
	disableCopyFolder: boolean;
	disableBinfiles: boolean;
	service: ISystemdConfig;
	onConfig?: (isDebug?: boolean) => void;
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
	jspm_bundle,
	npm_publish,
}

export interface KeyValueObject<T> {
	[id: string]: T;
}

export class MicroBuildConfig {
	private storage: MicroServiceConfig = {
		port: 80,
		volume: {},
		forwardPort: [],
		stopCommand: [],
		reloadCommand: [],
		debugStartCommand: [],
		domain: '',
		projectName: '',
		command: ['npm', 'start'],
		shell: ['/bin/sh', '-c'],
		appendDocker: [],
		prependDocker: [],
		plugins: [],
		base: 'node:latest',
		dockerRunArguments: [],
		arguments: {},
		serviceDependencies: {},
		containerDependencies: {},
		environments: [],
		labels: {},
		specialLabels: {},
		systemInstall: [],
		systemMethod: '',
		npmInstall: [],
		jspmInstall: [],
		jspmConfig: '',
		github: {
			credentials: '',
			username: '',
			token: '',
		},
		networking: {
			hostIp: '',
			hostIp6: '',
			bridge: true,
			ifName: 'docker0',
		},
		gfwConfig: {
			active: false,
			proxy: '',
		},
		npmUpstream: {
			enabled: false,
			url: 'http://registry.npmjs.org'
		},
		dnsConfig: {
			onlyLocalCache: false,
		},
		disableCopyFolder: false,
		disableBinfiles: false,
		service: {
			type: 'simple',
		},
	};
	public readonly registedIgnore: string[] = [];
	
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
		if (!/[a-z0-9\-_.]/i.test(name)) {
			throw new Error(`ca't use ${name} as project name.`);
		}
		this.storage.projectName = name;
	}
	
	domainName(name: string) {
		if (!/[a-z0-9\-_.]/i.test(name)) {
			throw new Error(`ca't use ${name} as project name.`);
		}
		this.storage.domain = name;
	}
	
	listenPort(port: number) {
		this.storage.port = parseInt('' + port);
	}
	
	onConfig(cb) {
		this.storage.onConfig = cb;
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
			this.storage.prependDocker.push({file: filePath});
		} else {
			throw new Error(`can't find prepend Dockerfile at ${filePath}`);
		}
	}
	
	prependDockerFileContent(lines: string) {
		this.storage.prependDocker.push({content: lines});
	}
	
	appendDockerFile(filePath: string) {
		if (existsSync(filePath)) {
			this.storage.appendDocker.push({file: filePath});
		} else {
			throw new Error(`can't find append Dockerfile at ${filePath}`);
		}
	}
	
	appendDockerFileContent(lines: string) {
		this.storage.appendDocker.push({content: lines});
	}
	
	permantalStorage(imageMountpoint: string) {
		if (!/^\//.test(imageMountpoint)) {
			imageMountpoint = resolve('/data', imageMountpoint);
		}
		this.storage.volume[imageMountpoint] = {
			path: null,
			isFolder: true,
		};
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
			throw new Error(`volume is not exists: ${hostFodler}`);
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
	
	isInChina(proxy?: GFWInterface);
	isInChina(is: boolean, proxy?: GFWInterface);
	isInChina(is: boolean, proxy: GFWInterface = {}) {
		if (is === true || is === false) {
			proxy.active = is;
			this.storage.gfwConfig = proxy;
		} else {
			this.storage.gfwConfig = is;
		}
	}
	
	noDataCopy(noCopy: boolean = true) {
		this.storage.disableCopyFolder = noCopy;
	}
	
	noBinFiles(noBin: boolean = true) {
		this.storage.disableBinfiles = noBin;
	}
	
	forceLocalDns(force: boolean = true) {
		this.storage.dnsConfig.onlyLocalCache = force;
	}
	
	/** @deprecated */
	install(packageJsonRelativePath: string) {
		this.npmInstall(packageJsonRelativePath);
	}
	
	npmInstall(packageJsonRelativePath: string, systemDepend: string[] = []) {
		const exists = this.storage.npmInstall.findIndex((e) => {
			return e.path === packageJsonRelativePath;
		});
		if (exists === -1) {
			if (!/package\.json$/.test(packageJsonRelativePath)) {
				throw new Error('microbuild.npmInstall only accept file name `package.json`');
			}
			this.storage.npmInstall.push({
				path: packageJsonRelativePath,
				systemDepend,
			});
		}
	}
	
	jspmConfig(clientConfigFile: string) {
		this.storage.jspmConfig = clientConfigFile
	}
	
	jspmInstall(packageJsonRelativePath: string) {
		if (this.storage.jspmInstall.indexOf(packageJsonRelativePath) === -1) {
			if (!/package\.json$/.test(packageJsonRelativePath)) {
				throw new Error('microbuild.jspmInstall only accept file name `package.json`');
			}
			this.storage.jspmInstall.push(packageJsonRelativePath);
		}
	}
	
	systemInstall(...pacakges: string[]) {
		pacakges.forEach((name) => {
			this.storage.systemInstall.push(name);
		});
	}
	
	systemInstallMethod(installer: string) {
		this.storage.systemMethod = installer;
	}
	
	addPlugin(name: EPlugins, options: any = true) {
		this.storage.plugins.push({options, name});
	}
	
	disablePlugin(name: EPlugins) {
		this.storage.plugins = this.storage.plugins.filter((e) => {
			return e.name !== name;
		});
		this.storage.plugins.push({options: false, name});
	}
	
	buildArgument(name: string, description: string, defaultValue: string = null) {
		const dockerfile_name = name.replace(/-/g, '_');
		this.storage.arguments[name] = {name: dockerfile_name, runArg: false, defaultValue, desc: description};
	}
	
	dockerRunArgument(...args: string[]) {
		args.forEach((e) => {
			if (e.indexOf('-') !== 0) {
				throw new Error(`dockerRunArgument('${e}') is invalid`);
			}
		});
		this.storage.dockerRunArguments = this.storage.dockerRunArguments.concat(args);
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
	
	npmInstallSource(upstream: string) {
		this.storage.npmUpstream = {
			url: upstream,
			enabled: false,
		};
	}
	
	npmCacheLayer(config: NpmRegistry) {
		this.storage.npmUpstream = Object.assign({enabled: true,}, config);
	}
	
	github(config: GithubInterface) {
		this.storage.github = config;
	}
	
	/** @deprecated */
	nsgLabel(name: ELabelNames, value: any) {
		this.storage.specialLabels[name] = value;
	}
	
	systemdType(type: string) {
		this.storage.service.type = type;
	}
	
	systemdWatchdog(watchdog: number) {
		this.storage.service.watchdog = watchdog;
	}
	
	/** getters **/
	toJSON(): MicroServiceConfig {
		if (!this.storage.projectName) {
			throw new Error(`project name is not defined in build script`);
		}
		return this.storage;
	}
	
	getNpmConfig() {
		return this.storage.npmUpstream;
	}
	
	getGithubConfig() {
		return this.storage.github;
	}
	
	getGfwConfig() {
		return this.storage.gfwConfig;
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
	
	getNetworkTypeArg() {
		const nw = this.storage.networking;
		const ret = [];
		ret.push(`--net=${nw.bridge? 'bridge' : 'host'}`);
		return ret;
	}
	
	getNetworkConfig() {
		const nw = this.storage.networking;
		const ret = {
			USE_LOCAL_DNS: this.storage.dnsConfig.onlyLocalCache? 'yes' : '',
		};
		return ret;
	}
	
	registerIgnore(path: string) {
		path = path
			.replace(getProjectPath(), '.')
			.replace(/^\.\//g, '');
		this.registedIgnore.push(path);
	}
	
	/**@deprecated*/
	isBuilding() {
		return isDockerMode();
	}
	
	private isCallbackTriggerd: boolean;
	
	runOnConfig() {
		if (!this.isCallbackTriggerd && this.storage.onConfig) {
			this.isCallbackTriggerd = true;
			this.storage.onConfig(isDockerMode());
		}
	}
}
