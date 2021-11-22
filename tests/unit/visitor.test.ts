import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/expr";
import {
	BinaryExpr,
	UnaryExpr,
	IfElseExpr,
	AssignExpr,
	Expr,
	LoopExpr
} from "@tranpiler/expr";
import util from "util";
import {
	Token,
	Operator,
	LiTToken,
	DataType,
	LitKind,
	LoopType
} from "@tranpiler/token";

let js = new JavascriptFunctionVisitor();
describe("visitor test", function () {
	it("function return", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[],
			undefined,
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).equal(`function HelloWorld(){\n    let kq;\n    return kq;\n}`);
	});
	it("declare Visit", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[
				new VariableIdentifier("p1", DataType.Z_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			],
			undefined,
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).to.be.equal(
			`function HelloWorld(p1,p2){\n    let kq;\n    return kq;\n}`
		);
	});
	it("set variable which already declare on parameter", () => {
		let f = new FunctionDecl(
			"HelloWorld",
			[
				new VariableIdentifier("p1", DataType.Z_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			],
			new AssignExpr(new VariableIdentifier("p1", DataType.Z_STAR)),
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).to.be.equal(
			`function HelloWorld(p1,p2){\n    let kq;\n    return kq;\n}`
		);
	});
	it("whileloop", () => {
		js.reset();
		let f = new FunctionDecl(
			"HelloWorld",
			[
				new VariableIdentifier("p1", DataType.Z_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			],

			new LoopExpr(
				LoopType.VM,
				new LiTToken(0, LitKind.IntLit),
				new LiTToken(5, LitKind.IntLit),
				new VariableIdentifier("i", DataType.N),
				new BinaryExpr(
					new Token(Operator.AND),
					new LiTToken(5, LitKind.IntLit),
					new LiTToken(5, LitKind.IntLit)
				)
			),
			undefined,
			new VariableIdentifier("kq", DataType.B)
		);
		let kq = js.visitFunction(f);
		expect(kq).to.be.equal(
			"function HelloWorld(p1,p2){\n    let kq;\n    return kq;\n}' to equal 'function HelloWorld(p1,p2){\n    let kq;\n}"
		);
	});
});
export {};
