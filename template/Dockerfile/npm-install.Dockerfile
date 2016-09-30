COPY @{TEMP_FILE} /tmp/install/@{RAND_ID}/package.json
RUN npm-install /tmp/install/@{RAND_ID} ; \
 	mkdir -p /data/@{TARGET_DIR} ; \
 	mv /tmp/install/@{RAND_ID}/node_modules /data/@{TARGET_DIR} ; \
 	rm -rf /tmp/install/@{RAND_ID}
 	
