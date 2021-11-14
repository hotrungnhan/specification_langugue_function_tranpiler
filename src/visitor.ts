import { DataType, Operator, Keyword } from "@/token";
import { FunctionDecl } from "@/function";
import { ExprAST, BinaryExpr, UnaryExpr, Expr } from "@/expr";
export interface FunctionVisitor {
	visitFunction(f: FunctionDecl): string;
	visitExprAST(AST: ExprAST): string;
	visitExpr(expr: Expr): string;
	visitUnary(expr: BinaryExpr): string;
	visitBinary(expr: BinaryExpr): string;
	// visitForLoop(AST: ForloopExpr): string;
}
export class JavascriptFunctionVisitor implements FunctionVisitor {
	visitFunction(f: FunctionDecl): string {
		let ctx = `function ${f.functionName}`;
		ctx += "(";
		f.Parameter.forEach((param, index, arr) => {
			if (index == arr.length - 1) {
				// last parameter
				ctx += param.name;
			} else {
				ctx += param.name + ",";
			}
		});
		ctx += "){\n";
		ctx += this.visitExprAST(f.Pre);
		ctx += this.visitExprAST(f.Post);
		ctx += "}";
		return ctx;
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
		return "";
	}
	visitUnary(expr: UnaryExpr): string {
		switch (expr.token.type) {
			case Operator.NOT:
				return `!${expr.visitRight(this)}`;
		}
		return "";
	}
	visitBinary(expr: BinaryExpr): string {
		switch (expr.token.type) {
			case Operator.ASSIGN:
				return `(${expr.visitLeft(this)} = ${expr.visitRight(this)})`;
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
class Blocklevel {
	level = 0;
	incre() {
		this.level += 1;
		return this.level;
	}
	decre() {
		this.level -= 1;
		return this.level;
	}
	addSpaceByLevel() {
		return " ".repeat(4 * this.level);
	}
}
// }
// export class PythonFunctionVisitor implements FunctionVisitor {
// 	visitFunction(f: FunctionDecl): string {
// 		let currentBlockLevel = new Blocklevel();
// 		let ctx = `def ${f.functionName}`;
// 		ctx += "(";
// 		f.Parameter.forEach((param, index, arr) => {
// 			if (index == arr.length - 1) {
// 				// last parameter
// 				ctx += param.name;
// 			} else {
// 				ctx += param.name + ",";
// 			}
// 		});
// 		ctx += "):\n";
// 		currentBlockLevel.incre();
// 		ctx += this.visitExprAST(f.Pre);
// 		ctx += this.visitExprAST(f.Pre);
// 		return ctx;
// 	}
// 	visitExprAST(AST: ExprAST): string {
// 		return "";
// 	}
// }
