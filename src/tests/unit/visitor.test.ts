import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@web/tranpiler/visitor/jsvisitor";
import { FunctionDecl, VariableIdentifier } from "@web/tranpiler/function";
import { ExprAST, BinaryExpr, UnaryExpr } from "@web/tranpiler/expr";
import util from "util";
import {
	Token,
	Operator,
	LiTToken,
	DataType,
	LitKind,
	NameToken
} from "@web/tranpiler/token";
let f = new FunctionDecl(
	"HelloWorld",
	[],
	new VariableIdentifier("kq", DataType.B),
	new ExprAST(),
	new ExprAST()
);
let js = new JavascriptFunctionVisitor();
describe("visitor test", function () {
	it("main function declare", () => {
		let kq = js.visitFunction(f);
		expect(kq).equal(`function HelloWorld(){
    let kq;
}`);
	});
	it("unary visit", () => {
		let ast = new ExprAST(
			new UnaryExpr(
				new Token(Operator.NOT),
				new LiTToken("True", LitKind.StringLit)
			)
		); // ( (5||10 ) && 5
		let kq = js.visitExprAST(ast);
		expect(kq).to.be.equal("!True");
	});
	it("binary visit expr", () => {
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
		let kq = js.visitExprAST(ast);
		expect(kq).to.be.equal("((10 || 5) && 5)");
	});
	it("unary visit expr", () => {
		let ast = new ExprAST(
			new BinaryExpr(
				new Token(Operator.AND),
				new UnaryExpr(new Token(Operator.NOT), new LiTToken(5, LitKind.IntLit)),
				new LiTToken(5, LitKind.IntLit)
			)
		); // ( (5||10 ) && 5
		let kq = js.visitExprAST(ast);
		expect(kq).to.be.equal("(!5 && 5)");
	});
	it("binary visit expr", () => {
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
		let kq = js.visitExprAST(ast);
		expect(kq == "(10 || 5) && 5");
	});
});
export {}