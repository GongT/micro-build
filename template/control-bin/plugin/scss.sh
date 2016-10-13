CMD="
node-sass --watch --recursive @{SOURCE}
	--output @{TARGET}
	--source-map true --source-map-contents scss
"
echo "${CMD[@]}"

${CMD[@]} &
