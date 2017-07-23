import {ConfigFile} from "../config/config-file";

export enum DependencyRelation {
	COOPERATION,
	ENHANCE,
	RELY,
}

export enum DependencyStartOrder {
	AFTER,
	BEFORE,
	ANY,
}

export interface ServiceDependency {
	name: string;
	canBuildFrom?: string;
	relation: DependencyRelation;
	order: DependencyStartOrder;
}

function resolveDependencyInstall(self: ConfigFile, target: ServiceDependency) {

}
