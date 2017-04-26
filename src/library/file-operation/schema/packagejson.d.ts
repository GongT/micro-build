declare namespace JsonSchemastoreOrg {
    export interface Package {
        /**
         * The name of the package.
         */
        name: string; // ^[^A-Z]+$
        /**
         * Version must be parseable by node-semver, which is bundled with npm as a dependency.
         */
        version: string;
        /**
         * This helps people discover your package, as it's listed in 'npm search'.
         */
        description?: string;
        /**
         * This helps people discover your package as it's listed in 'npm search'.
         */
        keywords?: string[];
        /**
         * The url to the project homepage.
         */
        homepage?: string; // uri
        /**
         * The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
         */
        bugs?: {
            /**
             * The url to your project's issue tracker.
             */
            url?: string; // uri
            /**
             * The email address to which issues should be reported.
             */
            email?: string; // email
        } | string;
        /**
         * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
         */
        license?: string;
        /**
         * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
         */
        licenses?: {
            type?: string;
            url?: string; // uri
        }[];
        author?: Package.Definitions.Person;
        /**
         * A list of people who contributed to this package.
         */
        contributors?: Package.Definitions.Person[];
        /**
         * A list of people who maintains this package.
         */
        maintainers?: Package.Definitions.Person[];
        /**
         * The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder.
         */
        files?: string[];
        /**
         * The main field is a module ID that is the primary entry point to your program.
         */
        main?: string;
        bin?: string | {
            [name: string]: string;
        };
        /**
         * Specify either a single file or an array of filenames to put in place for the man program to find.
         */
        man?: string[] | string;
        directories?: {
            /**
             * If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.
             */
            bin?: string;
            /**
             * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
             */
            doc?: string;
            /**
             * Put example scripts in here. Someday, it might be exposed in some clever way.
             */
            example?: string;
            /**
             * Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.
             */
            lib?: string;
            /**
             * A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.
             */
            man?: string;
            test?: string;
        };
        /**
         * Specify the place where your code lives. This is helpful for people who want to contribute.
         */
        repository?: {
            type?: string;
            url?: string; // uri
        } | string;
        /**
         * The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
         */
        scripts?: {
            [name: string]: string;
            /**
             * Run BEFORE the package is published (Also run on local npm install without any arguments)
             */
            prepublish?: string;
            publish?: Package.Definitions.ScriptsPublishAfter;
            postpublish?: Package.Definitions.ScriptsPublishAfter;
            /**
             * Run BEFORE the package is installed
             */
            preinstall?: string;
            install?: Package.Definitions.ScriptsInstallAfter;
            postinstall?: Package.Definitions.ScriptsInstallAfter;
            preuninstall?: Package.Definitions.ScriptsUninstallBefore;
            uninstall?: Package.Definitions.ScriptsUninstallBefore;
            /**
             * Run AFTER the package is uninstalled
             */
            postuninstall?: string;
            preversion?: Package.Definitions.ScriptsVersionBefore;
            version?: Package.Definitions.ScriptsVersionBefore;
            /**
             * Run AFTER bump the package version
             */
            postversion?: string;
            pretest?: Package.Definitions.ScriptsTest;
            test?: Package.Definitions.ScriptsTest;
            posttest?: Package.Definitions.ScriptsTest;
            prestop?: Package.Definitions.ScriptsStop;
            stop?: Package.Definitions.ScriptsStop;
            poststop?: Package.Definitions.ScriptsStop;
            prestart?: Package.Definitions.ScriptsStart;
            start?: Package.Definitions.ScriptsStart;
            poststart?: Package.Definitions.ScriptsStart;
            prerestart?: Package.Definitions.ScriptsRestart;
            restart?: Package.Definitions.ScriptsRestart;
            postrestart?: Package.Definitions.ScriptsRestart;
        };
        /**
         * A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades.
         */
        config?: {
            [name: string]: any;
        };
        dependencies?: Package.Definitions.Dependency;
        devDependencies?: Package.Definitions.Dependency;
        optionalDependencies?: Package.Definitions.Dependency;
        peerDependencies?: Package.Definitions.Dependency;
        engines?: {
            [name: string]: string;
        };
        engineStrict?: boolean;
        /**
         * You can specify which operating systems your module will run on
         */
        os?: string[];
        /**
         * If your code only runs on certain cpu architectures, you can specify which ones.
         */
        cpu?: string[];
        /**
         * If your package is primarily a command-line application that should be installed globally, then set this value to true to provide a warning if it is installed locally.
         */
        preferGlobal?: boolean;
        /**
         * If set to true, then npm will refuse to publish it.
         */
        private?: boolean;
        publishConfig?: {
            [name: string]: any;
        };
        dist?: {
            shasum?: string;
            tarball?: string;
        };
        readme?: string;
        jspm?: Package.Definitions.CoreProperties;
    }
    namespace Package {
        namespace Definitions {
            /**
             * Array of package names that will be bundled when publishing the package.
             */
            export type BundledDependency = string[];
            export interface CoreProperties {
                /**
                 * The name of the package.
                 */
                name?: string; // ^[^A-Z]+$
                /**
                 * Version must be parseable by node-semver, which is bundled with npm as a dependency.
                 */
                version?: string;
                /**
                 * This helps people discover your package, as it's listed in 'npm search'.
                 */
                description?: string;
                /**
                 * This helps people discover your package as it's listed in 'npm search'.
                 */
                keywords?: string[];
                /**
                 * The url to the project homepage.
                 */
                homepage?: string; // uri
                /**
                 * The url to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
                 */
                bugs?: {
                    /**
                     * The url to your project's issue tracker.
                     */
                    url?: string; // uri
                    /**
                     * The email address to which issues should be reported.
                     */
                    email?: string; // email
                } | string;
                /**
                 * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
                 */
                license?: string;
                /**
                 * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.
                 */
                licenses?: {
                    type?: string;
                    url?: string; // uri
                }[];
                author?: Person;
                /**
                 * A list of people who contributed to this package.
                 */
                contributors?: Person[];
                /**
                 * A list of people who maintains this package.
                 */
                maintainers?: Person[];
                /**
                 * The 'files' field is an array of files to include in your project. If you name a folder in the array, then it will also include the files inside that folder.
                 */
                files?: string[];
                /**
                 * The main field is a module ID that is the primary entry point to your program.
                 */
                main?: string;
                bin?: string | {
                    [name: string]: string;
                };
                /**
                 * Specify either a single file or an array of filenames to put in place for the man program to find.
                 */
                man?: string[] | string;
                directories?: {
                    /**
                     * If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.
                     */
                    bin?: string;
                    /**
                     * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
                     */
                    doc?: string;
                    /**
                     * Put example scripts in here. Someday, it might be exposed in some clever way.
                     */
                    example?: string;
                    /**
                     * Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.
                     */
                    lib?: string;
                    /**
                     * A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.
                     */
                    man?: string;
                    test?: string;
                };
                /**
                 * Specify the place where your code lives. This is helpful for people who want to contribute.
                 */
                repository?: {
                    type?: string;
                    url?: string; // uri
                } | string;
                /**
                 * The 'scripts' member is an object hash of script commands that are run at various times in the lifecycle of your package. The key is the lifecycle event, and the value is the command to run at that point.
                 */
                scripts?: {
                    [name: string]: string;
                    /**
                     * Run BEFORE the package is published (Also run on local npm install without any arguments)
                     */
                    prepublish?: string;
                    publish?: ScriptsPublishAfter;
                    postpublish?: ScriptsPublishAfter;
                    /**
                     * Run BEFORE the package is installed
                     */
                    preinstall?: string;
                    install?: ScriptsInstallAfter;
                    postinstall?: ScriptsInstallAfter;
                    preuninstall?: ScriptsUninstallBefore;
                    uninstall?: ScriptsUninstallBefore;
                    /**
                     * Run AFTER the package is uninstalled
                     */
                    postuninstall?: string;
                    preversion?: ScriptsVersionBefore;
                    version?: ScriptsVersionBefore;
                    /**
                     * Run AFTER bump the package version
                     */
                    postversion?: string;
                    pretest?: ScriptsTest;
                    test?: ScriptsTest;
                    posttest?: ScriptsTest;
                    prestop?: ScriptsStop;
                    stop?: ScriptsStop;
                    poststop?: ScriptsStop;
                    prestart?: ScriptsStart;
                    start?: ScriptsStart;
                    poststart?: ScriptsStart;
                    prerestart?: ScriptsRestart;
                    restart?: ScriptsRestart;
                    postrestart?: ScriptsRestart;
                };
                /**
                 * A 'config' hash can be used to set configuration parameters used in package scripts that persist across upgrades.
                 */
                config?: {
                    [name: string]: any;
                };
                dependencies?: Dependency;
                devDependencies?: Dependency;
                optionalDependencies?: Dependency;
                peerDependencies?: Dependency;
                engines?: {
                    [name: string]: string;
                };
                engineStrict?: boolean;
                /**
                 * You can specify which operating systems your module will run on
                 */
                os?: string[];
                /**
                 * If your code only runs on certain cpu architectures, you can specify which ones.
                 */
                cpu?: string[];
                /**
                 * If your package is primarily a command-line application that should be installed globally, then set this value to true to provide a warning if it is installed locally.
                 */
                preferGlobal?: boolean;
                /**
                 * If set to true, then npm will refuse to publish it.
                 */
                private?: boolean;
                publishConfig?: {
                    [name: string]: any;
                };
                dist?: {
                    shasum?: string;
                    tarball?: string;
                };
                readme?: string;
                jspm?: CoreProperties;
            }
            /**
             * Dependencies are specified with a simple hash of package name to version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
             */
            export interface Dependency {
                [name: string]: string;
            }
            export interface JspmDefinition {
                jspm?: CoreProperties;
            }
            /**
             * A person who has been involved in creating or maintaining this package
             */
            export type Person = {
                name: string;
                url?: string; // uri
                email?: string; // email
            } | string;
            /**
             * Run AFTER the package is installed
             */
            export type ScriptsInstallAfter = string;
            /**
             * Run AFTER the package is published
             */
            export type ScriptsPublishAfter = string;
            /**
             * Run by the 'npm restart' command. Note: 'npm restart' will run the stop and start scripts if no restart script is provided.
             */
            export type ScriptsRestart = string;
            /**
             * Run by the 'npm start' command
             */
            export type ScriptsStart = string;
            /**
             * Run by the 'npm stop' command
             */
            export type ScriptsStop = string;
            /**
             * Run by the 'npm test' command
             */
            export type ScriptsTest = string;
            /**
             * Run BEFORE the package is uninstalled
             */
            export type ScriptsUninstallBefore = string;
            /**
             * Run BEFORE bump the package version
             */
            export type ScriptsVersionBefore = string;
        }
    }
}
