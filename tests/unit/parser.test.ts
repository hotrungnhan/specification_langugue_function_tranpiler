import { FunctionDecl } from "@tranpiler/expr";
import { Parser } from "@tranpiler/parser";
import { Scanner } from "@tranpiler/scanner";
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
	// it("test genRPN", () => {
	// 	let kq = [
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
	// 		new Token(Delemiter.RPRAREN)
	// 	];
	// 	let ast = new Parser().genRPN(kq);
	// 	expect(ast).to.be.equal(false);
	// });
	// it("test parsePreExpr", () => {
	// 	let kq = [
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("assign", LitKind.StringLit),
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
	// 		new Token(Delemiter.RPRAREN)
	// 	];
	// 	let ast = new Parser().parsePreExpr(kq);
	// 	expect(ast).to.be.equal(false);
	// });
	// it("test parsePostExpr type 1", () => {
	// 	let kq = [
	// 		new Token(Delemiter.LPRAREN),
	// 		new LiTToken("assign", LitKind.StringLit),
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
	// 		new Token(Delemiter.RPRAREN)
	// 	];
	// 	let ast = new Parser().parsePostExpr(kq);
	// 	expect(ast).to.be.equal(false);
	// });
	// it("scanner 1->  parser", () => {
	// 	let src = ` ( (kq = a1) && (a1 >=a2))
	// 		 ||((kq=a2)&&(a2>a1))
	// 	`;

	// 	let scanner = new Scanner().scan(src);

	// 	let ast = new Parser().parsePostExpr(scanner);

	// 	expect(ast).to.be.equal(false);
	// });
	it("scanner 2 ->  parser", () => {
		let src = `a(20)> 0 && a(j) && a(z)`;

		let scanner = new Scanner().scan(src);

		let ast = new Parser().genASTTree(scanner);
		console.dir(ast, { depth: 5, colors: true });

		expect(ast).to.be.equal(false);
	});
	it("scanner->loop parser", () => {
		let src = `kq=(VM i TH {1..n-1}. TT j TH {i+1..n}.a(i) <= a(j))`;
		let src2 = `kq=(VM i TH {1..n-1}.a(i) <= a(j))`;
		let scanner = new Scanner().scan(src);
		let loop = new Parser().parseLoop(scanner);
		console.log(loop);
		let scanner2 = new Scanner().scan(src2);
		let loop2 = new Parser().parseLoop(scanner2);
		console.log(loop2);
		expect("").to.be.deep.equal(false);
	});
});
