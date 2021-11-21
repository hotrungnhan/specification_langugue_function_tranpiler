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
import { expect, util } from "chai";
describe("parser test", function () {
	it("test gen NPN", () => {
		let kq = [
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.AND),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(1, LitKind.IntLit),
			new Token(Delemiter.RPRAREN)
		];
		let ast = new Parser().genRPN(kq);
		
		expect(ast).to.be.equal(false);
	});
	it("test pre parser", () => {
		let kq = [
			new Token(Delemiter.LPRAREN),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.AND),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.OR),
			new Token(Delemiter.LPRAREN),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.AND),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.OR),
			new Token(Delemiter.LPRAREN),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Operator.AND),
			new Token(Delemiter.LPRAREN),
			new LiTToken("a", LitKind.StringLit),
			new Token(Operator.EQUALS),
			new LiTToken(3943, LitKind.IntLit),
			new Token(Delemiter.RPRAREN),
			new Token(Delemiter.RPRAREN)
		];
		let ast = new Parser().genRPN(kq);
		console.log(util.inspect(ast, false, 25, true /* enable colors */));
		expect(ast).to.be.equal(false);
	});
	// it("test post parser", () => {
	// 	let kq = [
	// 		new Token(Delemiter.LPRAREN),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.AND),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.OR),
	// 		new Token(Delemiter.LPRAREN),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.AND),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.OR),
	// 		new Token(Delemiter.LPRAREN),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.AND),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Delemiter.RPRAREN)
	// 	];
	// 	let ast = new Parser().parsePostExpr(kq);
	// 	console.log(util.inspect(ast, false, 25, true /* enable colors */));
	// 	expect(ast).to.be.equal(false);
	// });
	// it("sample 1", function () {
	// 	let kq = [
	// 		new LiTToken("Ham", LitKind.StringLit),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.R_STAR),
	// 		new Token(Delemiter.COMMA),
	// 		new LiTToken("n", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.N),
	// 		new Token(Delemiter.RPRAREN),
	// 		new LiTToken("kq", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.B),
	// 		new Token(Keyword.PRE),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(3943, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.AND),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(1, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Keyword.POST),
	// 		new Token(Basic.EOF)
	// 	];
	// 	let ast = new Parser().parse(kq);
	// 	console.log(ast);
	// 	expect(ast).to.be.equal(false);
	// });
	// it("sample2", () => {
	// 	let kq = [
	// 		new LiTToken("Ham", LitKind.StringLit),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.R_STAR),
	// 		new Token(Delemiter.COMMA),
	// 		new LiTToken("n", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.Z_STAR),
	// 		new Token(Delemiter.RPRAREN),
	// 		new LiTToken("kq", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.B),
	// 		new Token(Keyword.PRE),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.GREATER),
	// 		new LiTToken(0, LitKind.IntLit),
	// 		new Token(Keyword.POST),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(23, LitKind.IntLit),
	// 		new Token(Operator.AND),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(24, LitKind.IntLit),
	// 		new Token(Basic.EOF)
	// 	];
	// 	let ast = new Parser().parse(kq);
	// 	console.log(ast);
	// 	expect(ast).to.be.equal(false);
	// });
	// it("sample3", () => {
	// 	let kq = [
	// 		new LiTToken("Ham", LitKind.StringLit),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.R_STAR),
	// 		new Token(Delemiter.COMMA),
	// 		new LiTToken("n", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.Z_STAR),
	// 		new Token(Delemiter.RPRAREN),
	// 		new LiTToken("kq", LitKind.StringLit),
	// 		new Token(Delemiter.COLON),
	// 		new Token(DataType.B),
	// 		new Token(Keyword.PRE),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(0, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Operator.AND),
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(0, LitKind.IntLit),
	// 		new Token(Delemiter.RPRAREN),
	// 		new Token(Keyword.POST),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(23, LitKind.IntLit),
	// 		new Token(Operator.AND),
	// 		new LiTToken("a", LitKind.StringLit),
	// 		new Token(Operator.EQUALS),
	// 		new LiTToken(24, LitKind.IntLit),
	// 		new Token(Basic.EOF)
	// 	];
	// 	let ast = new Parser().parse(kq);
	// 	console.log(util.inspect(ast, false, 25, true /* enable colors */));
	// 	expect(ast).to.be.equal(false);
	// });
});
