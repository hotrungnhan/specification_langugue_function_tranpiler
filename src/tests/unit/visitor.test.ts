import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@/visitor";
import { FunctionDecl } from "@/function";
import { ExprAST, BinaryExpr } from "@/expr";
import util from "util";
import { Token, Operator, LiTToken, LitKind, NameToken } from "@/token";
describe("visitor test", () => {
	let f = new FunctionDecl("HelloWorld", [], new ExprAST(), new ExprAST());
	let js = new JavascriptFunctionVisitor();
});
describe("expAST", () => {
	let f = new FunctionDecl("HelloWorld", [], new ExprAST(), new ExprAST());
	let js = new JavascriptFunctionVisitor();
	let ast = new ExprAST(
		new BinaryExpr(
			new Token(Operator.AND),
			new BinaryExpr(
				new Token(Operator.OR),
				new LiTToken(10, LitKind.IntLit),
				new LiTToken(5, LitKind.IntLit)
			),
			new LiTToken(5, LitKind.IntLit)
		)
	); // ( (5||10 ) && 5
	let ast2 = new ExprAST(
		new BinaryExpr(
			new Token(Operator.AND),
			new BinaryExpr(
				new Token(Operator.OR),
				new NameToken("abc"),
				new LiTToken(5, LitKind.IntLit)
			),
			new NameToken("abcd")
		)
	); // ( (5||10 ) && 5
	console.log(util.inspect(f, false, 5, true));
	console.log(js.visitExprAST(ast));
	console.log(js.visitExprAST(ast2));
});
