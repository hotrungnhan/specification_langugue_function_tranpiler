import { FunctionDecl } from "@tranpiler/expr";
import { Parser } from "@tranpiler/parser";
import {
	Basic,
	DataType,
	Delemiter,
	Keyword,
	LitKind,
	LiTToken,
	Operator,
	Token
} from "@tranpiler/token";
import { expect } from "chai";
describe("parser test", function () {
	it("sample 1", function () {
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
		let ast = Parser.Inst.parse(kq);
		console.log(JSON.stringify(ast));
		expect(ast).to.be.equal(false);
	});
});
