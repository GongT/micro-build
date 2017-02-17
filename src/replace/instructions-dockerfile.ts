import {npm_install_command, createTempPackageFile} from "./plugin/npm";
import {TemplateVariables} from "./base";
import {renderTemplateDockerFile, renderFile} from "./replace-dockerfile";
import scss from "./plugin/scss";
import typescript from "./plugin/typescript";
import {EPlugins} from "../library/microbuild-config";
import {systemInstall, systemUninstall} from "./plugin/system-install";
import {parse} from "url";
import {createJspmInstallScript, jspm_install_command} from "./plugin/jspm";
import {jspm_bundle, jspm_bundle_after} from "./plugin/jspm-bundle";
import {updateResolve, removeCache} from "../build/scripts";
import {npm_publish_after, npm_publish_command} from "./plugin/npm-publish";
import createGuid from "../library/common/guid";
import {PackageJsonFile} from "../library/config-file/package-json-file";
import {getTempPath} from "../library/common/file-paths";

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
		let ret = this.walk(this.config.toJSON().environments, ({name, value, insideOnly, append}) => {
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
		
		ret = ret.trim();
		const sdType = (this.config.toJSON().service.type || 'simple').toLowerCase();
		ret += ` SYSTEMD_TYPE=${this.safeEnv(sdType)}`;
		
		return `ENV ${ret} `;
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
		return renderTemplateDockerFile('json_env.Dockerfile', new CustomInstructions(this, {
			JENV_FILE_NAME_REL() {
				return `./${getTempPath(true)}/json-env-data.json`;
			}
		}));
	}
	
	COPY_BIN_FILES() {
		if (this.config.toJSON().disableBinfiles) {
			return '# disabled: COPY .micro-build/bin/* /usr/local/bin/';
		} else {
			return `COPY .micro-build/bin/* /usr/local/bin/`
		}
	}
	
	COPY_MAIN_FOLDER() {
		if (this.config.toJSON().disableCopyFolder) {
			return '# disabled: COPY . /data';
		} else {
			return `COPY . /data`;
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
		const vols = this.walk(this.config.toJSON().volume, (v, k) => {
			return JSON.stringify(k);
		}, ' ');
		return vols? `VOLUME ${vols}` : '# no any volumes';
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
		return this.custom_build(this.config.toJSON().prependDocker);
	}
	
	CUSTOM_BUILD_AFTER() {
		return this.custom_build(this.config.toJSON().appendDocker);
	}
	
	private custom_build(arr: {file?: string, content?: string}[]) {
		const dockerfile = this.walk(arr, ({file, content}) => {
			try {
				if (file) {
					return `# append docker file from: ${file}
${renderFile(file, this)}`;
				} else {
					return `# append docker file content:
${content}`;
				}
			} catch (e) {
				e.stack = '' + e.stack;
				e.message += ` (in file ${file})`;
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
			typescript(this.config),
			jspm_bundle(this),
			scss(this.config),
			// browserify(this.config),
		].join('\n\n\n');
	}
	
	COMPILE_PLUGIN_AFTER() {
		return [
			jspm_bundle_after(this),
			npm_publish_after(this),
		].join('\n\n\n');
	}
	
	private jspmActived = false;
	private npmPubActived = false;
	
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
			
			return createJspmInstallScript(this.config, pkg.content, targetPath);
		});
		
		if (jspmInst.length) {
			if (!this.jspmActived) {
				this.jspmActived = true;
				jspmInst.unshift(jspm_install_command(this.config));
			}
			return jspmInst.join('\n\n');
		} else {
			if (this.config.getPlugin(EPlugins.jspm_bundle) && !this.jspmActived) {
				this.jspmActived = true;
				return '# no jspm install but have bundle\n' + jspm_install_command(this.config);
			}
			return '# no jspm install required';
		}
	}
	
	private npmActived = false;
	
	NPM_INSTALL_INSTRUCTIONS() {
		const npmInstallInstruction = this.config.toJSON().npmInstall.map(({path, systemDepend}) => {
			const pkg = new PackageJsonFile(path);
			/*const dependencies = pkg.content.dependencies || {};
			 if (dependencies.hasOwnProperty('typescript-common-library')) {
			 systemDepend = systemDepend.concat(['python', 'make', 'g++']);
			 }*/
			
			const INSTALL_SYSTEM_DEPEND = systemInstall(this.config, systemDepend);
			const REMOVE_SYSTEM_DEPEND = systemUninstall(this.config, systemDepend);
			
			let targetPath = path.replace(/^\.\//, '').replace(/\/?package\.json$/, '');
			if (targetPath) {
				targetPath += '/';
			}
			const name = pkg.content.name || (pkg.content.name = 'noname-' + nextGuid());
			
			const tempFile = createTempPackageFile(pkg.content);
			
			const inst = ['set -x'].concat(INSTALL_SYSTEM_DEPEND, [
				`/install/npm/installer "${name}" "${tempFile}" "${targetPath}"`,
				removeCache(),
			], REMOVE_SYSTEM_DEPEND);
			
			return `COPY ${getTempPath(true)}/package-json/${tempFile} /install/package-json/${tempFile}
RUN ${inst.join(' && \\\n\t')}`;
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
		if (this.config.getPlugin(EPlugins.typescript) ||
		    this.config.getPlugin(EPlugins.browserify) ||
		    this.config.getPlugin(EPlugins.node_scss) ||
		    this.config.getPlugin(EPlugins.jspm_bundle) ||
		    this.config.getPlugin(EPlugins.npm_publish)
		) {
			let ret: string = '# some nodejs plugin enbled\n';
			if (!this.npmActived) {
				this.npmActived = true;
				ret += '# enable npm for plugin\n';
				ret += npm_install_command(this.config)
			}
			
			if (this.config.getPlugin(EPlugins.jspm_bundle)) {
				if (!this.jspmActived) {
					this.jspmActived = true;
					ret += '# enable jspm for plugin\n';
					ret += jspm_install_command(this.config);
				}
			}
			
			if (this.config.getPlugin(EPlugins.npm_publish)) {
				if (!this.npmPubActived) {
					this.npmPubActived = true;
					ret += '# enable npm publish\n';
					ret += npm_publish_command(this.config);
				}
			}
			return ret;
		} else {
			return '# no plugins enabled';
		}
	}
}



