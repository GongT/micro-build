export default function createGuid() {
	let _guid = 1;
	return function guid() {
		return (_guid++).toString();
	};
}
