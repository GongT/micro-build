import {PackageJsonFile} from "../library/package-json-file";
import {npm_install_command, createTempPackageFile} from "./npm";
import createGuid from "../library/guid";
import {TemplateVariables} from "./base";
import {renderTemplate, renderFile} from "./replace-dockerfile";
import {tempDirName} from "../library/file-paths";
import {dirname} from "path";
import scss from "./plugin/scss";
import typescript from "./plugin/typescript";
import browserify from "./plugin/browserify";
import {EPlugins} from "../library/microbuild-config";

const nextGuid = createGuid();

export class CustomInstructions extends TemplateVariables {
	SHELL() {
		return this.config.toJSON().shell.map((v) => {
			return JSON.stringify(v);
		}).join(', ');
	}
	
	COMMAND() {
		return this.config.toJSON().command.map((v) => {
			return JSON.stringify(v);
		}).join(', ');
	}
	
	ENVIRONMENT_VARS() {
		return this.walk(this.config.toJSON().environments, (v, n) => {
			return `ENV ${n} ${v}`;
		});
	}
	
	JSON_ENV_PASS() {
		if (!this.jsonEnvEnabled) {
			return '# no json env';
		}
		return renderTemplate('json_env.Dockerfile', new CustomInstructions(this, {
			JENV_FILE_NAME_REL() {
				return `./${tempDirName}/json-env-data.json`;
			}
		}));
	}
	
	NSG_LABEL_INSTRUCTIONS() {
		return this.walk(this.config.getNsgLabelList(), (v, k) => {
			return `LABEL org.nsg.${k.toLowerCase()}=${this.wrap(v)}`;
		});
	}
	
	LABEL_INSTRUCTIONS() {
		return this.walk(this.config.toJSON().labels, (v, k) => {
			return `LABEL ${k}=${this.wrap(v)}`;
		});
	}
	
	BUILD_ARGUMENTS() {
		return this.walk(this.config.toJSON().arguments, (v, k) => {
			const def = v.defaultValue;
			if (v.runArg) {
				return '';
			}
			if (def === null) {
				return `ARG ${k}`;
			} else {
				return `ARG ${k}=${def}`;
			}
		});
	}
	
	VOLUMES() {
		return this.walk(this.config.toJSON().volume, (v, k) => {
			let createIns;
			if (v.isFolder) {
				createIns = 'mkdir -p ' + JSON.stringify(k);
			} else {
				createIns = 'mkdir -p ' + JSON.stringify(dirname(k));
			}
			return `RUN ${createIns} 
VOLUME ${k}`;
		});
	}
	
	CUSTOM_BUILD_BEFORE() {
		return this.custom_build(this.config.toJSON().prependDockerFile);
	}
	
	CUSTOM_BUILD_AFTER() {
		return this.custom_build(this.config.toJSON().appendDockerFile);
	}
	
	private custom_build(arr: string[]) {
		const dockerfile = this.walk(arr, (fileName) => {
			try {
				return renderFile(fileName, this);
			} catch (e) {
				e.stack = '' + e.stack;
				e.message += ` (in file ${fileName})`;
				throw e;
			}
		});
		if (dockerfile) {
			return dockerfile + '\n\nWORKDIR /data'
		} else {
			return '# no custom build here';
		}
	}
	
	FROM() {
		return 'FROM ' + this.config.toJSON().base;
	}
	
	PORTS() {
		const ports = this.config.toJSON().forwardPort;
		if (ports.length) {
			return 'EXPOSE ' + this.walk(ports, ({client, method}) => {
					return client + (method? '/' + method : '');
				}, ' ')
		} else {
			return '# no exposed port';
		}
	}
	
	COMPILE_PLUGIN() {
		return [
			scss(this.config),
			typescript(this.config),
			browserify(this.config),
		].join('\n');
	}
	
	private npmActived = false;
	
	NPM_INSTALL_INSTRUCTIONS() {
		const npmInstallInstruction = this.config.toJSON().install.map((packagejsonPath) => {
			const pkg = new PackageJsonFile(packagejsonPath);
			const targetPath = packagejsonPath.replace(/^\.\//, '').replace(/\/?package\.json$/, '');
			const name = pkg.content.name || (pkg.content.name = 'noname-' + nextGuid());
			
			const tempFile = createTempPackageFile(pkg.content);
			
			return `RUN /npm-install/installer "${name}" "${tempFile}" "${targetPath}"`;
		});
		if (npmInstallInstruction.length) {
			if (!this.npmActived) {
				this.npmActived = true;
				npmInstallInstruction.unshift(npm_install_command(this.config));
			}
			return npmInstallInstruction.join('\n\n');
		} else {
			return '# no npm install required';
		}
	}
	
	PLUGINS_NPM_INSTALL() {
		const dependencies = [];
		if (this.config.getPlugin(EPlugins.jenv)) {
			dependencies.push('json-env-data');
		}
		if (this.config.getPlugin(EPlugins.typescript)) {
			dependencies.push('typescript');
			dependencies.push('typings');
		}
		if (this.config.getPlugin(EPlugins.browserify)) {
			dependencies.push('browserify');
		}
		if (this.config.getPlugin(EPlugins.node_scss)) {
			dependencies.push('node-sass');
		}
		if (dependencies.length) {
			const npmInstallInstruction = [
				`RUN /npm-install/global-installer ${dependencies.join(' ')}`
			];
			if (!this.npmActived) {
				this.npmActived = true;
				npmInstallInstruction.unshift(npm_install_command(this.config));
			}
			return npmInstallInstruction.join('\n\n');
		} else {
			return '# no plugins';
		}
	}
}



