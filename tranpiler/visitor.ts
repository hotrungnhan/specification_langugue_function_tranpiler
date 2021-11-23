import { ArrayInjectorExpr, FunctionDecl } from "@tranpiler/expr";
import { BinaryExpr, Expr, AssignExpr, IfElseExpr } from "@tranpiler/expr";
import { LiTToken } from "@tranpiler/token";
export interface FunctionVisitor {
	visitFunction(f: FunctionDecl): string;
	visitExpr(expr: Expr): string;
	visitUnary(expr: BinaryExpr): string;
	visitBinary(expr: BinaryExpr): string;
	visitAssignExpr(expr: AssignExpr): string;
	visitLiterature(tok: LiTToken): string;
	visitIfElseExpr(ifElse: IfElseExpr): string;
	reset(): void;
	generateDemoFunctionCall(f: FunctionDecl): string;
	visitArrayInjectorExpr(e: ArrayInjectorExpr): string;
	// visitForLoop(AST: ForloopExpr): string;
}
