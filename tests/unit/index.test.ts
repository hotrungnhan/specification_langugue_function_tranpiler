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
import { Scanner } from "@tranpiler/scanner";
import { Parser } from "@tranpiler/parser";
import { SpecTranpiler } from "@tranpiler/index";

let js = new JavascriptFunctionVisitor();
describe("Tranpiler test", function () {
	it("template 1 ", () => {
		let src = `GiaiPhuongTrinhBac1(a:R,b:R)x:R
        pre a != 0
        post (x = 5 && x=10 ) || (x = 5 && x = 20)
        `;
		const tp = new SpecTranpiler({ parser: true });
		console.log(tp.convert(src));
		expect("").to.be.equal([]);
	});
});
describe("Tranpiler test 2 ", function () {
	it("template 1 ", () => {
		let src = `Max2SoDuong  (a1 :R , a2 : R) kq : R
		pre (  (a1 > 0) && ( a2 >0)  )
		post ( (kq = a1) && (a1 >=a2))
			 ||((kq=a2)&&(a2>a1))
		`;

		const tp = new SpecTranpiler({ parser: true });
		console.log(tp.convert(src));
		expect("").to.be.equal([]);
	});
});
export {};
