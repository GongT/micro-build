#!/usr/bin/env bash

set -x

dtsgen -o packagejson.d.ts --url http://json.schemastore.org/package
dtsgen -o tslint.d.ts --url http://json.schemastore.org/tslint
dtsgen -o tsconfig.d.ts --url http://json.schemastore.org/tsconfig
dtsgen -o eslint.d.ts --url http://json.schemastore.org/eslintrc
dtsgen -o babelrc.d.ts --url http://json.schemastore.org/babelrc

