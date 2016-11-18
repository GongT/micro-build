#{INSERT_IS_CHINA_VAR}

if [ "x${IS_IN_CHINA}" = "xyes" ]; then
	export SASS_BINARY_SITE=http://npm.taobao.org/mirrors/node-sass
	NPM_INSTALL=`echo "npm install
	--progress=true
	--registry=https://registry.npm.taobao.org
	--cache=/npm-install/cnpm-cache
	--disturl=https://npm.taobao.org/dist
	--userconfig=/npm-install/config/cnpmrc
	--phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
	--chromedriver_cdnurl=http://npm.taobao.org/mirrors/chromedriver
	"`
else
	NPM_INSTALL=`echo "npm install
	--progress=true
	--cache=/npm-install/npm-cache
	--userconfig=/npm-install/config/npmrc
	"`
fi
