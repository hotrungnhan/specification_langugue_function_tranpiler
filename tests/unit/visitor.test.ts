import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/function";
import {
	BinaryExpr,
	UnaryExpr,
	IfElseExpr,
	AssignExpr,
	Expr
} from "@tranpiler/expr";
import util from "util";
import { Token, Operator, LiTToken, DataType, LitKind } from "@tranpiler/token";

let js = new JavascriptFunctionVisitor();
describe("visitor test", function () {
	it("function return", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[],
			[],
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).equal(`function HelloWorld(){
    let kq;
}`);
	});
	it("declare Visit", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[
				new VariableIdentifier("p1", DataType.N_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			],
			[],
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).to.be.equal(`function HelloWorld(p1,p2){
    let kq;
}`);
	});
	it("set variable which already declare on parameter", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[
				new VariableIdentifier("p1", DataType.N_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			],
			[new AssignExpr(new VariableIdentifier("p1", DataType.N_STAR))],
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).to.be.equal(`function HelloWorld(p1,p2){
    let kq;
}`);
	});
});
export {};
