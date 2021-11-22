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
		let token = scanner.scan('2312   VM "abcszy" TT');
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
			new LiTToken("Ham", LitKind.Unknown),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.N),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.Unknown),
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
			new LiTToken("Ham", LitKind.Unknown),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.N),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.B),
			new Token(Keyword.PRE),
			new LiTToken("a", LitKind.Unknown),
			new Token(Operator.GREATER),
			new LiTToken(0, LitKind.IntLit),
			new Token(Keyword.POST),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("more more complex", () => {
		let src = `kq >= a1   `;
		let scanner = new Scanner().scan(src);
		let kq = [
			new LiTToken("kq", LitKind.Unknown),
			new Token(Operator.GREATER_EQUAL),
			new LiTToken("a1", LitKind.Unknown),
			new Token(Basic.EOF)
		];
		expect(scanner).to.be.deep.equal(kq);
	});
	it("more complex", () => {
		let scanner = new Scanner();
		let token = scanner.scan(
			"Ham (a:R*, n:Z*)kq:B\npre a>0\npost a=23 && a=24"
		);
		let kq = [
			new LiTToken("Ham", LitKind.Unknown),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.R_STAR),
			new Token(Delemiter.COMMA),
			new LiTToken("n", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.Z_STAR),
			new Token(Delemiter.RPRAREN),
			new LiTToken("kq", LitKind.Unknown),
			new Token(Delemiter.COLON),
			new Token(DataType.B),
			new Token(Keyword.PRE),
			new LiTToken("a", LitKind.Unknown),
			new Token(Operator.GREATER),
			new LiTToken(0, LitKind.IntLit),
			new Token(Keyword.POST),
			new LiTToken("a", LitKind.Unknown),
			new Token(Operator.EQUALS),
			new LiTToken(23, LitKind.IntLit),
			new Token(Operator.AND),
			new LiTToken("a", LitKind.Unknown),
			new Token(Operator.EQUALS),
			new LiTToken(24, LitKind.IntLit),
			new Token(Basic.EOF)
		];
		expect(token).to.be.deep.equal(kq);
	});
	it("loop scanner", () => {
		let src = `kq=(VM i TH {1..n-1}. TT j TH {i+1..n}.a(i) <= a(j))`;

		let scanner = new Scanner().scan(src);
		console.log(scanner);
		let kq = [
			new LiTToken("kq", LitKind.Unknown),
			new Token(Operator.GREATER_EQUAL),
			new LiTToken("a1", LitKind.Unknown),
			new Token(Basic.EOF)
		];
		expect("").to.be.deep.equal(kq);
	});
});
