ARG CONFIG_FILE_HASH
# RUN echo "using config file: @{JENV_FILE_NAME_REL} --" $CONFIG_FILE_HASH
COPY @{JENV_FILE_NAME_REL} /settings.json
ENV CONFIG_FILE=/settings.json
