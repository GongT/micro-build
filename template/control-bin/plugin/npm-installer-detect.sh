E=`printf '\033'`

die () {
	echo -e "$E[38;5;9m"
	echo "$@" >&2
	echo -e "$E[0m"
	exit 127
}

update-resolve

export NPM_RC_PATH=$HOME
mkdir -p "${NPM_RC_PATH}"
export NPM_RC_FILE=${NPM_RC_PATH}/.npmrc

if [ "${IS_IN_CHINA}" = "yes" ]; then
	echo "load big binary from china"
	export SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass
	NPM_ARGUMENTS="	--phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs \
--chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver"
else
	NPM_ARGUMENTS=""
fi

NPM_ARGUMENTS="${NPM_ARGUMENTS} \
--unsafe-perm \
--registry=${NPM_REGISTRY} \
--cache=/install/npm/npm-cache \
--userconfig=${NPM_RC_FILE} \
--loglevel warn"

TYPE=install
if [ "$1" = "uninstall" ] ; then
	TYPE=uninstall
	shift
fi
echo "TYPE=${TYPE}"

if command -v git 2>&1 >/dev/null ; then
	wrap_npm () {
		if [[ -n "${HTTP_PROXY}" ]] ; then
			git config --system --replace-all http.proxy "${HTTP_PROXY}"
			git config --system --replace-all https.proxy "${HTTP_PROXY}"
			cat /etc/gitconfig
		fi
		
		echo "npm is running..."
		LAST_COMMAND="$*"
		npm "$@"
		RET=$?
		echo "npm exit: $RET..."
		
		if [[ -n "${HTTP_PROXY}" ]] ; then
			git config --system --unset-all http.proxy
			git config --system --unset-all https.proxy
		fi
		
		return ${RET}
	}
else
	wrap_npm () {
		echo "npm is running..."
		LAST_COMMAND="$*"
		npm "$@"
		RET=$?
		echo "npm exit: $RET..."
		
		return ${RET}
	}
fi

NPM_EXEC="wrap_npm"

echo "NPM_EXEC=${NPM_EXEC}"

NPM_INSTALL="${NPM_EXEC} ${TYPE} ${NPM_ARGUMENTS}"

echo "NPM_INSTALL=${NPM_INSTALL}"

handle_npm_error () {
	RET=$1
	if [ "${RET}" -ne 0 ]; then
		echo "${E}c$E[38;5;11mnpm install failed... $E[0m"
		
		echo "---- log ----"
		
		cat /install/npm/npm-cache/_logs/*.log
		
		echo ""
		echo "info: "
		echo "    $E[38;5;11mPWD$E[0m: `pwd`"
		echo "    $E[38;5;11mcommand$E[0m: ${LAST_COMMAND}"
		if [ -e ./package.json ]; then
			echo "$E[38;5;11mpackage.json content:$E[0;2m"
			cat ./package.json
			echo "$E[0m---------------------"
			echo ""
		fi
		echo "$E[38;5;11mnpm install failed... $E[0m"
		echo ""
		
		exit "${RET}"
	fi
	rm -rf /install/npm/npm-cache/_logs
	echo "$E[38;5;10minstall success... $E[0m"
}
