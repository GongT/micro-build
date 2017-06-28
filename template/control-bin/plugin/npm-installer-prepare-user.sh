#!/bin/sh

#{PREPEND_NPM_SCRIPT}

cat <<!CMD!
npm-cli-login -u "${NPM_USER}" -p "${NPM_PASS}" -e "${NPM_EMAIL}" -r "${NPM_REGISTRY}" -s "@${NPM_SCOPE}" --config-path "${NPM_RC_FILE}"
!CMD!

npm-cli-login \
	-u "${NPM_USER}" \
	-p "${NPM_PASS}" \
	-e "${NPM_EMAIL}" \
	-r "${NPM_REGISTRY}" \
	-s "@${NPM_SCOPE}" \
	--config-path "${NPM_RC_FILE}"

echo "set registry to config file with original npm: "
npm config set "@${NPM_SCOPE}:registry" "${NPM_REGISTRY}"

echo "$E[38;5;14m"
npm ${NPM_ARGUMENTS} whoami
echo "$E[0m"
