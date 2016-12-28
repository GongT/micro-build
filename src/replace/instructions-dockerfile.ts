import {PackageJsonFile} from "../library/package-json-file";
import {npm_install_command, createTempPackageFile} from "./plugin/npm";
import createGuid from "../library/guid";
import {TemplateVariables} from "./base";
import {renderTemplate, renderFile} from "./replace-dockerfile";
import {tempDirName} from "../library/file-paths";
import scss from "./plugin/scss";
import typescript from "./plugin/typescript";
import browserify from "./plugin/browserify";
import {EPlugins} from "../library/microbuild-config";
import {systemInstall, systemUninstall} from "./plugin/system-install";
import {parse} from "url";
import {createJspmInstallScript, jspm_install_command} from "./plugin/jspm";

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
	
	private safeEnv(str) {
		return '"' + str.replace(/(\s)/g, '\\$1') + '"';
	}
	
	ENVIRONMENT_VARS() {
		const ret = this.walk(this.config.toJSON().environments, ({name, value, insideOnly, append}) => {
			if (insideOnly !== false) {
				if (append) {
					if (append === true) {
						append = '';
					}
					return `${name}=${this.safeEnv(`\${${name}}${append}${this.wrapEnvStrip(value)}`)}`;
				} else {
					return `${name}=${this.safeEnv(this.wrapEnvStrip(value))}`;
				}
			}
		}, ' ');
		return ret.trim()? 'ENV ' + ret : '# NO ENV';
	}
	
	CHINA_ENVIRONMENTS() {
		const gfw = this.config.getGfwConfig();
		if (gfw.active) {
			const ENV_LIST = ['IS_IN_CHINA="yes"'];
			if (gfw.proxy) {
				const npm = this.config.getNpmConfig();
				ENV_LIST.push(`HTTP_PROXY=${this.wrapEnv(gfw.proxy)}`);
				ENV_LIST.push(`HTTPS_PROXY=${this.wrapEnv(gfw.proxy)}`);
				const excludeHosts = [];
				excludeHosts.push(this.config.getDomainBase());
				excludeHosts.push(`*.${this.config.getDomainBase()}`);
				if (npm.url) {
					excludeHosts.push(parse(npm.url).host);
				}
				if (npm.upstream) {
					excludeHosts.push(parse(npm.upstream).host);
				}
				ENV_LIST.push(`NO_PROXY="${excludeHosts.join(',')}"`);
			}
			return ENV_LIST.join(' ');
		} else {
			return 'IS_IN_CHINA="no"';
		}
	}
	
	NETWORKING_ENVIRONMENTS() {
		return this.walk(this.config.getNetworkConfig(), (v, k) => {
			return `${k}=${this.safeEnv(this.wrapEnvStrip(v))}`;
		}, ' \\ \n');
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
	
	COPY_MAIN_FOLDER() {
		if (this.config.toJSON().disableCopyFolder) {
			return '# disabled: COPY . /data';
		} else {
			return 'COPY . /data';
		}
	}
	
	LABEL_INSTRUCTIONS() {
		const split = ' \\ \n\t';
		let customLabel = this.walk(this.config.toJSON().labels, (v, k) => {
			return `${k}=${this.safeEnv(this.wrapEnvStrip(v))}`;
		}, split);
		const spLabel = this.walk(this.config.getSpecialLabelList(), (v, k) => {
			return `org.special-label.${k.toLowerCase()}=${this.safeEnv(this.wrapEnvStrip(v))}`;
		}, split);
		
		if (spLabel) {
			if (customLabel) {
				customLabel += split + spLabel;
			} else {
				customLabel = spLabel;
			}
		}
		
		customLabel += `${split}org.special-label.serviceName=${this.wrapEnv(this.config.toJSON().projectName)}`;
		
		return 'LABEL ' + customLabel;
	}
	
	BUILD_ARGUMENTS() {
		return this.walk(this.config.toJSON().arguments, (v, k) => {
			const def = v.defaultValue;
			if (v.runArg) {
				return '';
			}
			if (def === null) {
				return `ARG ${v.name}`;
			} else {
				return `ARG ${v.name}=${JSON.stringify(def)}`;
			}
		});
	}
	
	VOLUMES() {
		return this.walk(this.config.toJSON().volume, (v, k) => {
			return `VOLUME ${k}`;
		});
	}
	
	CUSTOM_SYSTEM_INSTALL() {
		const inst = systemInstall(this.config);
		if (inst.length === 0) {
			return '# no system install';
		} else {
			return 'RUN ' + inst.join(' && \\\n  ');
		}
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
			return dockerfile;
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
	
	private jspmActived = false;
	
	JSPM_INSTALL_INSTRUCTIONS() {
		const jspmInst = this.config.toJSON().jspmInstall.map((packagejsonPath) => {
			const pkg = new PackageJsonFile(packagejsonPath);
			let targetPath = packagejsonPath.replace(/^\.\//, '').replace(/\/?package\.json$/, '');
			if (targetPath) {
				targetPath += '/';
			}
			if (!/^\//.test(targetPath)) {
				targetPath = `/data/${targetPath}`;
			}
			const name = pkg.content.name || (pkg.content.name = 'noname-' + nextGuid());
			
			return createJspmInstallScript(pkg.content, targetPath);
		});
		if (jspmInst.length) {
			if (!this.jspmActived) {
				this.jspmActived = true;
				jspmInst.unshift(jspm_install_command(this.config));
			}
			return jspmInst.join('\n\n');
		} else {
			return '# no jspm install required';
		}
	}
	
	private npmActived = false;
	
	NPM_INSTALL_INSTRUCTIONS() {
		const npmInstallInstruction = this.config.toJSON().npmInstall.map(({path, systemDepend}) => {
			const INSTALL_SYSTEM_DEPEND = systemInstall(this.config, systemDepend);
			const REMOVE_SYSTEM_DEPEND = systemUninstall(this.config, systemDepend);
			
			const pkg = new PackageJsonFile(path);
			let targetPath = path.replace(/^\.\//, '').replace(/\/?package\.json$/, '');
			if (targetPath) {
				targetPath += '/';
			}
			const name = pkg.content.name || (pkg.content.name = 'noname-' + nextGuid());
			
			const tempFile = createTempPackageFile(pkg.content);
			
			const inst = [].concat(INSTALL_SYSTEM_DEPEND, [
				`/npm-install/installer "${name}" "${tempFile}" "${targetPath}"`,
				'rm -rf ~/.npm ~/.node-gyp /npm-install/npm-cache',
			], REMOVE_SYSTEM_DEPEND);
			
			return `COPY .micro-build/package-json/${tempFile} /npm-install/package-json/${tempFile}
RUN ${inst.join(' && \\\n ')}`;
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
		if (this.config.getPlugin(EPlugins.typescript)) {
			dependencies.push('typescript');
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



