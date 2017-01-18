background_task "TS-@{TASK_NAME}" \
	"`which tsc`" --noEmitOnError -w -p "@{SOURCE}" --outDir "@{TARGET}"
