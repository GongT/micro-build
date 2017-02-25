die () {
	echo -e "\e[38;5;9m"
	echo "$@" >&2
	echo -e "\e[0m"
	exit 127
}

update-resolve

export NPM_RC_PATH=$HOME
mkdir -p "${NPM_RC_PATH}"
export NPM_RC_FILE=${NPM_RC_PATH}/.npmrc

if [ "${IS_IN_CHINA}" = "yes" ]; then
	export SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass
	NPM_ARGUMENTS=`echo "
	--phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
	--chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
	"`
else
	NPM_ARGUMENTS=""
fi

NPM_ARGUMENTS=`echo "${NPM_ARGUMENTS}
	--unsafe-perm
	--registry=${NPM_REGISTRY}
	--cache=/install/npm/npm-cache
	--userconfig=${NPM_RC_FILE}
	--progress true --loglevel warn
	"`

TYPE=install
if [ "$1" = "uninstall" ] ; then
	TYPE=uninstall
	shift
fi

if command -v git 2>&1 >/dev/null ; then
	wrap_npm () {
		if [[ -n "${HTTP_PROXY}" ]] ; then
			git config --system --replace-all http.proxy "${HTTP_PROXY}"
			git config --system --replace-all https.proxy "${HTTP_PROXY}"
			cat /etc/gitconfig
		fi
		
		npm "$@"
		RET=$?
		
		if [[ -n "${HTTP_PROXY}" ]] ; then
			git config --system --unset-all http.proxy
			git config --system --unset-all https.proxy
		fi
		
		exit ${RET}
	}
	
	NPM_EXEC="wrap_npm"
else
	NPM_EXEC="npm"
fi


NPM_INSTALL=`echo "${NPM_EXEC} ${TYPE}
	${NPM_ARGUMENTS}
	"`
