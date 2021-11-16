import { FunctionDecl } from "@web/tranpiler/function";
import { ExprAST, BinaryExpr, Expr, DeclareVariableExpr } from "@web/tranpiler/expr";
export interface FunctionVisitor {
	visitFunction(f: FunctionDecl): string;
	visitExprAST(AST: ExprAST): string;
	visitExpr(expr: Expr): string;
	visitUnary(expr: BinaryExpr): string;
	visitBinary(expr: BinaryExpr): string;
	visitDeclareVariable(expr: DeclareVariableExpr): string;
	// visitForLoop(AST: ForloopExpr): string;
}