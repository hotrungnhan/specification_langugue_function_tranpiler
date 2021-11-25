import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import {
	FunctionDecl,
	NestedLoopExpr,
	Operand,
	VariableIdentifier
} from "@tranpiler/expr";
import {
	BinaryExpr,
	UnaryExpr,
	IfElseExpr,
	AssignExpr,
	Expr
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
import { Scanner } from "@tranpiler/scanner";
import { Parser } from "@tranpiler/parser";

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
	it("Array injector", () => {
		let token = new Scanner().scan("x=a(5+a)");
		let array = new Parser().parsePostExpr(token) as Operand;
		let js = new JavascriptFunctionVisitor();
		let kq = js.visitExpr(array);
		console.log(array);
		
		console.log(kq);

		expect(token).to.be.deep.equal(kq);
	});
	// it("whileloop", () => {
	// 	js.reset();
	// 	let f = new FunctionDecl(
	// 		"HelloWorld",
	// 		[
	// 			new VariableIdentifier("p1", DataType.Z_STAR),
	// 			new VariableIdentifier("p2", DataType.CHAR_STAR)
	// 		],
	// 		undefined,
	// 		new VariableIdentifier("kq", DataType.B)
	// 	);
	// 	let kq = js.visitFunction(f);
	// 	expect(kq).to.be.equal(
	// 		"function HelloWorld(p1,p2){\n    let kq;\n    return kq;\n}' to equal 'function HelloWorld(p1,p2){\n    let kq;\n}"
	// 	);
	// });
});
export {};
