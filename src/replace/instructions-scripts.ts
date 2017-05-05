import {TemplateVariables} from "./base";
import {resolve} from "path";
import {renderTemplateScripts} from "./replace-scripts";
import {removeCache} from "../build/scripts";
import {getGeneratePath, getProjectPath} from "../library/common/file-paths";
import {getEnvironmentName} from "../library/common/runenv";
import {createDockerClientArgument, createDockerRunArgument} from "../library/docker/create-arguments";

export class ScriptVariables extends TemplateVariables {
	REMOVE_CACHES() {
		return removeCache();
	}
	
	PROJECT_PATH() {
		return getProjectPath();
	}
	
	CURRENT_ENV() {
		return getEnvironmentName();
	}
	
	PWD() {
		return getGeneratePath();
	}
	
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
		return this.config.getContainerName();
	}
	
	DOMAIN_NAME() {
		return this.config.toJSON().domain;
	}
	
	DOCKER_IMAGE_TAG_NAME() {
		return this.config.getImageTagName();
	}
	
	ENVIRONMENT_VARS() {
		const envs = this.config.toJSON().environments.concat({
			insideOnly: false,
			name: 'PROJECT_NAME',
			value: this.config.toJSON().projectName,
			append: false,
		});
		return this.walk(envs, ({name, value, insideOnly, append}) => {
			if (insideOnly !== true) {
				if (append) {
					if (append === true) {
						append = '';
					}
					return `export ${name}="\${${name}}${append}${this.wrapEnvStrip(value)}"`;
				} else {
					return `export ${name}=${this.wrapEnv(value)}`;
				}
			}
		});
	}
	
	DEBUG_LISTEN_PORT() {
		return `export LISTEN_PORT=${this.config.toJSON().port}`;
	}
	
	JSON_ENV_HASH() {
		if (!this.jsonEnvEnabled) {
			return '# no json env';
		}
		return renderTemplateScripts('plugin', 'json-env.sh', new ScriptVariables(this, {
			JENV_FILE_NAME() {
				return resolve(getGeneratePath(), 'json-env-data.json');
			}
		}));
	}
	
	BASE_DOMAIN_NAME() {
		return this.config.getDomainBase();
	}
	
	STOP_COMMAND() {
		return this.config.toJSON().stopCommand.length? 'yes' : 'no';
	}
	
	BUILD_DEPEND_SERVICE() {
		return this.walk(this.config.toJSON().serviceDependencies, (gitUrl, containerName) => {
			return renderTemplateScripts('depend', 'pull-build.sh', new ScriptVariables(this.config, {
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
		return this.walk(this.config.toJSON().containerDependencies, ({imageName, runCommandline}, containerName) => {
			if (imageName) {
				return renderTemplateScripts('depend', 'fetch-service.sh', new ScriptVariables(this.config, {
					CONTAINER_NAME() {
						return containerName;
					},
					IMAGE_NAME() {
						return imageName;
					},
				}));
			}
		});
	}
	
	START_DEPENDENCY() {
		return this.walk(this.config.toJSON().containerDependencies, ({imageName, runCommandline, appCommandline}, containerName) => {
			return renderTemplateScripts('depend', 'start-service.sh', new ScriptVariables(this.config, {
				CONTAINER_NAME() {
					return containerName;
				},
				IMAGE_NAME() {
					return imageName;
				},
				COMMAND_LINE() {
					if (Array.isArray(appCommandline)) {
						return appCommandline.map((str) => {
							return JSON.stringify(str);
						}).join(' ');
					} else {
						return appCommandline || '';
					}
				},
				DOCKER_CONFIG() {
					if (Array.isArray(runCommandline)) {
						return runCommandline.map((str) => {
							return JSON.stringify(str);
						}).join(' ');
					} else {
						return runCommandline || '';
					}
				},
			}));
		});
	}
	
	DOCKER_RUN_ARGUMENTS() {
		return createDockerRunArgument(this.config).join(' \\\n\t');
	}
	
	DOCKER_RUN_ARGUMENTS_HINT_STRING() {
		return createDockerRunArgument(this.config).join(' \\\\\n\t');
	}
	
	DOCKER_CLIENT() {
		return createDockerClientArgument(this.config).join(' \\\n\t');
	}
	
	DOCKER_CLIENT_HINT() {
		return createDockerClientArgument(this.config).join(' \\\\\n\t');
	}
	
	DEFINED_IP_ADDRESS() {
		return this.config.toJSON().networking.hostIp || '';
	}
	
	DEFINED_INTERFACE() {
		return this.config.toJSON().networking.ifName || 'docker0';
	}
}
