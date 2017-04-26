import {ConfigJsonFile} from "./config-json-file";

export interface JspmPackageConfig {
	directories?: {
		[id: string]: string;
		baseURL?: string;
		packages?: string;
	},
	configFiles?: {
		[id: string]: string;
		jspm: string;
	},
	configFile?: string;
	dependencies?: {
		[id: string]: string;
	};
	overrides?: {
		[id: string]: any;
	};
}

export interface IPackageJson extends JsonSchemastoreOrg.Package {
	jspm?: JspmPackageConfig;
}

export class PackageJsonFile extends ConfigJsonFile<IPackageJson> {
	addDependecy(dependencyName: string) {
		this._deps('dependencies', dependencyName);
	}
	
	addDevDependecy(dependencyName: string) {
		this._deps('devDependencies', dependencyName);
	}
	
	private _deps(t: string, name: string) {
		if (!this._content[t]) {
			this._content[t] = {};
		}
		this._content[t][name] = '*';
	}
}
