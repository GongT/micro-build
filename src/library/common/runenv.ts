export const RUN_MODE_DOCKER = 'docker';
export const RUN_MODE_HOST = 'host';

export type RUN_MODE = 'docker'|'host';
let runMode: string = process.env.MICRO_BUILD_RUN_MODE || '';
defaultEnvironment(RUN_MODE_DOCKER);

export function switchEnvironment(mode: RUN_MODE) {
	runMode = process.env.MICRO_BUILD_RUN = mode;
}

export function defaultEnvironment(mode: RUN_MODE) {
	if (!process.env.MICRO_BUILD_RUN_MODE) {
		switchEnvironment(mode);
	}
}

export function isDockerMode() {
	return runMode === RUN_MODE_DOCKER
}
export function getEnvironmentName() {
	if (!runMode) {
		throw new Error('MICRO_BUILD_RUN has not been set.');
	}
	return runMode;
}
