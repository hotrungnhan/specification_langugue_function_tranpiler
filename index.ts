import { expect, should } from "chai";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/expr";
import {
	BinaryExpr,
	UnaryExpr,
	IfElseExpr,
	AssignExpr,
	Expr
} from "@tranpiler/expr";
import {
	Token,
	Operator,
	LiTToken,
	DataType,
	LitKind,
	LoopType,
	Delemiter
} from "@tranpiler/token";
import { Parser } from "@tranpiler/parser";
export {};
let kq = [
	new Token(Delemiter.LPRAREN),
	new LiTToken("a", LitKind.StringLit),
	new Token(Operator.EQUALS),
	new LiTToken(0, LitKind.IntLit),
	new Token(Delemiter.RPRAREN),
	new Token(Operator.AND),
	new Token(Delemiter.LPRAREN),
	new LiTToken("a", LitKind.StringLit),
	new Token(Operator.EQUALS),
	new LiTToken(0, LitKind.IntLit),
	new Token(Delemiter.RPRAREN)
];
let ast = new Parser().genRPN(kq);
