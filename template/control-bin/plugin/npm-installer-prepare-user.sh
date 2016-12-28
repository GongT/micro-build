#!/bin/sh
set -e

#{PREPEND_NPM_SCRIPT}

cat <<!CMD!
npm-cli-login
	-u "${NPM_USER}"
	-p "${NPM_PASS}"
	-e "${NPM_EMAIL}"
	-r "${NPM_REGISTRY}"
	-s "@${NPM_SCOPE}"
	--config-path "${NPM_RC_FILE}"
!CMD!

npm-cli-login \
	-u "${NPM_USER}" \
	-p "${NPM_PASS}" \
	-e "${NPM_EMAIL}" \
	-r "${NPM_REGISTRY}" \
	-s "@${NPM_SCOPE}" \
	--config-path "${NPM_RC_FILE}"

npm config set "@${NPM_SCOPE}:registry" "${NPM_REGISTRY}"

npm ${NPM_ARGUMENTS} whoami

rm -rf ~/.npm ~/.node-gyp /npm-install/npm-cache
