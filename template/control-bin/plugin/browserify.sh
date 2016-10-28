background_task "@{TASK_NAME}" \
	"`which browserify`" "@{SOURCE}" --debug --standalone "@{MODULE_NAME}" --outfile "@{TARGET}"
