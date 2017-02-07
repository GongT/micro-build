#{FROM}

ENV BUILDING=yes \
	PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/data/scripts:/sbin:/bin:/data/node_modules/.bin:./node_modules/.bin \
	RUN_IN_DOCKER=yes \
	@{CHINA_ENVIRONMENTS} \
	@{NETWORKING_ENVIRONMENTS}

ENTRYPOINT [@{SHELL}]
CMD [@{COMMAND}]

WORKDIR /data

#{JSON_ENV_PASS}
#{ENVIRONMENT_VARS}

#{CUSTOM_SYSTEM_INSTALL}

#{LABEL_INSTRUCTIONS}

#{VOLUMES}
#{PORTS}

ENV BUILDING=no HTTP_PROXY="" HTTPS_PROXY="" \
	PROJECT_NAME="@{PROJECT_NAME}"
