import {TemplateVariables} from "./base";
import {getTempPath} from "../library/file-paths";
import {resolve} from "path";
import {renderTemplate} from "./replace-scripts";

export class ScriptVariables extends TemplateVariables {
	SHELL() {
		return this.config.toJSON().shell.map((v) => {
			return JSON.stringify(v);
		}).join(' ');
	}
	
	COMMAND() {
		return this.config.toJSON().command.map((v) => {
			return JSON.stringify(v);
		}).join(' ');
	}
	
	SERVICE_NAME() {
		return this.config.toJSON().projectName;
	}
	
	DOMAIN_NAME() {
		return this.config.toJSON().domain;
	}
	
	JSON_ENV_HASH() {
		if (!this.jsonEnvEnabled) {
			return '# no json env';
		}
		return renderTemplate('plugin', 'json-env.sh', new ScriptVariables(this.config, {
			JENV_FILE_NAME() {
				return resolve(getTempPath(), 'json-env-data.json');
			}
		}));
	}
	
	BASE_DOMAIN_NAME() {
		return this.config.getDomainBase();
	}
	
	PWD() {
		return getTempPath();
	}
	
	BUILD_DEPEND_SERVICE() {
		return '';
	}
	
	PULL_DEPEND_IMAGES() {
		return '';
	}
	
	EXTERNAL_PORTS() {
		return this.walk(this.config.toJSON().forwardPort, (internalPort, hostPort)=> {
			return `--port ${hostPort}:${internalPort}`
		}, ' ');
	}
	
	STOP_COMMAND() {
		return this.config.toJSON().stopcommand.length? 'yes' : 'no';
	}
	
	RUN_MOUNT_VOLUMES() {
		return this.walk(this.config.toJSON().volume, (hostFolder, mountPoint: string)=> {
			return `--volume ${this.wrap(hostFolder.path)}:${this.wrap(mountPoint)}`
		}, ' ');
	}
	
	DEPEND_LINKS() {
		const d = this.config.toJSON();
		const allServiceContainers = [].concat(Object.keys(d.serviceDependencies), Object.keys(d.containerDependencies));
		return this.walk(allServiceContainers, (containerName) => {
			return `--link ${containerName}`;
		}, ' ');
	}
	
	DEPENDENCY_CHECK_EXTERNAL() {
		return this.walk(this.config.toJSON().serviceDependencies, (_, containerName) => {
			return renderTemplate('depend', 'check.sh', new ScriptVariables(this.config, {
				CONTAINER_NAME() {
					return containerName;
				},
			}));
		});
	}
	
	START_DEPENDENCY() {
		return this.walk(this.config.toJSON().containerDependencies, ({imageName, runCommandline}, containerName) => {
			return renderTemplate('depend', 'start-service.sh', new ScriptVariables(this.config, {
				CONTAINER_NAME() {
					return containerName;
				},
				IMAGE_NAME() {
					return imageName;
				},
				COMMAND_LINE() {
					if (Array.isArray(runCommandline)) {
						return runCommandline.map((str) => {
							return JSON.stringify(str);
						}).join(' ');
					} else {
						return runCommandline;
					}
				},
			}));
		});
	}
}
