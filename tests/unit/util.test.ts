import { Scanner } from "@tranpiler/scanner";
import { expect } from "chai";
import {
	isAlphabet,
	isDot,
	isBlank,
	isFloat,
	isInt,
	isNum
} from "@tranpiler/utils";
describe("utils function test", function () {
	it("isAlphabet", () => {
		expect(isAlphabet("a")).equal(true);
		expect(isAlphabet("z")).equal(true);
		expect(isAlphabet("d")).equal(true);
		expect(isAlphabet("A")).equal(true);
		expect(isAlphabet("Z")).equal(true);
		expect(isAlphabet("D")).equal(true);
		expect(isAlphabet(" ")).equal(false);
		expect(isAlphabet("@")).equal(false);
	});
	it("isDot", () => {
		expect(isDot(".")).equal(true);
		expect(isDot("@")).equal(false);
		expect(isDot("A")).equal(false);
		expect(isDot("a")).equal(false);
	});
	it("isBlank", () => {
		expect(isBlank(" ")).equal(true);
		expect(isBlank("\t")).equal(true);
		expect(isBlank("\n")).equal(true);
		expect(isBlank("a")).equal(false);
	});
	it("isNum", () => {
		expect(isNum("0")).equal(true);
		expect(isNum("9")).equal(true);
		expect(isNum("5")).equal(true);
		expect(isNum("A")).equal(false);
	});
	it("isFloat", () => {
		expect(isFloat(4.5), "4.5").equal(true);
		expect(isFloat(7553453.5523423), "7553453.5523423").equal(true);
		expect(isFloat(4.0), "4.0").equal(false);
		expect(isFloat(2), "2").equal(false);
	});
	it("isInt", () => {
		expect(isInt(5), "5").equal(true);
		expect(isInt(5299293232), "5299293232").equal(true);
		expect(isInt(-1923230), "-1923230").equal(true);
		expect(isInt(2.3), "2.3").equal(false);
		expect(isInt(2.0), "2.0").equal(true);
	});
});
