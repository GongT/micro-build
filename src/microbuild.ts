#!/usr/bin/env node

import {displayError} from "./library/common/display-error";
require("source-map-support/register");
process.on('uncaughtException', (err) => {
	displayError(err.stack);
	process.exit(1);
});
require('./bin');
