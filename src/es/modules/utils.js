let validIdRegEx = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/;

export function isIdValid(id) {
	return id && validIdRegEx.test(id);
}