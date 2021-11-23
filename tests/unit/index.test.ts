import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/expr";
import {
	BinaryExpr,
	UnaryExpr,
	IfElseExpr,
	AssignExpr,
	Expr,
	NestedLoopExpr
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

describe("Tranpiler test", function () {
	// it("template 1 ", () => {
	// 	let src = `GiaiPhuongTrinhBac1(a:R,b:R)x:R
	//     pre a != 0
	//     post (x = 5 && x=10 ) || (x = 5 && x = 20)
	//     `;
	// 	const tp = new SpecTranpiler();
	// 	let kq = tp.convert(src);
	// 	expect(kq).to.be.equal(
	// 		`function GiaiPhuongTrinhBac1(a,b){\n    let x;\n    if (a != 0){\n        Return;\n    }\n    if (x == 10){\n        x = 5;\n    } else if (x == 20){\n        x = 5;\n    }\n    return x;\n}`
	// 	);
	// });
	// it("template 2 ", () => {
	// 	let src = `Max2SoDuong  (a1 :R , a2 : R) kq : R
	// 	pre (  (a1 > 0) && ( a2 >0)  )
	// 	post ( (kq = a1) && (a1 >=a2))
	// 		 ||((kq=a2)&&(a2>a1))
	// 	`;

	// 	const tp = new SpecTranpiler();
	// 	let kq = tp.convert(src);
	// 	expect(kq).to.be.equal(
	// 		`function Max2SoDuong(a1,a2){\n    let kq;\n    if ((a1 > 0) && (a2 > 0)){\n        Return;\n    }\n    if (a1 >= a2){\n        kq = a1;\n    } else if (a2 > a1){\n        kq = a2;\n    }\n    return kq;\n}`
	// 	);
	// });
	// it("template 3 ", () => {
	// 	let src = `Max2SoDuong  (a1 :R , a2 : R) kq : R
	// 	pre (  (a1 > 0) && ( a2 >0)  )
	// 	post ( (kq = a1) && (a1 >=a2))
	// 		 ||((kq=a2)&&(a2>a1))
	// 	`;

	// 	const tp = new SpecTranpiler();
	// 	let kq = tp.convert(src);
	// 	expect(kq).to.be.equal(``);
	// });
	// it("template 3 ", () => {
	// 	let src = `LaNamNhuan   (  nam    :   Z) kq : B
	// 	pre   (nam>0)
	// 	post
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

	// 	const tp = new SpecTranpiler({ parser: true });
	// 	let kq = tp.convert(src);
	// 	expect(kq).to.be.equal(``);
	// });
	it("template 3 ", () => {
		let src = `Ham (a:R*, n:N)kq:B
		pre 
		post kq = (VM i TH {1..n-1}. a(2)<= a(5))
		`;
		const tp = new SpecTranpiler({ parser: true });
		let kq = tp.convert(src);
		expect(kq).to.be.equal(``);
	});
});
export {};
