
echo "build with config file @{JENV_FILE_NAME}"

jenv --hint

CONFIG_FILE_HASH=`md5sum "@{JENV_FILE_NAME}" | awk '{ print $1; }'`
echo "config file hash: ${CONFIG_FILE_HASH}"

BUILD_ARGUMENTS="${BUILD_ARGUMENTS} --build-arg=CONFIG_FILE_HASH=${CONFIG_FILE_HASH}"
