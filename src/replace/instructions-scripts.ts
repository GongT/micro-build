import {TemplateVariables} from "./base";
import {resolve} from "path";
import {renderTemplateScripts} from "./replace-scripts";
import {removeCache} from "../build/scripts";
import {getProjectPath, getGeneratePath} from "../library/common/file-paths";
import {NetworkConfig, DnsNetworkConfig} from "./parts/env-network";
import {getEnvironmentName} from "../library/common/runenv";
import {safeScriptValue, safeEnvStringInValue} from "./parts/wrapper";

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
	
	PID_FILE() {
		return safeScriptValue(resolve(getGeneratePath(), 'service.pid'));
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
	
	DOCKER_IMAGE_TAG_NAME() {
		const {projectName} = this.config.toJSON();
		return `${this.config.getDomainBase()}/${projectName}`;
	}
	
	ENVIRONMENT_VARS() {
		return this.walk(this.config.toJSON().environments, ({name, value, insideOnly, append}) => {
			if (insideOnly !== true) {
				if (append) {
					if (append === true) {
						append = '';
					}
					return `${name}="\${${name}}${append}${this.wrapEnvStrip(value)}"`;
				} else {
					return `${name}=${this.wrapEnv(value)}`;
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
	
	EXTERNAL_PORTS() {
		return this.walk(this.config.toJSON().forwardPort, ({host, client, method}) => {
			if (host !== null) {
				const map = `${host}:${client}${(method? '/' + method : '')}`;
				return `"--publish" ${safeScriptValue(map)}`;
			}
		}, ' ');
	}
	
	STOP_COMMAND() {
		return this.config.toJSON().stopCommand.length? 'yes' : 'no';
	}
	
	NETWORKING_ENVIRONMENTS_VARS() {
		return this.walk(this.config.getNetworkConfig(), (v, k) => {
			if (v) {
				return k + '=' + JSON.stringify(v);
			}
		});
	}
	
	NETWORKING_ENVIRONMENTS_ARGS() {
		return NetworkConfig(this.config);
	}
	
	DEFINED_IP_ADDRESS() {
		return this.config.toJSON().networking.hostIp || '';
	}
	
	DEFINED_INTERFACE() {
		return this.config.toJSON().networking.ifName || 'docker0';
	}
	
	USE_LOCAL_DNS() {
		return DnsNetworkConfig(this.config);
	}
	
	RUN_MOUNT_VOLUMES() {
		return this.walk(this.config.toJSON().volume, (hostFolder, mountPoint: string) => {
			if (hostFolder.path) {
				return `"--volume" "${safeEnvStringInValue(hostFolder.path)}:${safeEnvStringInValue(mountPoint)}"`
			} else {
				return `"--volume" "${safeEnvStringInValue(mountPoint)}"`
			}
		}, ' ');
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
		return this.walk(this.config.toJSON().containerDependencies, ({imageName, runCommandline}, containerName) => {
			return renderTemplateScripts('depend', 'start-service.sh', new ScriptVariables(this.config, {
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
