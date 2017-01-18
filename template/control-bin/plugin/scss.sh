background_task "CSS-@{TASK_NAME}" \
	nodemon --no-stdin --quiet --config /path/to/not/exists/blabla --watch "@{SOURCE}" -e scss -- \
	`which node-sass` -r "@{SOURCE}" --output "@{TARGET}" \
		--source-map true --source-map-contents scss
