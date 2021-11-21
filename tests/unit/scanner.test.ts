// import { expect, should } from "chai";
// // import {} from "../../scanner";
// describe("token scaner test", () => {

import { FunctionDecl } from "@tranpiler/expr";
import { Scanner } from "@tranpiler/scanner";
import {
	Basic,
	DataType,
	Delemiter,
	Keyword,
	LitKind,
	LiTToken,
	LoopType,
	Operator,
	Token
} from "@tranpiler/token";
import { expect } from "chai";

// });
export {};

describe("scanner test", function () {
	it("number && sign number", () => {
		let scanner = new Scanner();
		let token = scanner.scan("2312   123.2323 2132 -29320");
		let kq = [
			new LiTToken(2312, LitKind.IntLit),
			new LiTToken(123.2323, LitKind.FloatLit),
			new LiTToken(2132, LitKind.IntLit),
			new Token(Operator.MINUS),
			new LiTToken(29320, LitKind.IntLit),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("number && token", () => {
		let scanner = new Scanner();
		let token = scanner.scan("2312   VM abcszy TT");
		let kq = [
			new LiTToken(2312, LitKind.IntLit),
			new Token(LoopType.VM),
			new LiTToken("abcszy", LitKind.StringLit),
			new Token(LoopType.TT),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("simple scanner", () => {
		let scanner = new Scanner();
		let token = scanner.scan("Ham (a:R*, n:N)kq:B\npre\npost");
		let kq = [
			new LiTToken("Ham", LitKind.StringLit),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.N),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.B),
			new Token(Keyword.PRE),
			new Token(Keyword.POST),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("complex", () => {
		let scanner = new Scanner();
		let token = scanner.scan("Ham (a:R*, n:N)kq:B\npre a>0\npost");
		let kq = [
			new LiTToken("Ham", LitKind.StringLit),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.N),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.B),
			new Token(Keyword.PRE),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.GREATER),
			new LiTToken(0, LitKind.IntLit),
			new Token(Keyword.POST),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("more complex", () => {
		let scanner = new Scanner();
		let token = scanner.scan(
			"Ham (a:R*, n:Z*)kq:B\npre a>0\npost a=23 && a=24"
		);
		let kq = [
			new LiTToken("Ham", LitKind.StringLit),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.Z_STAR),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.StringLit),
			new Token(Delemiter.COLON),
			new Token(DataType.B),
			new Token(Keyword.PRE),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.GREATER),
			new LiTToken(0, LitKind.IntLit),
			new Token(Keyword.POST),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(23, LitKind.IntLit),
			new Token(Operator.AND),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(24, LitKind.IntLit),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
});
