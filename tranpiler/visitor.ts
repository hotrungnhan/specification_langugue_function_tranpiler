import { FunctionDecl } from "@tranpiler/function";
import { ExprAST, BinaryExpr, Expr, DeclareVariableExpr } from "@tranpiler/expr";
export interface FunctionVisitor {
	visitFunction(f: FunctionDecl): string;
	visitExprAST(AST: ExprAST): string;
	visitExpr(expr: Expr): string;
	visitUnary(expr: BinaryExpr): string;
	visitBinary(expr: BinaryExpr): string;
	visitDeclareVariable(expr: DeclareVariableExpr): string;
	// visitForLoop(AST: ForloopExpr): string;
}