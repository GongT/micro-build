export interface MicroServiceConfig {
	base: string;
	arguments: string[];
	serviceDependencies: KeyValueObject<string>;
	containerDependencies: KeyValueObject<{imageName: string, runCommandline: string}>;
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

export interface KeyValueObject<T> {
	[id: string]: T;
}

export class MicroBuildConfig {
	private storage: MicroServiceConfig = {
		base: 'node:latest',
		arguments: [],
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
	
	fromAlpine(baseImage: string) {
		this.from(baseImage, 'alpine');
	}
	
	from(baseImage: string, version: string = 'latest') {
		this.storage.base = `${baseImage}:${version}`;
	}
	
	dependService(otherService: string, otherServiceGitUrl: string) {
		this.storage.serviceDependencies[otherService] = otherServiceGitUrl;
	}
	
	dependDocker(containerName: string, imageName: string, runCommandline: string) {
		this.storage.containerDependencies[containerName] = {imageName, runCommandline};
	}
	
	install(packageJsonRelativePath: string) {
		if (this.storage.install.indexOf(packageJsonRelativePath) === -1) {
			this.storage.install.push(packageJsonRelativePath);
		}
	}
	
	buildArgument(name) {
		if (this.storage.arguments.indexOf(name) === -1) {
			this.storage.arguments.push(name);
		}
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
		return this.storage;
	}
	
	getBase() {
		return this.storage.base;
	}
	
	getArguments() {
		return this.storage.arguments;
	}
	
	getServiceDependencies() {
		return this.storage.serviceDependencies;
	}
	
	getContainerDependencies() {
		return this.storage.containerDependencies;
	}
	
	getEnvironments() {
		return this.storage.environments;
	}
	
	getLabels() {
		return this.storage.labels;
	}
	
	getNagLabels() {
		return this.storage.nagLabels;
	}
	
	getInstall() {
		return this.storage.install;
	}
}
