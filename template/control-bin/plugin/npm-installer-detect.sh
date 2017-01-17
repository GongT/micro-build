die () {
	echo -e "\e[38;5;9m"
	echo "$@" >&2
	echo -e "\e[0m"
	exit 127
}

#{UPDATE_RESOLVE}

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
	--registry=${NPM_REGISTRY}
	--cache=/npm-install/npm-cache
	--userconfig=${NPM_RC_FILE}
	--progress true --loglevel error
	"`

TYPE=install
if [ "$1" = "uninstall" ] ; then
	TYPE=uninstall
	shift
fi

NPM_INSTALL=`echo "npm ${TYPE}
	${NPM_ARGUMENTS}
	"`
