declare namespace JsonSchemastoreOrg {
    export interface Eslintrc {
        /**
         * By default, ESLint supports only ECMAScript 5 syntax. You can override that setting to enable support for ECMAScript 6 as well as JSX by using configuration settings.
         */
        ecmaFeatures?: {
            arrowFunctions?: boolean;
            binaryLiterals?: boolean;
            blockBindings?: boolean;
            classes?: boolean;
            defaultParams?: boolean;
            destructuring?: boolean;
            /**
             * Enables support for the experimental object rest/spread properties (IMPORTANT: This is an experimental feature that may change significantly in the future. It’s recommended that you do not write rules relying on this functionality unless you are willing to incur maintenance cost when it changes.)
             */
            experimentalObjectRestSpread?: boolean;
            forOf?: boolean;
            generators?: boolean;
            /**
             * allow return statements in the global scope
             */
            globalReturn?: boolean;
            /**
             * enable global strict mode (if ecmaVersion is 5 or greater)
             */
            impliedStrict?: boolean;
            /**
             * enable JSX
             */
            jsx?: boolean;
            modules?: boolean;
            objectLiteralComputedProperties?: boolean;
            objectLiteralDuplicateProperties?: boolean;
            objectLiteralShorthandMethods?: boolean;
            objectLiteralShorthandProperties?: boolean;
            octalLiterals?: boolean;
            regexUFlag?: boolean;
            regexYFlag?: boolean;
            restParams?: boolean;
            spread?: boolean;
            superInFunctions?: boolean;
            templateStrings?: boolean;
            unicodeCodePointEscapes?: boolean;
        };
        /**
         * An environment defines global variables that are predefined.
         */
        env?: {
            /**
             * defines require() and define() as global variables as per the amd spec
             */
            amd?: boolean;
            /**
             * AppleScript global variables
             */
            applescript?: boolean;
            /**
             * Atom test helper globals
             */
            atomtest?: boolean;
            /**
             * browser global variables
             */
            browser?: boolean;
            /**
             * CommonJS global variables and CommonJS scoping (use this for browser-only code that uses Browserify/WebPack)
             */
            commonjs?: boolean;
            /**
             * Globals common to both Node and Browser
             */
            "shared-node-browser"?: boolean;
            /**
             * Ember test helper globals
             */
            embertest?: boolean;
            /**
             * enable all ECMAScript 6 features except for modules
             */
            es6?: boolean;
            /**
             * GreaseMonkey globals
             */
            greasemonkey?: boolean;
            /**
             * adds all of the Jasmine testing global variables for version 1.3 and 2.0
             */
            jasmine?: boolean;
            /**
             * Jest global variables
             */
            jest?: boolean;
            /**
             * jQuery global variables
             */
            jquery?: boolean;
            /**
             * Meteor global variables
             */
            meteor?: boolean;
            /**
             * adds all of the Mocha test global variables
             */
            mocha?: boolean;
            /**
             * MongoDB global variables
             */
            mongo?: boolean;
            /**
             * Java 8 Nashorn global variables
             */
            nashorn?: boolean;
            /**
             * Node.js global variables and Node.js scoping
             */
            node?: boolean;
            /**
             * PhantomJS global variables
             */
            phantomjs?: boolean;
            /**
             * Prototype.js global variables
             */
            prototypejs?: boolean;
            /**
             * Protractor global variables
             */
            protractor?: boolean;
            /**
             * QUnit global variables
             */
            qunit?: boolean;
            /**
             * Service Worker global variables
             */
            serviceworker?: boolean;
            /**
             * ShellJS global variables
             */
            shelljs?: boolean;
            /**
             * WebExtensions globals
             */
            webextensions?: boolean;
            /**
             * web workers global variables
             */
            worker?: boolean;
        };
        /**
         * If you want to extend a specific configuration file, you can use the extends property and specify the path to the file. The path can be either relative or absolute.
         */
        extends?: string | string[];
        /**
         * Set each global variable name equal to true to allow the variable to be overwritten or false to disallow overwriting.
         */
        globals?: {
            [name: string]: boolean;
        };
        /**
         * A list of file paths/globs that eslint should ignore
         */
        ignore?: string[];
        parser?: string;
        /**
         * The JavaScript language options to be supported
         */
        parserOptions?: {
            ecmaFeatures?: Eslintrc.Properties.EcmaFeatures;
            /**
             * Set to 3, 5 (default), 6, 7, or 8 to specify the version of ECMAScript you want to use. Alternatively, set to 2015 (same as 6), 2016 (same as 7), or 2017 (same as 8) to use year-based naming.
             */
            ecmaVersion?: "3" | "5" | "6" | "2015" | "7" | "2016" | "8" | "2017";
            /**
             * set to "script" (default) or "module" if your code is in ECMAScript modules
             */
            sourceType?: "script" | "module";
        };
        /**
         * ESLint supports the use of third-party plugins. Before using the plugin, you have to install it using npm.
         */
        plugins?: string[];
        /**
         * ESLint comes with a large number of rules. You can modify which rules your project uses either using configuration comments or configuration files.
         */
        rules?: {
            /**
             * Require or disallow trailing commas
             */
            "comma-dangle"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow assignment operators in conditional expressions
             */
            "no-cond-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of console
             */
            "no-console"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow constant expressions in conditions
             */
            "no-constant-condition"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow control characters in regular expressions
             */
            "no-control-regex"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of debugger
             */
            "no-debugger"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow duplicate arguments in function definitions
             */
            "no-dupe-args"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow duplicate keys in object literals
             */
            "no-dupe-keys"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow duplicate case labels
             */
            "no-duplicate-case"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow empty block statements
             */
            "no-empty"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow empty character classes in regular expressions
             */
            "no-empty-character-class"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow reassigning exceptions in catch clauses
             */
            "no-ex-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary boolean casts
             */
            "no-extra-boolean-cast"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary parentheses
             */
            "no-extra-parens"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary semicolons
             */
            "no-extra-semi"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow reassigning function declarations
             */
            "no-func-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow function or var declarations in nested blocks
             */
            "no-inner-declarations"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow invalid regular expression strings in RegExp constructors
             */
            "no-invalid-regexp"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow irregular whitespace outside of strings and comments
             */
            "no-irregular-whitespace"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow negating the left operand in in expressions (deprecated)
             */
            "no-negated-in-lhs"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow calling global object properties as functions
             */
            "no-obj-calls"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow calling some Object.prototype methods directly on objects
             */
            "no-prototype-builtins"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow multiple spaces in regular expressions
             */
            "no-regex-spaces"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow sparse arrays
             */
            "no-sparse-arrays"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow template literal placeholder syntax in regular strings
             */
            "no-template-curly-in-string"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow confusing multiline expressions
             */
            "no-unexpected-multiline"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unreachable code after return, throw, continue, and break statements
             */
            "no-unreachable"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow control flow statements in finally blocks
             */
            "no-unsafe-finally"?: any;
            /**
             * Disallow negating the left operand of relational operators
             */
            "no-unsafe-negation"?: Eslintrc.Definitions.Rule;
            /**
             * Require calls to isNaN() when checking for NaN
             */
            "use-isnan"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce valid JSDoc comments
             */
            "valid-jsdoc"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce comparing typeof expressions against valid strings
             */
            "valid-typeof"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce getter and setter pairs in objects
             */
            "accessor-pairs"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce return statements in callbacks of array methods
             */
            "array-callback-return"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce the use of variables within the scope they are defined
             */
            "block-scoped-var"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce a maximum cyclomatic complexity allowed in a program
             */
            complexity?: Eslintrc.Definitions.Rule;
            /**
             * Require return statements to either always or never specify values
             */
            "consistent-return"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent brace style for all control statements
             */
            curly?: Eslintrc.Definitions.Rule;
            /**
             * Require default cases in switch statements
             */
            "default-case"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent newlines before and after dots
             */
            "dot-location"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce dot notation whenever possible
             */
            "dot-notation"?: Eslintrc.Definitions.Rule;
            /**
             * Require the use of === and !==
             */
            eqeqeq?: Eslintrc.Definitions.Rule;
            /**
             * Require for-in loops to include an if statement
             */
            "guard-for-in"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of alert, confirm, and prompt
             */
            "no-alert"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of arguments.caller or arguments.callee
             */
            "no-caller"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow lexical declarations in case clauses
             */
            "no-case-declarations"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow division operators explicitly at the beginning of regular expressions
             */
            "no-div-regex"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow else blocks after return statements in if statements
             */
            "no-else-return"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow empty functions
             */
            "no-empty-function"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow empty destructuring patterns
             */
            "no-empty-pattern"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow null comparisons without type-checking operators
             */
            "no-eq-null"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of eval()
             */
            "no-eval"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow extending native types
             */
            "no-extend-native"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary calls to .bind()
             */
            "no-extra-bind"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary labels
             */
            "no-extra-label"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow fallthrough of case statements
             */
            "no-fallthrough"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow leading or trailing decimal points in numeric literals
             */
            "no-floating-decimal"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow assignments to native objects or read-only global variables
             */
            "no-global-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow shorthand type conversions
             */
            "no-implicit-coercion"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow var and named function declarations in the global scope
             */
            "no-implicit-globals"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of eval()-like methods
             */
            "no-implied-eval"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow this keywords outside of classes or class-like objects
             */
            "no-invalid-this"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of the __iterator__ property
             */
            "no-iterator"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow labeled statements
             */
            "no-labels"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary nested blocks
             */
            "no-lone-blocks"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow function declarations and expressions inside loop statements
             */
            "no-loop-func"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow magic numbers
             */
            "no-magic-numbers"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow multiple spaces
             */
            "no-multi-spaces"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow multiline strings
             */
            "no-multi-str"?: Eslintrc.Definitions.Rule;
            "no-native-reassign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow new operators outside of assignments or comparisons
             */
            "no-new"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow new operators with the Function object
             */
            "no-new-func"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow new operators with the String, Number, and Boolean objects
             */
            "no-new-wrappers"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow octal literals
             */
            "no-octal"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow octal escape sequences in string literals
             */
            "no-octal-escape"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow reassigning function parameters
             */
            "no-param-reassign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of the __proto__ property
             */
            "no-proto"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow var redeclaration
             */
            "no-redeclare"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow assignment operators in return statements
             */
            "no-return-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow javascript: urls
             */
            "no-script-url"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow assignments where both sides are exactly the same
             */
            "no-self-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow comparisons where both sides are exactly the same
             */
            "no-self-compare"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow comma operators
             */
            "no-sequences"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow throwing literals as exceptions
             */
            "no-throw-literal"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unmodified loop conditions
             */
            "no-unmodified-loop-condition"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unused expressions
             */
            "no-unused-expressions"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unused labels
             */
            "no-unused-labels"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary calls to .call() and .apply()
             */
            "no-useless-call"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary concatenation of literals or template literals
             */
            "no-useless-concat"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary escape characters
             */
            "no-useless-escape"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow void operators
             */
            "no-void"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified warning terms in comments
             */
            "no-warning-comments"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow with statements
             */
            "no-with"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce the consistent use of the radix argument when using parseInt()
             */
            radix?: Eslintrc.Definitions.Rule;
            /**
             * Disallow async functions which have no await expression
             */
            "require-await"?: Eslintrc.Definitions.Rule;
            /**
             * Require var declarations be placed at the top of their containing scope
             */
            "vars-on-top"?: Eslintrc.Definitions.Rule;
            /**
             * Require parentheses around immediate function invocations
             */
            "wrap-iife"?: Eslintrc.Definitions.Rule;
            /**
             * Require or Disallow “Yoda” conditions
             */
            yoda?: Eslintrc.Definitions.Rule;
            /**
             * require or disallow strict mode directives
             */
            strict?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow initialization in var declarations
             */
            "init-declarations"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow catch clause parameters from shadowing variables in the outer scope
             */
            "no-catch-shadow"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow deleting variables
             */
            "no-delete-var"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow labels that share a name with a variable
             */
            "no-label-var"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified global variables
             */
            "no-restricted-globals"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow var declarations from shadowing variables in the outer scope
             */
            "no-shadow"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow identifiers from shadowing restricted names
             */
            "no-shadow-restricted-names"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of undeclared variables unless mentioned in /*global *​/ comments
             */
            "no-undef"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of undefined as an identifier
             */
            "no-undefined"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow initializing variables to undefined
             */
            "no-undef-init"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unused variables
             */
            "no-unused-vars"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of variables before they are defined
             */
            "no-use-before-define"?: Eslintrc.Definitions.Rule;
            /**
             * Require return statements after callbacks
             */
            "callback-return"?: Eslintrc.Definitions.Rule;
            /**
             * Require require() calls to be placed at top-level module scope
             */
            "global-require"?: Eslintrc.Definitions.Rule;
            /**
             * Require error handling in callbacks
             */
            "handle-callback-err"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow require calls to be mixed with regular var declarations
             */
            "no-mixed-requires"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow new operators with calls to require
             */
            "no-new-require"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow string concatenation with __dirname and __filename
             */
            "no-path-concat"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of process.env
             */
            "no-process-env"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow the use of process.exit()
             */
            "no-process-exit"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified modules when loaded by require
             */
            "no-restricted-modules"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow synchronous methods
             */
            "no-sync"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing inside array brackets
             */
            "array-bracket-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing inside single-line blocks
             */
            "block-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent brace style for blocks
             */
            "brace-style"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce camelcase naming convention
             */
            camelcase?: Eslintrc.Definitions.Rule;
            /**
             * Enforce or disallow capitalization of the first letter of a comment
             */
            "capitalized-comments"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before and after commas
             */
            "comma-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent comma style
             */
            "comma-style"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing inside computed property brackets
             */
            "computed-property-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent naming when capturing the current execution context
             */
            "consistent-this"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce at least one newline at the end of files
             */
            "eol-last"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow spacing between function identifiers and their invocations
             */
            "func-call-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow named function expressions
             */
            "func-names"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce the consistent use of either function declarations or expressions
             */
            "func-style"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified identifiers
             */
            "id-blacklist"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce minimum and maximum identifier lengths
             */
            "id-length"?: Eslintrc.Definitions.Rule;
            /**
             * Require identifiers to match a specified regular expression
             */
            "id-match"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent indentation
             */
            indent?: Eslintrc.Definitions.Rule;
            /**
             * Enforce the consistent use of either double or single quotes in JSX attributes
             */
            "jsx-quotes"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing between keys and values in object literal properties
             */
            "key-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before and after keywords
             */
            "keyword-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent linebreak style
             */
            "linebreak-style"?: Eslintrc.Definitions.Rule;
            /**
             * Require empty lines around comments
             */
            "lines-around-comment"?: Eslintrc.Definitions.Rule;
            "max-depth"?: Eslintrc.Definitions.Rule;
            "max-len"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce a maximum number of lines per file
             */
            "max-lines"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce a maximum depth that callbacks can be nested
             */
            "max-nested-callbacks"?: Eslintrc.Definitions.Rule;
            "max-params"?: Eslintrc.Definitions.Rule;
            "max-statements"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce a maximum number of statements allowed per line
             */
            "max-statements-per-line"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce newlines between operands of ternary expressions
             */
            "multiline-ternary"?: Eslintrc.Definitions.Rule;
            /**
             * Require constructor function names to begin with a capital letter
             */
            "new-cap"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow an empty line after var declarations
             */
            "newline-after-var"?: Eslintrc.Definitions.Rule;
            /**
             * Require an empty line before return statements
             */
            "newline-before-return"?: Eslintrc.Definitions.Rule;
            /**
             * Require a newline after each call in a method chain
             */
            "newline-per-chained-call"?: Eslintrc.Definitions.Rule;
            /**
             * Require parentheses when invoking a constructor with no arguments
             */
            "new-parens"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow Array constructors
             */
            "no-array-constructor"?: Eslintrc.Definitions.Rule;
            "no-bitwise"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow continue statements
             */
            "no-continue"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow inline comments after code
             */
            "no-inline-comments"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow if statements as the only statement in else blocks
             */
            "no-lonely-if"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow mixed binary operators
             */
            "no-mixed-operators"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow mixed spaces and tabs for indentation
             */
            "no-mixed-spaces-and-tabs"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow multiple empty lines
             */
            "no-multiple-empty-lines"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow negated conditions
             */
            "no-negated-condition"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow nested ternary expressions
             */
            "no-nested-ternary"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow Object constructors
             */
            "no-new-object"?: Eslintrc.Definitions.Rule;
            "no-plusplus"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified syntax
             */
            "no-restricted-syntax"?: Eslintrc.Definitions.Rule;
            "no-spaced-func"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow tabs in file
             */
            "no-tabs"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow ternary operators
             */
            "no-ternary"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow trailing whitespace at the end of lines
             */
            "no-trailing-spaces"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow dangling underscores in identifiers
             */
            "no-underscore-dangle"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow ternary operators when simpler alternatives exist
             */
            "no-unneeded-ternary"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow whitespace before properties
             */
            "no-whitespace-before-property"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent line breaks inside braces
             */
            "object-curly-newline"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing inside braces
             */
            "object-curly-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce placing object properties on separate lines
             */
            "object-property-newline"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow method and property shorthand syntax for object literals
             */
            "object-shorthand"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce variables to be declared either together or separately in functions
             */
            "one-var"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow newlines around var declarations
             */
            "one-var-declaration-per-line"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow assignment operator shorthand where possible
             */
            "operator-assignment"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent linebreak style for operators
             */
            "operator-linebreak"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow padding within blocks
             */
            "padded-blocks"?: Eslintrc.Definitions.Rule;
            /**
             * Require quotes around object literal property names
             */
            "quote-props"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce the consistent use of either backticks, double, or single quotes
             */
            quotes?: Eslintrc.Definitions.Rule;
            /**
             * Require JSDoc comments
             */
            "Require-jsdoc"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow semicolons instead of ASI
             */
            semi?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before and after semicolons
             */
            "semi-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Requires object keys to be sorted
             */
            "sort-keys"?: Eslintrc.Definitions.Rule;
            /**
             * Require variables within the same declaration block to be sorted
             */
            "sort-vars"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before blocks
             */
            "space-before-blocks"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before function definition opening parenthesis
             */
            "space-before-function-paren"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing after the // or /* in a comment
             */
            "spaced-comment"?: Eslintrc.Definitions.Rule;
            /**
             * Require spacing around operators
             */
            "space-infix-ops"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing inside parentheses
             */
            "space-in-parens"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before or after unary operators
             */
            "space-unary-ops"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow Unicode byte order mark (BOM)
             */
            "unicode-bom"?: Eslintrc.Definitions.Rule;
            /**
             * Require parenthesis around regex literals
             */
            "wrap-regex"?: Eslintrc.Definitions.Rule;
            /**
             * Require braces around arrow function bodies
             */
            "arrow-body-style"?: Eslintrc.Definitions.Rule;
            /**
             * Require parentheses around arrow function arguments
             */
            "arrow-parens"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing before and after the arrow in arrow functions
             */
            "arrow-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Require super() calls in constructors
             */
            "constructor-super"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce consistent spacing around * operators in generator functions
             */
            "generator-star-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow reassigning class members
             */
            "no-class-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow arrow functions where they could be confused with comparisons
             */
            "no-confusing-arrow"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow reassigning const variables
             */
            "no-const-assign"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow duplicate class members
             */
            "no-dupe-class-members"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow duplicate module imports
             */
            "no-duplicate-imports"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow new operators with the Symbol object
             */
            "no-new-symbol"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow specified modules when loaded by import
             */
            "no-restricted-imports"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow this/super before calling super() in constructors
             */
            "no-this-before-super"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary computed property keys in object literals
             */
            "no-useless-computed-key"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow unnecessary constructors
             */
            "no-useless-constructor"?: Eslintrc.Definitions.Rule;
            /**
             * Disallow renaming import, export, and destructured assignments to the same name
             */
            "no-useless-rename"?: Eslintrc.Definitions.Rule;
            /**
             * Require let or const instead of var
             */
            "no-var"?: Eslintrc.Definitions.Rule;
            /**
             * Require arrow functions as callbacks
             */
            "prefer-arrow-callback"?: Eslintrc.Definitions.Rule;
            /**
             * Require const declarations for variables that are never reassigned after declared
             */
            "prefer-const"?: Eslintrc.Definitions.Rule;
            /**
             * Require Reflect methods where applicable
             */
            "prefer-reflect"?: Eslintrc.Definitions.Rule;
            /**
             * Require rest parameters instead of arguments
             */
            "prefer-rest-params"?: Eslintrc.Definitions.Rule;
            /**
             * Require spread operators instead of .apply()
             */
            "prefer-spread"?: Eslintrc.Definitions.Rule;
            /**
             * Require template literals instead of string concatenation
             */
            "prefer-template"?: Eslintrc.Definitions.Rule;
            /**
             * Require generator functions to contain yield
             */
            "Require-yield"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce spacing between rest and spread operators and their expressions
             */
            "rest-spread-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Enforce sorted import declarations within modules
             */
            "sort-imports"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow spacing around embedded expressions of template strings
             */
            "template-curly-spacing"?: Eslintrc.Definitions.Rule;
            /**
             * Require or disallow spacing around the * in yield* expressions
             */
            "yield-star-spacing"?: Eslintrc.Definitions.Rule;
        };
        /**
         * ESLint supports adding shared settings into configuration file. You can add settings object to ESLint configuration file and it will be supplied to every rule that will be executed. This may be useful if you are adding custom rules and want them to have access to the same information and be easily configurable.
         */
        settings?: {
        };
    }
    namespace Eslintrc {
        namespace Definitions {
            export interface BestPractices {
                /**
                 * Enforce getter and setter pairs in objects
                 */
                "accessor-pairs"?: Rule;
                /**
                 * Enforce return statements in callbacks of array methods
                 */
                "array-callback-return"?: Rule;
                /**
                 * Enforce the use of variables within the scope they are defined
                 */
                "block-scoped-var"?: Rule;
                /**
                 * Enforce a maximum cyclomatic complexity allowed in a program
                 */
                complexity?: Rule;
                /**
                 * Require return statements to either always or never specify values
                 */
                "consistent-return"?: Rule;
                /**
                 * Enforce consistent brace style for all control statements
                 */
                curly?: Rule;
                /**
                 * Require default cases in switch statements
                 */
                "default-case"?: Rule;
                /**
                 * Enforce consistent newlines before and after dots
                 */
                "dot-location"?: Rule;
                /**
                 * Enforce dot notation whenever possible
                 */
                "dot-notation"?: Rule;
                /**
                 * Require the use of === and !==
                 */
                eqeqeq?: Rule;
                /**
                 * Require for-in loops to include an if statement
                 */
                "guard-for-in"?: Rule;
                /**
                 * Disallow the use of alert, confirm, and prompt
                 */
                "no-alert"?: Rule;
                /**
                 * Disallow the use of arguments.caller or arguments.callee
                 */
                "no-caller"?: Rule;
                /**
                 * Disallow lexical declarations in case clauses
                 */
                "no-case-declarations"?: Rule;
                /**
                 * Disallow division operators explicitly at the beginning of regular expressions
                 */
                "no-div-regex"?: Rule;
                /**
                 * Disallow else blocks after return statements in if statements
                 */
                "no-else-return"?: Rule;
                /**
                 * Disallow empty functions
                 */
                "no-empty-function"?: Rule;
                /**
                 * Disallow empty destructuring patterns
                 */
                "no-empty-pattern"?: Rule;
                /**
                 * Disallow null comparisons without type-checking operators
                 */
                "no-eq-null"?: Rule;
                /**
                 * Disallow the use of eval()
                 */
                "no-eval"?: Rule;
                /**
                 * Disallow extending native types
                 */
                "no-extend-native"?: Rule;
                /**
                 * Disallow unnecessary calls to .bind()
                 */
                "no-extra-bind"?: Rule;
                /**
                 * Disallow unnecessary labels
                 */
                "no-extra-label"?: Rule;
                /**
                 * Disallow fallthrough of case statements
                 */
                "no-fallthrough"?: Rule;
                /**
                 * Disallow leading or trailing decimal points in numeric literals
                 */
                "no-floating-decimal"?: Rule;
                /**
                 * Disallow assignments to native objects or read-only global variables
                 */
                "no-global-assign"?: Rule;
                /**
                 * Disallow shorthand type conversions
                 */
                "no-implicit-coercion"?: Rule;
                /**
                 * Disallow var and named function declarations in the global scope
                 */
                "no-implicit-globals"?: Rule;
                /**
                 * Disallow the use of eval()-like methods
                 */
                "no-implied-eval"?: Rule;
                /**
                 * Disallow this keywords outside of classes or class-like objects
                 */
                "no-invalid-this"?: Rule;
                /**
                 * Disallow the use of the __iterator__ property
                 */
                "no-iterator"?: Rule;
                /**
                 * Disallow labeled statements
                 */
                "no-labels"?: Rule;
                /**
                 * Disallow unnecessary nested blocks
                 */
                "no-lone-blocks"?: Rule;
                /**
                 * Disallow function declarations and expressions inside loop statements
                 */
                "no-loop-func"?: Rule;
                /**
                 * Disallow magic numbers
                 */
                "no-magic-numbers"?: Rule;
                /**
                 * Disallow multiple spaces
                 */
                "no-multi-spaces"?: Rule;
                /**
                 * Disallow multiline strings
                 */
                "no-multi-str"?: Rule;
                "no-native-reassign"?: Rule;
                /**
                 * Disallow new operators outside of assignments or comparisons
                 */
                "no-new"?: Rule;
                /**
                 * Disallow new operators with the Function object
                 */
                "no-new-func"?: Rule;
                /**
                 * Disallow new operators with the String, Number, and Boolean objects
                 */
                "no-new-wrappers"?: Rule;
                /**
                 * Disallow octal literals
                 */
                "no-octal"?: Rule;
                /**
                 * Disallow octal escape sequences in string literals
                 */
                "no-octal-escape"?: Rule;
                /**
                 * Disallow reassigning function parameters
                 */
                "no-param-reassign"?: Rule;
                /**
                 * Disallow the use of the __proto__ property
                 */
                "no-proto"?: Rule;
                /**
                 * Disallow var redeclaration
                 */
                "no-redeclare"?: Rule;
                /**
                 * Disallow assignment operators in return statements
                 */
                "no-return-assign"?: Rule;
                /**
                 * Disallow javascript: urls
                 */
                "no-script-url"?: Rule;
                /**
                 * Disallow assignments where both sides are exactly the same
                 */
                "no-self-assign"?: Rule;
                /**
                 * Disallow comparisons where both sides are exactly the same
                 */
                "no-self-compare"?: Rule;
                /**
                 * Disallow comma operators
                 */
                "no-sequences"?: Rule;
                /**
                 * Disallow throwing literals as exceptions
                 */
                "no-throw-literal"?: Rule;
                /**
                 * Disallow unmodified loop conditions
                 */
                "no-unmodified-loop-condition"?: Rule;
                /**
                 * Disallow unused expressions
                 */
                "no-unused-expressions"?: Rule;
                /**
                 * Disallow unused labels
                 */
                "no-unused-labels"?: Rule;
                /**
                 * Disallow unnecessary calls to .call() and .apply()
                 */
                "no-useless-call"?: Rule;
                /**
                 * Disallow unnecessary concatenation of literals or template literals
                 */
                "no-useless-concat"?: Rule;
                /**
                 * Disallow unnecessary escape characters
                 */
                "no-useless-escape"?: Rule;
                /**
                 * Disallow void operators
                 */
                "no-void"?: Rule;
                /**
                 * Disallow specified warning terms in comments
                 */
                "no-warning-comments"?: Rule;
                /**
                 * Disallow with statements
                 */
                "no-with"?: Rule;
                /**
                 * Enforce the consistent use of the radix argument when using parseInt()
                 */
                radix?: Rule;
                /**
                 * Disallow async functions which have no await expression
                 */
                "require-await"?: Rule;
                /**
                 * Require var declarations be placed at the top of their containing scope
                 */
                "vars-on-top"?: Rule;
                /**
                 * Require parentheses around immediate function invocations
                 */
                "wrap-iife"?: Rule;
                /**
                 * Require or Disallow “Yoda” conditions
                 */
                yoda?: Rule;
            }
            export interface EcmaScript6 {
                /**
                 * Require braces around arrow function bodies
                 */
                "arrow-body-style"?: Rule;
                /**
                 * Require parentheses around arrow function arguments
                 */
                "arrow-parens"?: Rule;
                /**
                 * Enforce consistent spacing before and after the arrow in arrow functions
                 */
                "arrow-spacing"?: Rule;
                /**
                 * Require super() calls in constructors
                 */
                "constructor-super"?: Rule;
                /**
                 * Enforce consistent spacing around * operators in generator functions
                 */
                "generator-star-spacing"?: Rule;
                /**
                 * Disallow reassigning class members
                 */
                "no-class-assign"?: Rule;
                /**
                 * Disallow arrow functions where they could be confused with comparisons
                 */
                "no-confusing-arrow"?: Rule;
                /**
                 * Disallow reassigning const variables
                 */
                "no-const-assign"?: Rule;
                /**
                 * Disallow duplicate class members
                 */
                "no-dupe-class-members"?: Rule;
                /**
                 * Disallow duplicate module imports
                 */
                "no-duplicate-imports"?: Rule;
                /**
                 * Disallow new operators with the Symbol object
                 */
                "no-new-symbol"?: Rule;
                /**
                 * Disallow specified modules when loaded by import
                 */
                "no-restricted-imports"?: Rule;
                /**
                 * Disallow this/super before calling super() in constructors
                 */
                "no-this-before-super"?: Rule;
                /**
                 * Disallow unnecessary computed property keys in object literals
                 */
                "no-useless-computed-key"?: Rule;
                /**
                 * Disallow unnecessary constructors
                 */
                "no-useless-constructor"?: Rule;
                /**
                 * Disallow renaming import, export, and destructured assignments to the same name
                 */
                "no-useless-rename"?: Rule;
                /**
                 * Require let or const instead of var
                 */
                "no-var"?: Rule;
                /**
                 * Require or disallow method and property shorthand syntax for object literals
                 */
                "object-shorthand"?: Rule;
                /**
                 * Require arrow functions as callbacks
                 */
                "prefer-arrow-callback"?: Rule;
                /**
                 * Require const declarations for variables that are never reassigned after declared
                 */
                "prefer-const"?: Rule;
                /**
                 * Require Reflect methods where applicable
                 */
                "prefer-reflect"?: Rule;
                /**
                 * Require rest parameters instead of arguments
                 */
                "prefer-rest-params"?: Rule;
                /**
                 * Require spread operators instead of .apply()
                 */
                "prefer-spread"?: Rule;
                /**
                 * Require template literals instead of string concatenation
                 */
                "prefer-template"?: Rule;
                /**
                 * Require generator functions to contain yield
                 */
                "Require-yield"?: Rule;
                /**
                 * Enforce spacing between rest and spread operators and their expressions
                 */
                "rest-spread-spacing"?: Rule;
                /**
                 * Enforce sorted import declarations within modules
                 */
                "sort-imports"?: Rule;
                /**
                 * Require or disallow spacing around embedded expressions of template strings
                 */
                "template-curly-spacing"?: Rule;
                /**
                 * Require or disallow spacing around the * in yield* expressions
                 */
                "yield-star-spacing"?: Rule;
            }
            export interface Legacy {
                "max-depth"?: Rule;
                "max-len"?: Rule;
                "max-params"?: Rule;
                "max-statements"?: Rule;
                "no-bitwise"?: Rule;
                "no-plusplus"?: Rule;
            }
            export interface NodeAndCommonJs {
                /**
                 * Require return statements after callbacks
                 */
                "callback-return"?: Rule;
                /**
                 * Require require() calls to be placed at top-level module scope
                 */
                "global-require"?: Rule;
                /**
                 * Require error handling in callbacks
                 */
                "handle-callback-err"?: Rule;
                /**
                 * Disallow require calls to be mixed with regular var declarations
                 */
                "no-mixed-requires"?: Rule;
                /**
                 * Disallow new operators with calls to require
                 */
                "no-new-require"?: Rule;
                /**
                 * Disallow string concatenation with __dirname and __filename
                 */
                "no-path-concat"?: Rule;
                /**
                 * Disallow the use of process.env
                 */
                "no-process-env"?: Rule;
                /**
                 * Disallow the use of process.exit()
                 */
                "no-process-exit"?: Rule;
                /**
                 * Disallow specified modules when loaded by require
                 */
                "no-restricted-modules"?: Rule;
                /**
                 * Disallow synchronous methods
                 */
                "no-sync"?: Rule;
            }
            export interface PossibleErrors {
                /**
                 * Require or disallow trailing commas
                 */
                "comma-dangle"?: Rule;
                /**
                 * Disallow assignment operators in conditional expressions
                 */
                "no-cond-assign"?: Rule;
                /**
                 * Disallow the use of console
                 */
                "no-console"?: Rule;
                /**
                 * Disallow constant expressions in conditions
                 */
                "no-constant-condition"?: Rule;
                /**
                 * Disallow control characters in regular expressions
                 */
                "no-control-regex"?: Rule;
                /**
                 * Disallow the use of debugger
                 */
                "no-debugger"?: Rule;
                /**
                 * Disallow duplicate arguments in function definitions
                 */
                "no-dupe-args"?: Rule;
                /**
                 * Disallow duplicate keys in object literals
                 */
                "no-dupe-keys"?: Rule;
                /**
                 * Disallow duplicate case labels
                 */
                "no-duplicate-case"?: Rule;
                /**
                 * Disallow empty block statements
                 */
                "no-empty"?: Rule;
                /**
                 * Disallow empty character classes in regular expressions
                 */
                "no-empty-character-class"?: Rule;
                /**
                 * Disallow reassigning exceptions in catch clauses
                 */
                "no-ex-assign"?: Rule;
                /**
                 * Disallow unnecessary boolean casts
                 */
                "no-extra-boolean-cast"?: Rule;
                /**
                 * Disallow unnecessary parentheses
                 */
                "no-extra-parens"?: Rule;
                /**
                 * Disallow unnecessary semicolons
                 */
                "no-extra-semi"?: Rule;
                /**
                 * Disallow reassigning function declarations
                 */
                "no-func-assign"?: Rule;
                /**
                 * Disallow function or var declarations in nested blocks
                 */
                "no-inner-declarations"?: Rule;
                /**
                 * Disallow invalid regular expression strings in RegExp constructors
                 */
                "no-invalid-regexp"?: Rule;
                /**
                 * Disallow irregular whitespace outside of strings and comments
                 */
                "no-irregular-whitespace"?: Rule;
                /**
                 * Disallow negating the left operand in in expressions (deprecated)
                 */
                "no-negated-in-lhs"?: Rule;
                /**
                 * Disallow calling global object properties as functions
                 */
                "no-obj-calls"?: Rule;
                /**
                 * Disallow calling some Object.prototype methods directly on objects
                 */
                "no-prototype-builtins"?: Rule;
                /**
                 * Disallow multiple spaces in regular expressions
                 */
                "no-regex-spaces"?: Rule;
                /**
                 * Disallow sparse arrays
                 */
                "no-sparse-arrays"?: Rule;
                /**
                 * Disallow template literal placeholder syntax in regular strings
                 */
                "no-template-curly-in-string"?: Rule;
                /**
                 * Disallow confusing multiline expressions
                 */
                "no-unexpected-multiline"?: Rule;
                /**
                 * Disallow unreachable code after return, throw, continue, and break statements
                 */
                "no-unreachable"?: Rule;
                /**
                 * Disallow control flow statements in finally blocks
                 */
                "no-unsafe-finally"?: any;
                /**
                 * Disallow negating the left operand of relational operators
                 */
                "no-unsafe-negation"?: Rule;
                /**
                 * Require calls to isNaN() when checking for NaN
                 */
                "use-isnan"?: Rule;
                /**
                 * Enforce valid JSDoc comments
                 */
                "valid-jsdoc"?: Rule;
                /**
                 * Enforce comparing typeof expressions against valid strings
                 */
                "valid-typeof"?: Rule;
                /**
                 * Enforce getter and setter pairs in objects
                 */
                "accessor-pairs"?: Rule;
                /**
                 * Enforce return statements in callbacks of array methods
                 */
                "array-callback-return"?: Rule;
                /**
                 * Enforce the use of variables within the scope they are defined
                 */
                "block-scoped-var"?: Rule;
                /**
                 * Enforce a maximum cyclomatic complexity allowed in a program
                 */
                complexity?: Rule;
                /**
                 * Require return statements to either always or never specify values
                 */
                "consistent-return"?: Rule;
                /**
                 * Enforce consistent brace style for all control statements
                 */
                curly?: Rule;
                /**
                 * Require default cases in switch statements
                 */
                "default-case"?: Rule;
                /**
                 * Enforce consistent newlines before and after dots
                 */
                "dot-location"?: Rule;
                /**
                 * Enforce dot notation whenever possible
                 */
                "dot-notation"?: Rule;
                /**
                 * Require the use of === and !==
                 */
                eqeqeq?: Rule;
                /**
                 * Require for-in loops to include an if statement
                 */
                "guard-for-in"?: Rule;
                /**
                 * Disallow the use of alert, confirm, and prompt
                 */
                "no-alert"?: Rule;
                /**
                 * Disallow the use of arguments.caller or arguments.callee
                 */
                "no-caller"?: Rule;
                /**
                 * Disallow lexical declarations in case clauses
                 */
                "no-case-declarations"?: Rule;
                /**
                 * Disallow division operators explicitly at the beginning of regular expressions
                 */
                "no-div-regex"?: Rule;
                /**
                 * Disallow else blocks after return statements in if statements
                 */
                "no-else-return"?: Rule;
                /**
                 * Disallow empty functions
                 */
                "no-empty-function"?: Rule;
                /**
                 * Disallow empty destructuring patterns
                 */
                "no-empty-pattern"?: Rule;
                /**
                 * Disallow null comparisons without type-checking operators
                 */
                "no-eq-null"?: Rule;
                /**
                 * Disallow the use of eval()
                 */
                "no-eval"?: Rule;
                /**
                 * Disallow extending native types
                 */
                "no-extend-native"?: Rule;
                /**
                 * Disallow unnecessary calls to .bind()
                 */
                "no-extra-bind"?: Rule;
                /**
                 * Disallow unnecessary labels
                 */
                "no-extra-label"?: Rule;
                /**
                 * Disallow fallthrough of case statements
                 */
                "no-fallthrough"?: Rule;
                /**
                 * Disallow leading or trailing decimal points in numeric literals
                 */
                "no-floating-decimal"?: Rule;
                /**
                 * Disallow assignments to native objects or read-only global variables
                 */
                "no-global-assign"?: Rule;
                /**
                 * Disallow shorthand type conversions
                 */
                "no-implicit-coercion"?: Rule;
                /**
                 * Disallow var and named function declarations in the global scope
                 */
                "no-implicit-globals"?: Rule;
                /**
                 * Disallow the use of eval()-like methods
                 */
                "no-implied-eval"?: Rule;
                /**
                 * Disallow this keywords outside of classes or class-like objects
                 */
                "no-invalid-this"?: Rule;
                /**
                 * Disallow the use of the __iterator__ property
                 */
                "no-iterator"?: Rule;
                /**
                 * Disallow labeled statements
                 */
                "no-labels"?: Rule;
                /**
                 * Disallow unnecessary nested blocks
                 */
                "no-lone-blocks"?: Rule;
                /**
                 * Disallow function declarations and expressions inside loop statements
                 */
                "no-loop-func"?: Rule;
                /**
                 * Disallow magic numbers
                 */
                "no-magic-numbers"?: Rule;
                /**
                 * Disallow multiple spaces
                 */
                "no-multi-spaces"?: Rule;
                /**
                 * Disallow multiline strings
                 */
                "no-multi-str"?: Rule;
                "no-native-reassign"?: Rule;
                /**
                 * Disallow new operators outside of assignments or comparisons
                 */
                "no-new"?: Rule;
                /**
                 * Disallow new operators with the Function object
                 */
                "no-new-func"?: Rule;
                /**
                 * Disallow new operators with the String, Number, and Boolean objects
                 */
                "no-new-wrappers"?: Rule;
                /**
                 * Disallow octal literals
                 */
                "no-octal"?: Rule;
                /**
                 * Disallow octal escape sequences in string literals
                 */
                "no-octal-escape"?: Rule;
                /**
                 * Disallow reassigning function parameters
                 */
                "no-param-reassign"?: Rule;
                /**
                 * Disallow the use of the __proto__ property
                 */
                "no-proto"?: Rule;
                /**
                 * Disallow var redeclaration
                 */
                "no-redeclare"?: Rule;
                /**
                 * Disallow assignment operators in return statements
                 */
                "no-return-assign"?: Rule;
                /**
                 * Disallow javascript: urls
                 */
                "no-script-url"?: Rule;
                /**
                 * Disallow assignments where both sides are exactly the same
                 */
                "no-self-assign"?: Rule;
                /**
                 * Disallow comparisons where both sides are exactly the same
                 */
                "no-self-compare"?: Rule;
                /**
                 * Disallow comma operators
                 */
                "no-sequences"?: Rule;
                /**
                 * Disallow throwing literals as exceptions
                 */
                "no-throw-literal"?: Rule;
                /**
                 * Disallow unmodified loop conditions
                 */
                "no-unmodified-loop-condition"?: Rule;
                /**
                 * Disallow unused expressions
                 */
                "no-unused-expressions"?: Rule;
                /**
                 * Disallow unused labels
                 */
                "no-unused-labels"?: Rule;
                /**
                 * Disallow unnecessary calls to .call() and .apply()
                 */
                "no-useless-call"?: Rule;
                /**
                 * Disallow unnecessary concatenation of literals or template literals
                 */
                "no-useless-concat"?: Rule;
                /**
                 * Disallow unnecessary escape characters
                 */
                "no-useless-escape"?: Rule;
                /**
                 * Disallow void operators
                 */
                "no-void"?: Rule;
                /**
                 * Disallow specified warning terms in comments
                 */
                "no-warning-comments"?: Rule;
                /**
                 * Disallow with statements
                 */
                "no-with"?: Rule;
                /**
                 * Enforce the consistent use of the radix argument when using parseInt()
                 */
                radix?: Rule;
                /**
                 * Disallow async functions which have no await expression
                 */
                "require-await"?: Rule;
                /**
                 * Require var declarations be placed at the top of their containing scope
                 */
                "vars-on-top"?: Rule;
                /**
                 * Require parentheses around immediate function invocations
                 */
                "wrap-iife"?: Rule;
                /**
                 * Require or Disallow “Yoda” conditions
                 */
                yoda?: Rule;
                /**
                 * require or disallow strict mode directives
                 */
                strict?: Rule;
                /**
                 * Require or disallow initialization in var declarations
                 */
                "init-declarations"?: Rule;
                /**
                 * Disallow catch clause parameters from shadowing variables in the outer scope
                 */
                "no-catch-shadow"?: Rule;
                /**
                 * Disallow deleting variables
                 */
                "no-delete-var"?: Rule;
                /**
                 * Disallow labels that share a name with a variable
                 */
                "no-label-var"?: Rule;
                /**
                 * Disallow specified global variables
                 */
                "no-restricted-globals"?: Rule;
                /**
                 * Disallow var declarations from shadowing variables in the outer scope
                 */
                "no-shadow"?: Rule;
                /**
                 * Disallow identifiers from shadowing restricted names
                 */
                "no-shadow-restricted-names"?: Rule;
                /**
                 * Disallow the use of undeclared variables unless mentioned in /*global *​/ comments
                 */
                "no-undef"?: Rule;
                /**
                 * Disallow the use of undefined as an identifier
                 */
                "no-undefined"?: Rule;
                /**
                 * Disallow initializing variables to undefined
                 */
                "no-undef-init"?: Rule;
                /**
                 * Disallow unused variables
                 */
                "no-unused-vars"?: Rule;
                /**
                 * Disallow the use of variables before they are defined
                 */
                "no-use-before-define"?: Rule;
                /**
                 * Require return statements after callbacks
                 */
                "callback-return"?: Rule;
                /**
                 * Require require() calls to be placed at top-level module scope
                 */
                "global-require"?: Rule;
                /**
                 * Require error handling in callbacks
                 */
                "handle-callback-err"?: Rule;
                /**
                 * Disallow require calls to be mixed with regular var declarations
                 */
                "no-mixed-requires"?: Rule;
                /**
                 * Disallow new operators with calls to require
                 */
                "no-new-require"?: Rule;
                /**
                 * Disallow string concatenation with __dirname and __filename
                 */
                "no-path-concat"?: Rule;
                /**
                 * Disallow the use of process.env
                 */
                "no-process-env"?: Rule;
                /**
                 * Disallow the use of process.exit()
                 */
                "no-process-exit"?: Rule;
                /**
                 * Disallow specified modules when loaded by require
                 */
                "no-restricted-modules"?: Rule;
                /**
                 * Disallow synchronous methods
                 */
                "no-sync"?: Rule;
                /**
                 * Enforce consistent spacing inside array brackets
                 */
                "array-bracket-spacing"?: Rule;
                /**
                 * Enforce consistent spacing inside single-line blocks
                 */
                "block-spacing"?: Rule;
                /**
                 * Enforce consistent brace style for blocks
                 */
                "brace-style"?: Rule;
                /**
                 * Enforce camelcase naming convention
                 */
                camelcase?: Rule;
                /**
                 * Enforce or disallow capitalization of the first letter of a comment
                 */
                "capitalized-comments"?: Rule;
                /**
                 * Enforce consistent spacing before and after commas
                 */
                "comma-spacing"?: Rule;
                /**
                 * Enforce consistent comma style
                 */
                "comma-style"?: Rule;
                /**
                 * Enforce consistent spacing inside computed property brackets
                 */
                "computed-property-spacing"?: Rule;
                /**
                 * Enforce consistent naming when capturing the current execution context
                 */
                "consistent-this"?: Rule;
                /**
                 * Enforce at least one newline at the end of files
                 */
                "eol-last"?: Rule;
                /**
                 * Require or disallow spacing between function identifiers and their invocations
                 */
                "func-call-spacing"?: Rule;
                /**
                 * Require or disallow named function expressions
                 */
                "func-names"?: Rule;
                /**
                 * Enforce the consistent use of either function declarations or expressions
                 */
                "func-style"?: Rule;
                /**
                 * Disallow specified identifiers
                 */
                "id-blacklist"?: Rule;
                /**
                 * Enforce minimum and maximum identifier lengths
                 */
                "id-length"?: Rule;
                /**
                 * Require identifiers to match a specified regular expression
                 */
                "id-match"?: Rule;
                /**
                 * Enforce consistent indentation
                 */
                indent?: Rule;
                /**
                 * Enforce the consistent use of either double or single quotes in JSX attributes
                 */
                "jsx-quotes"?: Rule;
                /**
                 * Enforce consistent spacing between keys and values in object literal properties
                 */
                "key-spacing"?: Rule;
                /**
                 * Enforce consistent spacing before and after keywords
                 */
                "keyword-spacing"?: Rule;
                /**
                 * Enforce consistent linebreak style
                 */
                "linebreak-style"?: Rule;
                /**
                 * Require empty lines around comments
                 */
                "lines-around-comment"?: Rule;
                "max-depth"?: Rule;
                "max-len"?: Rule;
                /**
                 * Enforce a maximum number of lines per file
                 */
                "max-lines"?: Rule;
                /**
                 * Enforce a maximum depth that callbacks can be nested
                 */
                "max-nested-callbacks"?: Rule;
                "max-params"?: Rule;
                "max-statements"?: Rule;
                /**
                 * Enforce a maximum number of statements allowed per line
                 */
                "max-statements-per-line"?: Rule;
                /**
                 * Enforce newlines between operands of ternary expressions
                 */
                "multiline-ternary"?: Rule;
                /**
                 * Require constructor function names to begin with a capital letter
                 */
                "new-cap"?: Rule;
                /**
                 * Require or disallow an empty line after var declarations
                 */
                "newline-after-var"?: Rule;
                /**
                 * Require an empty line before return statements
                 */
                "newline-before-return"?: Rule;
                /**
                 * Require a newline after each call in a method chain
                 */
                "newline-per-chained-call"?: Rule;
                /**
                 * Require parentheses when invoking a constructor with no arguments
                 */
                "new-parens"?: Rule;
                /**
                 * Disallow Array constructors
                 */
                "no-array-constructor"?: Rule;
                "no-bitwise"?: Rule;
                /**
                 * Disallow continue statements
                 */
                "no-continue"?: Rule;
                /**
                 * Disallow inline comments after code
                 */
                "no-inline-comments"?: Rule;
                /**
                 * Disallow if statements as the only statement in else blocks
                 */
                "no-lonely-if"?: Rule;
                /**
                 * Disallow mixed binary operators
                 */
                "no-mixed-operators"?: Rule;
                /**
                 * Disallow mixed spaces and tabs for indentation
                 */
                "no-mixed-spaces-and-tabs"?: Rule;
                /**
                 * Disallow multiple empty lines
                 */
                "no-multiple-empty-lines"?: Rule;
                /**
                 * Disallow negated conditions
                 */
                "no-negated-condition"?: Rule;
                /**
                 * Disallow nested ternary expressions
                 */
                "no-nested-ternary"?: Rule;
                /**
                 * Disallow Object constructors
                 */
                "no-new-object"?: Rule;
                "no-plusplus"?: Rule;
                /**
                 * Disallow specified syntax
                 */
                "no-restricted-syntax"?: Rule;
                "no-spaced-func"?: Rule;
                /**
                 * Disallow tabs in file
                 */
                "no-tabs"?: Rule;
                /**
                 * Disallow ternary operators
                 */
                "no-ternary"?: Rule;
                /**
                 * Disallow trailing whitespace at the end of lines
                 */
                "no-trailing-spaces"?: Rule;
                /**
                 * Disallow dangling underscores in identifiers
                 */
                "no-underscore-dangle"?: Rule;
                /**
                 * Disallow ternary operators when simpler alternatives exist
                 */
                "no-unneeded-ternary"?: Rule;
                /**
                 * Disallow whitespace before properties
                 */
                "no-whitespace-before-property"?: Rule;
                /**
                 * Enforce consistent line breaks inside braces
                 */
                "object-curly-newline"?: Rule;
                /**
                 * Enforce consistent spacing inside braces
                 */
                "object-curly-spacing"?: Rule;
                /**
                 * Enforce placing object properties on separate lines
                 */
                "object-property-newline"?: Rule;
                /**
                 * Require or disallow method and property shorthand syntax for object literals
                 */
                "object-shorthand"?: Rule;
                /**
                 * Enforce variables to be declared either together or separately in functions
                 */
                "one-var"?: Rule;
                /**
                 * Require or disallow newlines around var declarations
                 */
                "one-var-declaration-per-line"?: Rule;
                /**
                 * Require or disallow assignment operator shorthand where possible
                 */
                "operator-assignment"?: Rule;
                /**
                 * Enforce consistent linebreak style for operators
                 */
                "operator-linebreak"?: Rule;
                /**
                 * Require or disallow padding within blocks
                 */
                "padded-blocks"?: Rule;
                /**
                 * Require quotes around object literal property names
                 */
                "quote-props"?: Rule;
                /**
                 * Enforce the consistent use of either backticks, double, or single quotes
                 */
                quotes?: Rule;
                /**
                 * Require JSDoc comments
                 */
                "Require-jsdoc"?: Rule;
                /**
                 * Require or disallow semicolons instead of ASI
                 */
                semi?: Rule;
                /**
                 * Enforce consistent spacing before and after semicolons
                 */
                "semi-spacing"?: Rule;
                /**
                 * Requires object keys to be sorted
                 */
                "sort-keys"?: Rule;
                /**
                 * Require variables within the same declaration block to be sorted
                 */
                "sort-vars"?: Rule;
                /**
                 * Enforce consistent spacing before blocks
                 */
                "space-before-blocks"?: Rule;
                /**
                 * Enforce consistent spacing before function definition opening parenthesis
                 */
                "space-before-function-paren"?: Rule;
                /**
                 * Enforce consistent spacing after the // or /* in a comment
                 */
                "spaced-comment"?: Rule;
                /**
                 * Require spacing around operators
                 */
                "space-infix-ops"?: Rule;
                /**
                 * Enforce consistent spacing inside parentheses
                 */
                "space-in-parens"?: Rule;
                /**
                 * Enforce consistent spacing before or after unary operators
                 */
                "space-unary-ops"?: Rule;
                /**
                 * Require or disallow Unicode byte order mark (BOM)
                 */
                "unicode-bom"?: Rule;
                /**
                 * Require parenthesis around regex literals
                 */
                "wrap-regex"?: Rule;
                /**
                 * Require braces around arrow function bodies
                 */
                "arrow-body-style"?: Rule;
                /**
                 * Require parentheses around arrow function arguments
                 */
                "arrow-parens"?: Rule;
                /**
                 * Enforce consistent spacing before and after the arrow in arrow functions
                 */
                "arrow-spacing"?: Rule;
                /**
                 * Require super() calls in constructors
                 */
                "constructor-super"?: Rule;
                /**
                 * Enforce consistent spacing around * operators in generator functions
                 */
                "generator-star-spacing"?: Rule;
                /**
                 * Disallow reassigning class members
                 */
                "no-class-assign"?: Rule;
                /**
                 * Disallow arrow functions where they could be confused with comparisons
                 */
                "no-confusing-arrow"?: Rule;
                /**
                 * Disallow reassigning const variables
                 */
                "no-const-assign"?: Rule;
                /**
                 * Disallow duplicate class members
                 */
                "no-dupe-class-members"?: Rule;
                /**
                 * Disallow duplicate module imports
                 */
                "no-duplicate-imports"?: Rule;
                /**
                 * Disallow new operators with the Symbol object
                 */
                "no-new-symbol"?: Rule;
                /**
                 * Disallow specified modules when loaded by import
                 */
                "no-restricted-imports"?: Rule;
                /**
                 * Disallow this/super before calling super() in constructors
                 */
                "no-this-before-super"?: Rule;
                /**
                 * Disallow unnecessary computed property keys in object literals
                 */
                "no-useless-computed-key"?: Rule;
                /**
                 * Disallow unnecessary constructors
                 */
                "no-useless-constructor"?: Rule;
                /**
                 * Disallow renaming import, export, and destructured assignments to the same name
                 */
                "no-useless-rename"?: Rule;
                /**
                 * Require let or const instead of var
                 */
                "no-var"?: Rule;
                /**
                 * Require arrow functions as callbacks
                 */
                "prefer-arrow-callback"?: Rule;
                /**
                 * Require const declarations for variables that are never reassigned after declared
                 */
                "prefer-const"?: Rule;
                /**
                 * Require Reflect methods where applicable
                 */
                "prefer-reflect"?: Rule;
                /**
                 * Require rest parameters instead of arguments
                 */
                "prefer-rest-params"?: Rule;
                /**
                 * Require spread operators instead of .apply()
                 */
                "prefer-spread"?: Rule;
                /**
                 * Require template literals instead of string concatenation
                 */
                "prefer-template"?: Rule;
                /**
                 * Require generator functions to contain yield
                 */
                "Require-yield"?: Rule;
                /**
                 * Enforce spacing between rest and spread operators and their expressions
                 */
                "rest-spread-spacing"?: Rule;
                /**
                 * Enforce sorted import declarations within modules
                 */
                "sort-imports"?: Rule;
                /**
                 * Require or disallow spacing around embedded expressions of template strings
                 */
                "template-curly-spacing"?: Rule;
                /**
                 * Require or disallow spacing around the * in yield* expressions
                 */
                "yield-star-spacing"?: Rule;
            }
            export type Rule = number | ("off" | "warn" | "error") | any[];
            export interface StrictMode {
                /**
                 * require or disallow strict mode directives
                 */
                strict?: Rule;
            }
            export interface StylisticIssues {
                /**
                 * Enforce consistent spacing inside array brackets
                 */
                "array-bracket-spacing"?: Rule;
                /**
                 * Enforce consistent spacing inside single-line blocks
                 */
                "block-spacing"?: Rule;
                /**
                 * Enforce consistent brace style for blocks
                 */
                "brace-style"?: Rule;
                /**
                 * Enforce camelcase naming convention
                 */
                camelcase?: Rule;
                /**
                 * Enforce or disallow capitalization of the first letter of a comment
                 */
                "capitalized-comments"?: Rule;
                /**
                 * Require or disallow trailing commas
                 */
                "comma-dangle"?: Rule;
                /**
                 * Enforce consistent spacing before and after commas
                 */
                "comma-spacing"?: Rule;
                /**
                 * Enforce consistent comma style
                 */
                "comma-style"?: Rule;
                /**
                 * Enforce consistent spacing inside computed property brackets
                 */
                "computed-property-spacing"?: Rule;
                /**
                 * Enforce consistent naming when capturing the current execution context
                 */
                "consistent-this"?: Rule;
                /**
                 * Enforce at least one newline at the end of files
                 */
                "eol-last"?: Rule;
                /**
                 * Require or disallow spacing between function identifiers and their invocations
                 */
                "func-call-spacing"?: Rule;
                /**
                 * Require or disallow named function expressions
                 */
                "func-names"?: Rule;
                /**
                 * Enforce the consistent use of either function declarations or expressions
                 */
                "func-style"?: Rule;
                /**
                 * Disallow specified identifiers
                 */
                "id-blacklist"?: Rule;
                /**
                 * Enforce minimum and maximum identifier lengths
                 */
                "id-length"?: Rule;
                /**
                 * Require identifiers to match a specified regular expression
                 */
                "id-match"?: Rule;
                /**
                 * Enforce consistent indentation
                 */
                indent?: Rule;
                /**
                 * Enforce the consistent use of either double or single quotes in JSX attributes
                 */
                "jsx-quotes"?: Rule;
                /**
                 * Enforce consistent spacing between keys and values in object literal properties
                 */
                "key-spacing"?: Rule;
                /**
                 * Enforce consistent spacing before and after keywords
                 */
                "keyword-spacing"?: Rule;
                /**
                 * Enforce consistent linebreak style
                 */
                "linebreak-style"?: Rule;
                /**
                 * Require empty lines around comments
                 */
                "lines-around-comment"?: Rule;
                /**
                 * Enforce a maximum depth that blocks can be nested
                 */
                "max-depth"?: Rule;
                /**
                 * Enforce a maximum line length
                 */
                "max-len"?: Rule;
                /**
                 * Enforce a maximum number of lines per file
                 */
                "max-lines"?: Rule;
                /**
                 * Enforce a maximum depth that callbacks can be nested
                 */
                "max-nested-callbacks"?: Rule;
                /**
                 * Enforce a maximum number of parameters in function definitions
                 */
                "max-params"?: Rule;
                /**
                 * Enforce a maximum number of statements allowed in function blocks
                 */
                "max-statements"?: Rule;
                /**
                 * Enforce a maximum number of statements allowed per line
                 */
                "max-statements-per-line"?: Rule;
                /**
                 * Enforce newlines between operands of ternary expressions
                 */
                "multiline-ternary"?: Rule;
                /**
                 * Require constructor function names to begin with a capital letter
                 */
                "new-cap"?: Rule;
                /**
                 * Require or disallow an empty line after var declarations
                 */
                "newline-after-var"?: Rule;
                /**
                 * Require an empty line before return statements
                 */
                "newline-before-return"?: Rule;
                /**
                 * Require a newline after each call in a method chain
                 */
                "newline-per-chained-call"?: Rule;
                /**
                 * Require parentheses when invoking a constructor with no arguments
                 */
                "new-parens"?: Rule;
                /**
                 * Disallow Array constructors
                 */
                "no-array-constructor"?: Rule;
                /**
                 * Disallow bitwise operators
                 */
                "no-bitwise"?: Rule;
                /**
                 * Disallow continue statements
                 */
                "no-continue"?: Rule;
                /**
                 * Disallow inline comments after code
                 */
                "no-inline-comments"?: Rule;
                /**
                 * Disallow if statements as the only statement in else blocks
                 */
                "no-lonely-if"?: Rule;
                /**
                 * Disallow mixed binary operators
                 */
                "no-mixed-operators"?: Rule;
                /**
                 * Disallow mixed spaces and tabs for indentation
                 */
                "no-mixed-spaces-and-tabs"?: Rule;
                /**
                 * Disallow multiple empty lines
                 */
                "no-multiple-empty-lines"?: Rule;
                /**
                 * Disallow negated conditions
                 */
                "no-negated-condition"?: Rule;
                /**
                 * Disallow nested ternary expressions
                 */
                "no-nested-ternary"?: Rule;
                /**
                 * Disallow Object constructors
                 */
                "no-new-object"?: Rule;
                /**
                 * Disallow the unary operators ++ and --
                 */
                "no-plusplus"?: Rule;
                /**
                 * Disallow specified syntax
                 */
                "no-restricted-syntax"?: Rule;
                "no-spaced-func"?: Rule;
                /**
                 * Disallow tabs in file
                 */
                "no-tabs"?: Rule;
                /**
                 * Disallow ternary operators
                 */
                "no-ternary"?: Rule;
                /**
                 * Disallow trailing whitespace at the end of lines
                 */
                "no-trailing-spaces"?: Rule;
                /**
                 * Disallow dangling underscores in identifiers
                 */
                "no-underscore-dangle"?: Rule;
                /**
                 * Disallow ternary operators when simpler alternatives exist
                 */
                "no-unneeded-ternary"?: Rule;
                /**
                 * Disallow whitespace before properties
                 */
                "no-whitespace-before-property"?: Rule;
                /**
                 * Enforce consistent line breaks inside braces
                 */
                "object-curly-newline"?: Rule;
                /**
                 * Enforce consistent spacing inside braces
                 */
                "object-curly-spacing"?: Rule;
                /**
                 * Enforce placing object properties on separate lines
                 */
                "object-property-newline"?: Rule;
                "object-shorthand"?: Rule;
                /**
                 * Enforce variables to be declared either together or separately in functions
                 */
                "one-var"?: Rule;
                /**
                 * Require or disallow newlines around var declarations
                 */
                "one-var-declaration-per-line"?: Rule;
                /**
                 * Require or disallow assignment operator shorthand where possible
                 */
                "operator-assignment"?: Rule;
                /**
                 * Enforce consistent linebreak style for operators
                 */
                "operator-linebreak"?: Rule;
                /**
                 * Require or disallow padding within blocks
                 */
                "padded-blocks"?: Rule;
                /**
                 * Require quotes around object literal property names
                 */
                "quote-props"?: Rule;
                /**
                 * Enforce the consistent use of either backticks, double, or single quotes
                 */
                quotes?: Rule;
                /**
                 * Require JSDoc comments
                 */
                "Require-jsdoc"?: Rule;
                /**
                 * Require or disallow semicolons instead of ASI
                 */
                semi?: Rule;
                /**
                 * Enforce consistent spacing before and after semicolons
                 */
                "semi-spacing"?: Rule;
                /**
                 * Requires object keys to be sorted
                 */
                "sort-keys"?: Rule;
                /**
                 * Require variables within the same declaration block to be sorted
                 */
                "sort-vars"?: Rule;
                /**
                 * Enforce consistent spacing before blocks
                 */
                "space-before-blocks"?: Rule;
                /**
                 * Enforce consistent spacing before function definition opening parenthesis
                 */
                "space-before-function-paren"?: Rule;
                /**
                 * Enforce consistent spacing after the // or /* in a comment
                 */
                "spaced-comment"?: Rule;
                /**
                 * Require spacing around operators
                 */
                "space-infix-ops"?: Rule;
                /**
                 * Enforce consistent spacing inside parentheses
                 */
                "space-in-parens"?: Rule;
                /**
                 * Enforce consistent spacing before or after unary operators
                 */
                "space-unary-ops"?: Rule;
                /**
                 * Require or disallow Unicode byte order mark (BOM)
                 */
                "unicode-bom"?: Rule;
                /**
                 * Require parenthesis around regex literals
                 */
                "wrap-regex"?: Rule;
            }
            export interface Variables {
                /**
                 * Require or disallow initialization in var declarations
                 */
                "init-declarations"?: Rule;
                /**
                 * Disallow catch clause parameters from shadowing variables in the outer scope
                 */
                "no-catch-shadow"?: Rule;
                /**
                 * Disallow deleting variables
                 */
                "no-delete-var"?: Rule;
                /**
                 * Disallow labels that share a name with a variable
                 */
                "no-label-var"?: Rule;
                /**
                 * Disallow specified global variables
                 */
                "no-restricted-globals"?: Rule;
                /**
                 * Disallow var declarations from shadowing variables in the outer scope
                 */
                "no-shadow"?: Rule;
                /**
                 * Disallow identifiers from shadowing restricted names
                 */
                "no-shadow-restricted-names"?: Rule;
                /**
                 * Disallow the use of undeclared variables unless mentioned in /*global *​/ comments
                 */
                "no-undef"?: Rule;
                /**
                 * Disallow the use of undefined as an identifier
                 */
                "no-undefined"?: Rule;
                /**
                 * Disallow initializing variables to undefined
                 */
                "no-undef-init"?: Rule;
                /**
                 * Disallow unused variables
                 */
                "no-unused-vars"?: Rule;
                /**
                 * Disallow the use of variables before they are defined
                 */
                "no-use-before-define"?: Rule;
            }
        }
        namespace Properties {
            /**
             * By default, ESLint supports only ECMAScript 5 syntax. You can override that setting to enable support for ECMAScript 6 as well as JSX by using configuration settings.
             */
            export interface EcmaFeatures {
                arrowFunctions?: boolean;
                binaryLiterals?: boolean;
                blockBindings?: boolean;
                classes?: boolean;
                defaultParams?: boolean;
                destructuring?: boolean;
                /**
                 * Enables support for the experimental object rest/spread properties (IMPORTANT: This is an experimental feature that may change significantly in the future. It’s recommended that you do not write rules relying on this functionality unless you are willing to incur maintenance cost when it changes.)
                 */
                experimentalObjectRestSpread?: boolean;
                forOf?: boolean;
                generators?: boolean;
                /**
                 * allow return statements in the global scope
                 */
                globalReturn?: boolean;
                /**
                 * enable global strict mode (if ecmaVersion is 5 or greater)
                 */
                impliedStrict?: boolean;
                /**
                 * enable JSX
                 */
                jsx?: boolean;
                modules?: boolean;
                objectLiteralComputedProperties?: boolean;
                objectLiteralDuplicateProperties?: boolean;
                objectLiteralShorthandMethods?: boolean;
                objectLiteralShorthandProperties?: boolean;
                octalLiterals?: boolean;
                regexUFlag?: boolean;
                regexYFlag?: boolean;
                restParams?: boolean;
                spread?: boolean;
                superInFunctions?: boolean;
                templateStrings?: boolean;
                unicodeCodePointEscapes?: boolean;
            }
        }
    }
}
