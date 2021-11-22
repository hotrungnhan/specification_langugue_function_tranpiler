import { Operator, LitKind, LoopType, SpecialLITERAL } from "@tranpiler/token";
import { LiTToken, ValueToken } from "@tranpiler/token";
import {
	FunctionDecl,
	MathExpr,
	NestedLoopExpr,
	Operand
} from "@tranpiler/expr";
import {
	BinaryExpr,
	UnaryExpr,
	Expr,
	AssignExpr,
	IfElseExpr,
	CommandExpr
} from "@tranpiler/expr";
import { FunctionContext, VariableContext } from "@tranpiler/context";
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
				output += param.Name;
			} else {
				output += param.Name + ",";
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
			output += this.visitExpr(
				new IfElseExpr(f.Pre as MathExpr, new CommandExpr("Return"))
			);
		}
		if (f.Post) {
			output += this.visitExpr(f.Post);
		}
		if (f.Return) {
			output += this.genCommand(
				this.visitCommandExpr(new CommandExpr(`return ${f.Return.Name}`))
			);
		}
		output += "}";
		this.reset();
		return output;
	}
	visitAssignExpr(expr: AssignExpr, context?: VariableContext): string {
		let ctx: VariableContext = context ? context : this;
		if (!ctx.isVariableExist(expr.Identifier)) {
			let rt = "let";
			ctx.pushVariable(expr.Identifier);
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
			case LitKind.Unknown:
			case LitKind.IntLit:
				if (tok.Value == SpecialLITERAL.TRUE) {
					return "true";
				} else if (tok.Value == SpecialLITERAL.FALSE) {
					return "false";
				}
				return tok.Value;
			case LitKind.StringLit:
				return `"${tok.Value}"`;
		}
	}
	visitExpr(e: Operand): string {
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
		if (e instanceof NestedLoopExpr) {
			return this.visitLoop(e);
		}
		if (e instanceof CommandExpr) {
			return this.visitCommandExpr(e);
		}
		if (e instanceof LiTToken) {
			return this.visitLiterature(e);
		}
		return "";
	}
	visitCommandExpr(cm: CommandExpr) {
		return cm.Command;
	}
	visitUnary(expr: UnaryExpr): string {
		switch (expr.Type) {
			case Operator.NOT:
				return `!${expr.valueRight(this)}`;
		}
		return "";
	}
	visitBinary(expr: BinaryExpr): string {
		switch (expr.Type) {
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
	visitIfElseExpr(ifElse: IfElseExpr, nested: boolean = false): string {
		let ctx = "";
		ctx +=
			(nested ? "" : this.level.getSpaceByLevel()) +
			`if ${this.visitExpr(ifElse.Condition)}{\n`;
		this.level.incre();
		ctx += this.genCommand(this.visitExpr(ifElse.Right));
		if (ifElse.Wrong instanceof IfElseExpr) {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + `} else `;
			ctx += this.visitIfElseExpr(ifElse.Wrong, true);
			// this.level.decre();
			// ctx += this.level.getSpaceByLevel() + "}\n";
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
	visitLoop(loop: NestedLoopExpr): string {
		let loopcontext = new VariableContext();
		let ctx = "";

		this.level.incre();
		// ["VM",undefined].toString() == ["VM",undefined].toString()
		this.level.decre();

		return ctx;
	}
}
