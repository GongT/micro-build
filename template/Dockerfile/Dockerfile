#{FROM}

RUN mkdir -p /data

#{NPM_INSTALL_INSTRUCTIONS}

#{CUSTOM_BUILD_BEFORE}

#{JSON_ENV_PASS}

#{ENVIRONMENT_VARS}

#{BUILD_ARGUMENTS}

#{LABEL_INSTRUCTIONS}
#{NSG_LABEL_INSTRUCTIONS}

#{VOLUMES}

COPY . /data
WORKDIR /data

#{COMPILE_PLUGIN}

#{CUSTOM_BUILD_AFTER}
#{PORTS}

# ARG COMMAND_LINE_ARGS
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/data/scripts:/sbin:/bin
RUN [ -e /data/scripts ] && chmod a+x /data/scripts/* || true
ENTRYPOINT [@{SHELL}]
CMD [@{COMMAND}${COMMAND_LINE_ARGS}]
