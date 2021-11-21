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
import {
	Token,
	Operator,
	LiTToken,
	DataType,
	LitKind,
	LoopType
} from "@tranpiler/token";

let js = new JavascriptFunctionVisitor();
describe("expr test", function () {
	it("unary visit", () => {
		js.reset();
		let ast = new UnaryExpr(
			new Token(Operator.NOT),
			new LiTToken("True", LitKind.IntLit)
		);
		// ( (5||10 ) && 5
		let kq = js.visitExpr(ast);
		expect(kq).to.be.equal("!True");
		ast = new BinaryExpr(
			new Token(Operator.AND),
			new UnaryExpr(new Token(Operator.NOT), new LiTToken(5, LitKind.IntLit)),
			new LiTToken(5, LitKind.IntLit)
		);
		// ( (5||10 ) && 5
		kq = js.visitExpr(ast);
		expect(kq).to.be.equal("(!5 && 5)");
	});
	it("binary visit expr", () => {
		js.reset();
		let ast = new BinaryExpr(
			new Token(Operator.AND),
			new BinaryExpr(
				new Token(Operator.OR),
				new LiTToken(10, LitKind.IntLit),
				new LiTToken(5, LitKind.IntLit)
			),
			new LiTToken(5, LitKind.IntLit)
		);
		// ( (5||10 ) && 5
		let kq = js.visitExpr(ast);
		expect(kq).to.be.equal("((10 || 5) && 5)");
	});
	it("assign expressions", () => {
		js.reset();
		let ast = new AssignExpr(
			new VariableIdentifier("abc", DataType.N),
			new BinaryExpr(
				new Token(Operator.AND),
				new LiTToken(5, LitKind.IntLit),
				new LiTToken(5, LitKind.IntLit)
			)
		); // ( (5||10 ) && 5
		let ast2 = new AssignExpr(
			new VariableIdentifier("abc", DataType.N),
			new VariableIdentifier("cdf", DataType.N)
		);
		// ( (5||10 ) && 5
		let ast3 = new AssignExpr(
			new VariableIdentifier("abc", DataType.N),
			new LiTToken("cdf", LitKind.StringLit)
		); // ( (5||10 ) && 5

		let kq = js.visitExpr(ast);
		js.reset();
		expect(kq).to.be.equal("let abc = (5 && 5)");
		kq = js.visitExpr(ast2);
		js.reset();
		expect(kq).to.be.equal("let abc = cdf");
		kq = js.visitExpr(ast3);
		js.reset();
		expect(kq).to.be.equal('let abc = "cdf"');
	});
	it("whileloop", () => {
		js.reset();
		let f = new LoopExpr(
			LoopType.VM,
			new LiTToken(0, LitKind.IntLit),
			new LiTToken(5, LitKind.IntLit),
			new VariableIdentifier("i", DataType.N),
			new BinaryExpr(
				new Token(Operator.AND),
				new LiTToken(5, LitKind.IntLit),
				new LiTToken(5, LitKind.IntLit)
			)
		);
		let kq = js.visitLoop(f);
		expect(kq).to.be.equal("");
	});
	it("ifelse", () => {
		js.reset();
		let f = new IfElseExpr(
			new BinaryExpr(
				new Token(Operator.AND),
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			),
			new AssignExpr(
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new LiTToken("p5", LitKind.StringLit)
			)
		);
		js.reset();
		let kq = js.visitIfElseExpr(f);
		expect(kq).to.be.equal('if (p2 && p2){\n    let p2 = "p5";\n}\n');
		f = new IfElseExpr(
			new BinaryExpr(
				new Token(Operator.AND),
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			),
			new AssignExpr(
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new LiTToken("p5", LitKind.StringLit)
			),
			new AssignExpr(
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new LiTToken("p5", LitKind.StringLit)
			)
		);
		js.reset();
		kq = js.visitIfElseExpr(f);
		expect(kq).to.be.equal(
			'if (p2 && p2){\n    let p2 = "p5";\n} else {\n    let p2 = "p5";\n}\n'
		);
		f = new IfElseExpr(
			new BinaryExpr(
				new Token(Operator.AND),
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new VariableIdentifier("p2", DataType.CHAR_STAR)
			),
			new AssignExpr(
				new VariableIdentifier("p2", DataType.CHAR_STAR),
				new LiTToken("p5", LitKind.StringLit)
			),
			new IfElseExpr(
				new BinaryExpr(
					new Token(Operator.AND),
					new VariableIdentifier("p2", DataType.CHAR_STAR),
					new VariableIdentifier("p2", DataType.CHAR_STAR)
				),
				new AssignExpr(
					new VariableIdentifier("p2", DataType.CHAR_STAR),
					new LiTToken("p5", LitKind.StringLit)
				),
				new IfElseExpr(
					new BinaryExpr(
						new Token(Operator.AND),
						new VariableIdentifier("p2", DataType.CHAR_STAR),
						new VariableIdentifier("p2", DataType.CHAR_STAR)
					),
					new AssignExpr(
						new VariableIdentifier("p2", DataType.CHAR_STAR),
						new LiTToken("p5", LitKind.StringLit)
					),
					new AssignExpr(
						new VariableIdentifier("p2", DataType.CHAR_STAR),
						new LiTToken("p5", LitKind.StringLit)
					)
				)
			)
		);
		js.reset();
		kq = js.visitIfElseExpr(f);

		expect(kq).to.be.equal(
			'if (p2 && p2){\n    let p2 = "p5";\n} else if (p2 && p2){\n    let p2 = "p5";\n} else if (p2 && p2){\n    let p2 = "p5";\n} else {\n    let p2 = "p5";\n}\n}\n}\n'
		);
	});
});
export {};
