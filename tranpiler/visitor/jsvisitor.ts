import { Operator, LitKind } from "@tranpiler/token";
import { LiTToken, ValueToken } from "@tranpiler/token";
import { FunctionDecl } from "@tranpiler/function";
import {
	BinaryExpr,
	UnaryExpr,
	Expr,
	AssignExpr,
	IfElseExpr
} from "@tranpiler/expr";
import { FunctionContext } from "@tranpiler/context";
import { FunctionVisitor } from "@tranpiler/visitor";
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
		this.concatVariable(f.Parameter);
		output += "){\n";
		// declare output variable
		this.level.incre();
		if (f.Return) {
			output += this.genCommand(this.visitAssignExpr(new AssignExpr(f.Return)));
		}
		if (f.Pre) {
			output += this.visitExpr(f.Pre);
		}
		f.Post.forEach((post) => {
			output += this.visitExpr(post);
		});
		output += "}";
		this.reset();
		return output;
	}
	visitAssignExpr(expr: AssignExpr): string {
		if (!this.isVariableExist(expr.Identifier)) {
			let rt = "let";
			this.pushVariable(expr.Identifier);
			if (expr.HasValue) {
				return `${rt} ${expr.VariableName} = ${expr.Value(this)}`;
			} else {
				return `${rt} ${expr.VariableName}`;
			}
		} else {
			if (expr.HasValue) {
				return `${expr.VariableName} = ${expr.Value(this)}`;
			}
		}
		return "";
	}
	visitLiterature(tok: LiTToken): string {
		switch (tok.Kind) {
			case LitKind.FloatLit:
			case LitKind.IntLit:
				return tok.Value;
			case LitKind.StringLit:
				return `"${tok.Value}"`;
		}
		return "";
	}
	visitExpr(e: Expr): string {
		if (e instanceof UnaryExpr) {
			return this.visitUnary(e);
		}
		if (e instanceof BinaryExpr) {
			return this.visitBinary(e);
		}
		if (e instanceof AssignExpr) {
			return this.visitAssignExpr(e);
		}
		if (e instanceof IfElseExpr) {
			return this.visitIfElseExpr(e);
		}
		return "";
	}
	visitUnary(expr: UnaryExpr): string {
		switch (expr.type) {
			case Operator.NOT:
				return `!${expr.valueRight(this)}`;
		}
		return "";
	}
	visitBinary(expr: BinaryExpr): string {
		switch (expr.type) {
			// case Operator.ASSIGN:
			// return `(${expr.visitLeft(this)} = ${expr.visitRight(this)})`;
			case Operator.PLUS:
				return `(${expr.valueRight(this)} + ${expr.valueRight(this)})`;
			case Operator.MINUS:
				return `(${expr.valueRight(this)} - ${expr.valueRight(this)})`;
			case Operator.STAR:
				return `(${expr.valueRight(this)} * ${expr.valueRight(this)})`;
			case Operator.SLASH:
				return `(${expr.valueRight(this)} / ${expr.valueRight(this)})`;
			case Operator.PERCENT:
				return `(${expr.valueLeft(this)} % ${expr.valueRight(this)})`;
			case Operator.GREATER:
				return `(${expr.valueLeft(this)} > ${expr.valueRight(this)})`;
			case Operator.LESSER:
				return `(${expr.valueLeft(this)} < ${expr.valueRight(this)})`;
			case Operator.EQUALS:
				return `(${expr.valueLeft(this)} == ${expr.valueRight(this)})`;
			case Operator.NOT_EQUAL:
				return `(${expr.valueLeft(this)} != ${expr.valueRight(this)})`;
			case Operator.GREATER_EQUAL:
				return `(${expr.valueLeft(this)} >= ${expr.valueRight(this)})`;
			case Operator.LESSER_EQUAL:
				return `(${expr.valueLeft(this)} <= ${expr.valueRight(this)})`;
			case Operator.AND:
				return `(${expr.valueLeft(this)} && ${expr.valueRight(this)})`;
			case Operator.OR:
				return `(${expr.valueLeft(this)} || ${expr.valueRight(this)})`;
		}
		return "";
	}
	visitIfElseExpr(ifElse: IfElseExpr): string {
		let ctx = "";
		this.visitExpr;
		ctx +=
			this.level.getSpaceByLevel() +
			`if ${this.visitExpr(ifElse.Condition)}{\n`;
		this.level.incre();
		ctx += this.genCommand(this.visitExpr(ifElse.Right));
		if (ifElse.Wrong instanceof IfElseExpr) {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + `} else `;
			ctx += this.visitIfElseExpr(ifElse.Wrong);
			// this.level.decre();
			ctx += this.level.getSpaceByLevel() + "}\n";
		} else if (ifElse.Wrong) {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + `} else {\n`;
			this.level.incre();
			ctx += this.genCommand(this.visitExpr(ifElse.Wrong));
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + "}\n";
		} else {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + "}\n";
		}
		return ctx;
	}
	// visitForLoop(AST: ForloopExpr): string {
	// 	return "";
	// }
}
