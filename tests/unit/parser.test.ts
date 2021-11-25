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
	// 	let src = ` (
	// 		(kq = FALSE) && (nam%4 !=0)
	// 	 )
	// 	 ||
	// 	 (
	// 		(kq = FALSE) && (nam%400 != 0)
	// 		&& (nam%100=0)
	// 	 ) ||
	// 	 (
	// 		(kq = TRUE)
	// 		&& (nam%4 = 0)
	// 		&& (nam%100!=0)
	// 	 )
	// 	 ||
	// 	 ( (kq = TRUE) && (nam%400=0))
	// 	`;

	// 	let scanner = new Scanner().scan(src);

	// 	let ast = new Parser().genASTTree(scanner);
	// 	console.dir(ast, { depth: 10, colors: true });
	// 	expect(ast).to.be.equal(false);
	// });
	// it("scanner 2 ->  parser", () => {
	// 	let src = `a(20)> 0 && a(j) && a(z)`;

	// 	let scanner = new Scanner().scan(src);

	// 	let ast = new Parser().genASTTree(scanner);
	// 	console.dir(ast, { depth: 5, colors: true });

	// 	expect(ast).to.be.equal(false);
	// });
	// it("template 3 ", () => {
	// 	let src = `
	// 	(
	// 	   (kq = FALSE) && (nam%4 !=0)
	// 	)
	// 	||
	// 	(
	// 	   (kq = FALSE) && (nam%400 != 0)
	// 	   && (nam%100=0)
	// 	) ||
	// 	(
	// 	   (kq = TRUE)
	// 	   && (nam%4 = 0)
	// 	   && (nam%100!=0)
	// 	)
	// 	||
	// 	( (kq = TRUE) && (nam%400=0))
	// 	`;
	// 	let scanner = new Scanner().scan(src);
	// 	let ast = new Parser().parsePostExpr(scanner);
	// 	console.dir(ast, { depth: 10, colors: true });

	// 	expect(ast).to.be.equal(false);
	// });
	// it("template 3 ", () => {
	// 	let src = `
	// 	   (kq = FALSE) && (nam%4 != 0)
	// 	   && (kq = FALSE) && (nam%400 != 0)
	// 	   && (nam%100=0)
	// 	   && (nam%4 = 0)
	// 	   && (nam%100!=0)
	// 	`;
	// 	let scanner = new Scanner().scan(src);
	// 	console.log();

	// 	let ast = new Parser().parsePostExpr(scanner);
	// 	console.dir(ast, { depth: 4, colors: true });

	// 	expect(ast).to.be.equal(false);
	// });
	it("scanner->loop parser", () => {
		let src = `x = -b/a`;
		let scanner = new Scanner().scan(src);
		let loop = new Parser().genRPN(scanner);
		// let kq = new Parser().genIfElse(loop);
		console.log(loop, { depth: 5 });
		expect("").to.be.deep.equal(false);
	});
	it("scanner->loop parser", () => {
		let src = `x = -b/a`;
		let scanner = new Scanner().scan(src);
		
		let loop = new Parser().genRPN(scanner);
		let loop2 = new Parser().genASTTree(scanner);
		console.dir(loop, { depth: 5 });
		console.dir(loop2, { depth: 5 });
		expect("").to.be.deep.equal(false);
	});
});
