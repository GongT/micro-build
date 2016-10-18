#{FROM}
ENV BUILDING yes

ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/data/scripts:/sbin:/bin
ENV RUN_IN_DOCKER yes
RUN mkdir -p /data
WORKDIR /data

#{NPM_INSTALL_INSTRUCTIONS}

#{VOLUMES}
#{PORTS}

#{JSON_ENV_PASS}
#{ENVIRONMENT_VARS}
#{BUILD_ARGUMENTS}

#{LABEL_INSTRUCTIONS}
#{NSG_LABEL_INSTRUCTIONS}

#{CUSTOM_BUILD_BEFORE}

ENTRYPOINT [@{SHELL}]
CMD [@{COMMAND}${COMMAND_LINE_ARGS}]

COPY . /data
RUN [ -e /data/scripts ] && chmod a+x /data/scripts/* || true

#{COMPILE_PLUGIN}

#{CUSTOM_BUILD_AFTER}

# ARG COMMAND_LINE_ARGS

ENV BUILDING no
