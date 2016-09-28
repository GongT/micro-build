import {ConfigJsonFile} from "./config-json-file";

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
