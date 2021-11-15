import { Operator, LitKind } from "@/token";
import { LiTToken, ValueToken } from "token";
import { FunctionDecl } from "@/function";
import {
	ExprAST,
	BinaryExpr,
	UnaryExpr,
	Expr,
	DeclareVariableExpr
} from "@/expr";
import { FunctionContext } from "@/context";
import { FunctionVisitor } from "@/visitor";
export class JavascriptFunctionVisitor
	extends FunctionContext
	implements FunctionVisitor
{
	genCommand(str: string) {
		return `${this.level.getSpaceByLevel()}${str};\n`;
	}
	visitFunction(f: FunctionDecl): string {
		let output = `function ${f.functionName}`;
		output += "(";
		//setup parameter
		f.Parameter.forEach((param, index, arr) => {
			if (index == arr.length - 1) {
				// last parameter
				output += param.name;
			} else {
				output += param.name + ",";
			}
		});
		output += "){\n";
		// declare output variable
		this.level.incre();
		output += this.visitDeclareVariable(new DeclareVariableExpr(f.Return));
		output += this.visitExprAST(f.Pre);
		output += this.visitExprAST(f.Post);
		output += "}";
		return output;
	}
	visitDeclareVariable(expr: DeclareVariableExpr): string {
		if (expr.valueToken) {
			return this.genCommand(
				`let ${expr.Name} = ${this.visitLiterature(expr.valueToken)}`
			);
		} else {
			return this.genCommand(`let ${expr.Name}`);
		}
	}
	visitLiterature(tok: LiTToken): string {
		switch (tok.Kind) {
			case LitKind.FloatLit:
			case LitKind.IntLit:
				return tok.Value;
			case LitKind.StringLit:
				return `"${tok.Value}"`;
		}
	}
	visitExprAST(ast: ExprAST): string {
		return ast.visitNode(this);
	}
	visitExpr(e: Expr): string {
		if (e instanceof UnaryExpr) {
			return this.visitUnary(e);
		}
		if (e instanceof BinaryExpr) {
			return this.visitBinary(e);
		}
		if (e instanceof DeclareVariableExpr) {
			return this.visitDeclareVariable(e);
		}
		return "";
	}
	visitUnary(expr: UnaryExpr): string {
		switch (expr.type) {
			case Operator.NOT:
				return `!${expr.visitRight(this)}`;
		}
		return "";
	}
	visitBinary(expr: BinaryExpr): string {
		switch (expr.type) {
			// case Operator.ASSIGN:
			// return `(${expr.visitLeft(this)} = ${expr.visitRight(this)})`;
			case Operator.PLUS:
				return `(${expr.visitLeft(this)} + ${expr.visitRight(this)})`;
			case Operator.MINUS:
				return `(${expr.visitLeft(this)} - ${expr.visitRight(this)})`;
			case Operator.STAR:
				return `(${expr.visitLeft(this)} * ${expr.visitRight(this)})`;
			case Operator.SLASH:
				return `(${expr.visitLeft(this)} / ${expr.visitRight(this)})`;
			case Operator.PERCENT:
				return `(${expr.visitLeft(this)} % ${expr.visitRight(this)})`;
			case Operator.GREATER:
				return `(${expr.visitLeft(this)} > ${expr.visitRight(this)})`;
			case Operator.LESSER:
				return `(${expr.visitLeft(this)} < ${expr.visitRight(this)})`;
			case Operator.EQUALS:
				return `(${expr.visitLeft(this)} == ${expr.visitRight(this)})`;
			case Operator.NOT_EQUAL:
				return `(${expr.visitLeft(this)} != ${expr.visitRight(this)})`;
			case Operator.GREATER_EQUAL:
				return `(${expr.visitLeft(this)} >= ${expr.visitRight(this)})`;
			case Operator.LESSER_EQUAL:
				return `(${expr.visitLeft(this)} <= ${expr.visitRight(this)})`;
			case Operator.AND:
				return `(${expr.visitLeft(this)} && ${expr.visitRight(this)})`;
			case Operator.OR:
				return `(${expr.visitLeft(this)} || ${expr.visitRight(this)})`;
		}
		return "";
	}
	// visitForLoop(AST: ForloopExpr): string {
	// 	return "";
	// }
}
