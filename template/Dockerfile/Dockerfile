#{FROM}

ENV BUILDING=yes \
	PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/data/scripts:/sbin:/bin \
	RUN_IN_DOCKER=yes
RUN mkdir -p /data
WORKDIR /data

#{NPM_INSTALL_INSTRUCTIONS}
#{PLUGINS_NPM_INSTALL}

#{VOLUMES}
#{PORTS}

#{JSON_ENV_PASS}
#{ENVIRONMENT_VARS}
#{BUILD_ARGUMENTS}

#{CUSTOM_BUILD_BEFORE}

#{LABEL_INSTRUCTIONS}

ENTRYPOINT [@{SHELL}]
CMD [@{COMMAND}${COMMAND_LINE_ARGS}]

COPY . /data
RUN [ -e /data/scripts ] && chmod a+x /data/scripts/* || true

#{COMPILE_PLUGIN}

#{CUSTOM_BUILD_AFTER}

ENV BUILDING no
