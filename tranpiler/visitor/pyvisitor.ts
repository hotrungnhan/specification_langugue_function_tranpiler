import {
	Expr,
	BinaryExpr,
	AssignExpr,
	IfElseExpr,
	FunctionDecl
} from "@tranpiler/expr";
import { LiTToken } from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";

export class PythonFunctionVisitor implements FunctionVisitor {
	visitExpr(expr: Expr): string {
		throw new Error("Method not implemented.");
	}
	visitUnary(expr: BinaryExpr): string {
		throw new Error("Method not implemented.");
	}
	visitBinary(expr: BinaryExpr): string {
		throw new Error("Method not implemented.");
	}
	visitAssignExpr(expr: AssignExpr): string {
		throw new Error("Method not implemented.");
	}
	visitLiterature(tok: LiTToken): string {
		throw new Error("Method not implemented.");
	}
	visitIfElseExpr(ifElse: IfElseExpr): string {
		throw new Error("Method not implemented.");
	}
	reset(): void {
		throw new Error("Method not implemented.");
	}
	visitFunction(f: FunctionDecl): string {
		throw new Error("Method not implemented.");
	}
}
export {};
