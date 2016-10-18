background_task "TS-@{TASK_NAME}" \
	"`which tsc`" -w -p "@{SOURCE}" --outDir "@{TARGET}"
