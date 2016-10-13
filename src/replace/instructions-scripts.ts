import {TemplateVariables} from "./base";
import {getTempPath, getProjectPath} from "../library/file-paths";
import {resolve} from "path";
import {renderTemplate} from "./replace-scripts";

export class ScriptVariables extends TemplateVariables {
	SHELL_COMMAND() {
		return this.scriptArgsWrap(this.config.toJSON().shell);
	}
	
	COMMAND() {
		return this.scriptArgsWrap(this.config.toJSON().command);
	}
	
	private scriptArgsWrap(arr: string[]) {
		return arr.map((v) => {
			return JSON.stringify(v).replace(/^"|"$/g, "'");
		}).join(' ');
	}
	
	DEBUG_COMMAND() {
		const debugCmd = this.config.toJSON().debugStartCommand;
		if (debugCmd.length) {
			return this.scriptArgsWrap(debugCmd);
		} else {
			return this.COMMAND();
		}
	}
	
	RELOAD_COMMAND() {
		const reloadCmd = this.config.toJSON().reloadCommand;
		if (reloadCmd.length) {
			return this.scriptArgsWrap(reloadCmd);
		} else {
			return '';
		}
	}
	
	SERVICE_NAME() {
		return this.config.toJSON().projectName;
	}
	
	DOMAIN_NAME() {
		return this.config.toJSON().domain;
	}
	
	DETECT_CURRENT() {
		return renderTemplate('admin', 'detect-current.sh', this);
	}
	
	ENVIRONMENT_VARS() {
		return this.walk(this.config.toJSON().environments, (v, n) => {
			return `export ${n}=${this.wrap(v)}`;
		});
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
	
	EXTERNAL_PORTS() {
		return this.walk(this.config.toJSON().forwardPort, ({host, client, method})=> {
			if (client !== null) {
				return `--publish ${host}:${client}` + (method? '/' + method : '');
			}
		}, ' ');
	}
	
	STOP_COMMAND() {
		return this.config.toJSON().stopCommand.length? 'yes' : 'no';
	}
	
	DOCKER_ARGS() {
		return this.walk(this.config.toJSON().dockerRunArguments, (arg)=> {
			return JSON.stringify(arg);
		}, ' ');
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
	
	BUILD_DEPEND_SERVICE() {
		return this.walk(this.config.toJSON().serviceDependencies, (gitUrl, containerName) => {
			return renderTemplate('depend', 'pull-build.sh', new ScriptVariables(this.config, {
				CONTAINER_NAME() {
					return containerName;
				},
				GIT_URL() {
					return gitUrl === null? '' : gitUrl;
				},
				SAVE_PATH() {
					return resolve(getProjectPath(), '..');
				},
			}));
		});
	}
	
	PULL_DEPEND_IMAGES() {
		return '';
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
