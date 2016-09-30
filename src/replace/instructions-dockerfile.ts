import {PackageJsonFile} from "../library/package-json-file";
import {npm_install_command, createTempPackageFile} from "./npm";
import createGuid from "../library/guid";
import {TemplateVariables} from "./base";
import {renderTemplate, renderFile} from "./replace-dockerfile";
import {EPlugins} from "../library/microbuild-config";
import {tempDirName} from "../library/file-paths";

const nextGuid = createGuid();

export class CustomInstructions extends TemplateVariables {
	JSON_ENV_PASS() {
		if (!this.jsonEnvEnabled) {
			return '# no json env';
		}
		return renderTemplate('json_env.Dockerfile', new CustomInstructions(this.config, {
			JENV_FILE_NAME_REL() {
				return `./${tempDirName}/json-env-data.json`;
			}
		}));
	}
	
	NSG_LABEL_INSTRUCTIONS() {
		return this.walk(this.config.toJSON().nagLabels, (v, k) => {
			return `LABEL org.nsg.${k.toLowerCase()}=${this.wrapJson(v)}`;
		});
	}
	
	LABEL_INSTRUCTIONS() {
		return this.walk(this.config.toJSON().labels, (v, k) => {
			return `LABEL ${k}=${this.wrapJson(v)}`;
		});
	}
	
	BUILD_ARGUMENTS() {
		return this.walk(this.config.toJSON().arguments, (v, k) => {
			if (v === null) {
				return `ARG ${k}`;
			} else {
				return `ARG ${k}=${v}`;
			}
		});
	}
	
	walk(vars: any, cb: Function) {
		let list;
		if (Array.isArray(vars)) {
			list = vars.map((val, index) => {
				return cb(val, index);
			});
		} else {
			list = Object.keys(vars).map((name) => {
				return cb(vars[name], name);
			});
		}
		if (list.length) {
			return list.join('\n').trim() + '\n';
		} else {
			return '';
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
				return renderFile(fileName, new CustomInstructions(this.config));
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
		return this.config.toJSON().port.map(p => `EXPOSE ${p}`).join('\n');
	}
	
	COMPILE_PLUGIN() {
		const scss_plugin = this.config.getPlugin(EPlugins.node_scss);
		
		if (!scss_plugin) {
			return '# scss plugin not enabled';
		}
		return renderTemplate('node-scss-compile.Dockerfile', new CustomInstructions(this.config, {
			SOURCE() {
				return scss_plugin.source;
			},
			TARGET() {
				return scss_plugin.target;
			}
		}));
	}
	
	NPM_INSTALL_INSTRUCTIONS() {
		const npmInstallInstruction = this.config.toJSON().install.map((packagejsonPath) => {
			const pkg = new PackageJsonFile(packagejsonPath);
			const dependencies = pkg.content.dependencies;
			
			const tempFile = createTempPackageFile({dependencies});
			
			const vars = {
				TEMP_FILE() {
					return tempFile
				},
				RAND_ID: nextGuid,
				TARGET_DIR() {
					return packagejsonPath.replace(/^\.\//, '').replace(/\/?package\.json$/, '');
				},
			};
			
			return renderTemplate('npm-install.Dockerfile', new CustomInstructions(this.config, vars));
		});
		if (npmInstallInstruction.length) {
			const aliasNpmInstall = npm_install_command(this.config);
			npmInstallInstruction.unshift(aliasNpmInstall);
			return npmInstallInstruction.join('\n\n');
		} else {
			return '# no npm install required';
		}
	}
	
	private wrapJson(v: any) {
		if (v === false || v === undefined || v === null) {
			return '';
		} else if (v === true) {
			return 'yes';
		} else if (typeof v === 'object') {
			return JSON.stringify(v);
		} else {
			return v.toString();
		}
	}
}



