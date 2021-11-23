import {
	BinaryExpr,
	UnaryExpr,
	Expr,
	AssignExpr,
	IfElseExpr,
	CommandExpr,
	NestedLoopExpr
} from "@tranpiler/expr";
import { DataType, LiTToken } from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { Operator, LitKind, LoopType } from "@tranpiler/token";
import { FunctionDecl, MathExpr, Operand } from "@tranpiler/expr";
import { FunctionContext, VariableContext } from "@tranpiler/context";

export class PythonFunctionVisitor
	extends FunctionContext
	implements FunctionVisitor
{
	genCommand(str: string) {
		return `${this.level.getSpaceByLevel()}${str};\n`;
	}
	generateDemoFunctionCall(f: FunctionDecl) {
		const Param = f.Parameter.map((param) => {
			switch (param.Type) {
				case DataType.B:
					return "True";
				case DataType.CHAR_STAR:
					return '"demo string"';
				case DataType.N:
					return "5";
				case DataType.R:
					return "4.54";
				case DataType.R_STAR:
					return "[2.43,4.534]";
				case DataType.Z:
					return "-2492";
				case DataType.Z_STAR:
					return "[-4,1,100]";
			}
			return "unknowntype";
		});
		let paramcall = Param.join(",");
		return `${f.functionName}(${paramcall})`;
	}
	visitFunction(f: FunctionDecl): string {
		let output = `def ${f.functionName}`;
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
		output += ") : \n";
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
				return `(${expr.valueLeft(this)} not ${expr.valueRight(this)})`;
			case Operator.GREATER_EQUAL:
				return `(${expr.valueLeft(this)} >= ${expr.valueRight(this)})`;
			case Operator.LESSER_EQUAL:
				return `(${expr.valueLeft(this)} <= ${expr.valueRight(this)})`;
			case Operator.AND:
				return `(${expr.valueLeft(this)} and ${expr.valueRight(this)})`;
			case Operator.OR:
				return `(${expr.valueLeft(this)} or ${expr.valueRight(this)})`;
		}
		return "";
	}
	visitIfElseExpr(ifElse: IfElseExpr): string {
		let ctx = "";
		ctx +=
			this.level.getSpaceByLevel() +
			`if ${this.visitExpr(ifElse.Condition)}: \n`;
		this.level.incre();
		ctx += this.genCommand(this.visitExpr(ifElse.Right));
		if (ifElse.Wrong instanceof IfElseExpr) {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + ` else: `;
			ctx += this.visitIfElseExpr(ifElse.Wrong);
			// this.level.decre();
			ctx += this.level.getSpaceByLevel() + "\n";
		} else if (ifElse.Wrong) {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + ` else :\n`;
			this.level.incre();
			ctx += this.genCommand(this.visitExpr(ifElse.Wrong));
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + "\n";
		} else {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + "\n";
		}
		return ctx;
	}
	visitLoop(loop: NestedLoopExpr): string {
		// 	let loopcontext = new VariableContext();
		// 	let ctx = "";
		// 	ctx +=
		// 		this.level.getSpaceByLevel() +
		// 		`for (${this.visitAssignExpr(loop.Variable, loopcontext)};`;
		// 	loopcontext.pushVariable(loop.Identifier);
		// 	ctx += `${this.visitBinary(loop.ConditionExpr)};${this.visitAssignExpr(
		// 		loop.IncrementByOne,
		// 		loopcontext
		// 	)}){\n`;
		// 	this.level.incre();
		// 	if (loop.Type == LoopType.TT) {
		// 		// ctx += this.visitExpr();
		// 	} else if (loop.Type == LoopType.VM) {
		// 	}
		// 	this.level.decre();
		// 	// if (loop.Body) {
		// 	// 	ctx += this.visitExpr(loop.Body);
		// 	// }
		// 	ctx += this.level.getSpaceByLevel() + "}\n";
		// 	return ctx;
		// }
		throw new Error("Method not implemented.");
	}
}
