import {PackageJsonFile} from "./../library/config-file/package-json-file";

export interface IMyDependency {name: string, version: string
}
export function extractDeps(packageJson: string,
                            dev: boolean = true,
                            mapper?: (name: string) => boolean): IMyDependency[] {
	const pkg = new PackageJsonFile(packageJson, 'utf8', false);
	const pkgDevDeps = (dev? pkg.content.devDependencies : pkg.content.dependencies) || {};
	let ret = Object.keys(pkgDevDeps);
	if (mapper) {
		ret = ret.filter(mapper);
	}
	return ret.map((name) => {
		let version = pkgDevDeps[name];
		if (version === '*') {
			version = 'latest';
		}
		return {name, version};
	});
}

export function mergeAllDeps(escape: boolean, ...packageList: IMyDependency[][]): string[] {
	const depsMap: {[id: string]: string} = {};
	const e = escape? JSON.stringify : (s) => s;
	
	return [].concat(...packageList).filter(({name, version}) => {
		if (depsMap[name]) {
			if (depsMap[name] === version) {
				return false;
			} else {
				throw new Error(`found dependency version conflict: ${name}: ${depsMap[name]} and ${version}`);
			}
		} else {
			depsMap[name] = version;
			return true;
		}
	}).map(({name, version}) => e(`${name}@${version}`));
}
