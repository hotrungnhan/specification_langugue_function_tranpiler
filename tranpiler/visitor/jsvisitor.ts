import {
	Operator,
	LitKind,
	LoopType,
	SpecialLITERAL,
	DataType,
	Token
} from "@tranpiler/token";
import { LiTToken, ValueToken } from "@tranpiler/token";
import {
	ArrayInjectorExpr,
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
	f: FunctionDecl | undefined;
	generateDemoFunctionCall(f: FunctionDecl) {
		function isArray(type: DataType | undefined): boolean {
			return (
				type == DataType.CHAR_STAR ||
				type == DataType.R_STAR ||
				type == DataType.Z_STAR
			);
		}
		// const Param = f.Parameter.map((param) => {
		// 	switch (param.Type) {
		// 		case DataType.B:
		// 			return "True";
		// 		case DataType.CHAR_STAR:
		// 			return '"demo string"';
		// 		case DataType.N:
		// 			return "2";
		// 		case DataType.R:
		// 			return "4.54";
		// 		case DataType.R_STAR:
		// 			return "[2.43,4.534]";
		// 		case DataType.Z:
		// 			return "-2492";
		// 		case DataType.Z_STAR:
		// 			return "[-4,1,100]";
		// 	}
		// 	return "unknowntype";
		// });
		// let paramcall = Param.join(",");
		let indexArrr = f.Parameter.map((value, index) => {
			if (isArray(value.Type)) {
				return index;
			} else return undefined;
		})
			.filter((value) => value != undefined)
			.join(",");
		let template = `
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const arr = []
const parramIndex = [${indexArrr}]
rl.on('line', function (line) {
    if (parramIndex.find((value) => value == arr.length) != undefined) {
        arr.push(line.split(" "))
    } else {
        arr.push(line)
    }
    if (arr.length >= ${f.Parameter.length}) {
        console.log(${f.functionName}(...arr))
        rl.close()
    }
})
`;
		return template;
	}
	genCommand(str: string) {
		return `${this.level.getSpaceByLevel()}${str};\n`;
	}
	visitFunction(f: FunctionDecl): string {
		this.f = f;
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
			if (f.Return.Type == DataType.R_STAR || f.Return.Type == DataType.Z_STAR)
				output += this.genCommand(
					this.visitAssignExpr(
						new AssignExpr(f.Return, new LiTToken("[]", LitKind.Unknown))
					)
				);
			else {
				output += this.genCommand(
					this.visitAssignExpr(new AssignExpr(f.Return))
				);
			}
		}
		if (f.Pre) {
			output += this.visitExpr(
				new IfElseExpr(f.Pre as MathExpr, new CommandExpr("return"))
			);
		}
		if (f.Post) {
			// ch?? ??
			if (f.Post instanceof IfElseExpr || f.Post instanceof NestedLoopExpr) {
				output += this.visitExpr(f.Post);
			} else {
				output += this.genCommand(this.visitExpr(f.Post));
			}
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
	reset() {
		super.reset();
		this.f = undefined;
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
		console.log(e);
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
		if (e instanceof ArrayInjectorExpr) {
			return this.visitArrayInjectorExpr(e);
		}

		return "";
	}
	visitArrayInjectorExpr(e: ArrayInjectorExpr): string {
		return `${e.ArrayName}[${e.PositionValue(this)}]`;
	}
	visitCommandExpr(cm: CommandExpr) {
		return cm.Command;
	}
	visitUnary(expr: UnaryExpr): string {
		switch (expr.Type) {
			case Operator.NOT:
				return `(!${expr.valueRight(this)})`;
			case Operator.UNARY_PLUS:
				return `${expr.valueRight(this)}`;
			case Operator.UNARY_MINUS:
				return `-${expr.valueRight(this)}`;
		}
		return "";
	}
	visitBinary(expr: BinaryExpr): string {
		switch (expr.Type) {
			// case Operator.ASSIGN:
			// return `(${expr.visitLeft(this)} = ${expr.visitRight(this)})`;

			case Operator.PLUS:
				return `(${expr.valueLeft(this)} + ${expr.valueRight(this)})`;
			case Operator.MINUS:
				return `(${expr.valueLeft(this)} - ${expr.valueRight(this)})`;
			case Operator.STAR:
				return `(${expr.valueLeft(this)} * ${expr.valueRight(this)})`;
			case Operator.SLASH:
				return `(${expr.valueLeft(this)} / ${expr.valueRight(this)})`;
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
		let varcontext = new VariableContext();
		let ctx = "";
		//supper hard code;
		// single loop
		if (loop.parameter.length == 1) {
			if (loop.parameter[0].type == LoopType.TT) {
				ctx +=
					this.level.getSpaceByLevel() +
					this.visitCommandExpr(
						new CommandExpr(`${this.f?.Return?.Name}=false`)
					) +
					"\n";
				ctx +=
					this.level.getSpaceByLevel() +
					`for (let ${loop.parameter[0].identifier.Name}=${
						loop.parameter[0].from.Value
					};${loop.parameter[0].identifier.Name}<= ${this.visitExpr(
						loop.parameter[0].to as Operand
					)};${loop.parameter[0].identifier.Name}++){\n`;
				this.level.incre();
				ctx += this.visitIfElseExpr(
					new IfElseExpr(
						loop.body as MathExpr,
						new CommandExpr(`${this.f?.Return?.Name}=true`)
					)
				);
			} else if (loop.parameter[0].type == LoopType.VM) {
				ctx +=
					this.level.getSpaceByLevel() +
					this.visitCommandExpr(
						new CommandExpr(`${this.f?.Return?.Name}=true`)
					) +
					"\n";
				ctx +=
					this.level.getSpaceByLevel() +
					`for (let ${loop.parameter[0].identifier.Name}=${
						loop.parameter[0].from.Value
					};${loop.parameter[0].identifier.Name}<= ${this.visitExpr(
						loop.parameter[0].to as Operand
					)};${loop.parameter[0].identifier.Name}++){\n`;
				this.level.incre();
				ctx += this.visitIfElseExpr(
					new IfElseExpr(
						loop.body as MathExpr,
						new CommandExpr(`${this.f?.Return?.Name}=false`)
					)
				);
			}
		}
		//CLOSE
		loop.parameter.forEach((value) => {
			this.level.decre();
			ctx += this.level.getSpaceByLevel() + "}\n";
		});
		return ctx;
	}
}
