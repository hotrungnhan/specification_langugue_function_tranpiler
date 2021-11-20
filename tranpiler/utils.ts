function isNum(c: string) {
	return (c >= "0" && c <= "9") || c == ".";
}
function isBlank(c: string) {
	return c == "\n" || c == "\t" || c == " ";
}

function isInt(x: number) {
	return typeof x === "number" && isFinite(x) && Math.floor(x) === x;
}
function isFloat(x: number) {
	return !!(x % 1);
}
function isDot(x: string) {
	return x == ".";
}
function isAlphabet(x: string) {
	return (x >= "a" && x <= "z") || (x >= "A" && x <= "Z");
}
function isSign(x: string) {
	return x == "-" || x == "+";
}
function isStar(x: string) {
	return x == "*";
}

export { isStar, isAlphabet, isNum, isInt, isFloat, isDot, isBlank, isSign };
