RUN mkdir -p /data/@{DIR}
COPY ./@{DIR}package.json /data/@{DIR}package.json
RUN ${NPM_INSTALL} --env=prod
