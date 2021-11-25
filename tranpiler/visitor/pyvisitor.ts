import {
    Operator,
    LitKind,
    LoopType,
    SpecialLITERAL,
    DataType,
    Token,
    LiTToken
} from "@tranpiler/token";
import {
    ArrayInjectorExpr,
    BinaryExpr,
    UnaryExpr,
    Expr,
    AssignExpr,
    IfElseExpr,
    CommandExpr,
    NestedLoopExpr,
    FunctionDecl, 
    MathExpr, 
    Operand
} from "@tranpiler/expr";
import { FunctionVisitor } from "@tranpiler/visitor";
import { FunctionContext, VariableContext } from "@tranpiler/context";

export class PythonFunctionVisitor
    extends FunctionContext
    implements FunctionVisitor
{
    genCommand(str: string) {
        return `${this.level.getSpaceByLevel()}${str}`;
    }
    f: FunctionDecl | undefined;
    generateDemoFunctionCall(f: FunctionDecl) {
        this.f = f;
        let output = ""
        f.Parameter.forEach((param, index, arr) => {
            output += this.level.getSpaceByLevel() + `${param.Name} = input('Nhap gia tri ${param.Name} : ') \n`;
        });
        output += `\nprint(${f.functionName}(`
        f.Parameter.forEach((param, index, arr) => {
            switch (param.Type) {
                case DataType.B:
                    output += "bool (";
                    break;
                case DataType.N:
                case DataType.Z:
                    output +="int (";
                    break;
                case DataType.R:
                    output +="float (";
                    break;
                case DataType.R_STAR:
                case DataType.Z_STAR:
                    output +="list (";
                    break;
            }
            if (index == arr.length - 1) {
                // last parameter
                output += param.Name + ")"; 
            } else {
                output += param.Name + "),";
            }
        });
        output += "))";
        return output
    }
    visitFunction(f: FunctionDecl): string {
        this.f = f;
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
        output += "): \n";
        // declare output variable
        this.level.incre();
        if (f.Return) {
            if (f.Return.Type == DataType.R_STAR || f.Return.Type == DataType.Z_STAR)
                output +=  this.visitAssignExpr(
                        new AssignExpr(f.Return, new LiTToken("[]", LitKind.Unknown)
                    )
                );
            else {
                output += this.visitAssignExpr(new AssignExpr(f.Return)
                );
            }
        }
        if (f.Pre) {
            output += this.visitExpr(
                new IfElseExpr(f.Pre as MathExpr, new CommandExpr(""))
            );
        }
        if (f.Post) {
            if (f.Post instanceof IfElseExpr || f.Post instanceof NestedLoopExpr) {
                output += this.visitExpr(f.Post);
            } else {
                output += this.genCommand(this.visitExpr(f.Post));
                output += "\n"
            }
        }
        if (f.Return) {
            this.level.reset();
            this.level.incre();
            output += this.genCommand(
                this.visitCommandExpr(new CommandExpr(`return ${f.Return.Name}`))
            );
        }
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
            ctx.pushVariable(expr.Identifier);
            if (expr.HasValue) {
                return `${expr.VariableName} = ${expr.Value(this)}`;
            } 
            else {
            //  return `${expr.VariableName} = input('Nhap ${expr.VariableName}: ')`;
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
                    return "True";
                } else if (tok.Value == SpecialLITERAL.FALSE) {
                    return "False";
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
                return `(${expr.valueRight(this)})`;
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
            ctx += "\n" + this.level.getSpaceByLevel() + `else: \n`;
            this.level.incre();
            ctx += this.visitIfElseExpr(ifElse.Wrong);
            this.level.decre();
        } else if (ifElse.Wrong) {
            this.level.decre();
            ctx += this.level.getSpaceByLevel() + "\n";
            this.level.incre();
            ctx += this.level.getSpaceByLevel() + `else :\n` + this.visitExpr(ifElse.Wrong);
            this.level.decre();
            ctx += this.level.getSpaceByLevel() + "\n";
        } else {
            ctx += this.level.getSpaceByLevel() + "\n";
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
                console.log(loop.body)
                ctx +=
                    this.level.getSpaceByLevel() +
                    this.visitCommandExpr(
                        new CommandExpr(`${this.f?.Return?.Name}=false`)
                    ) +
                    "\n";
                ctx +=
                    this.level.getSpaceByLevel() +
                    `for ${loop.parameter[0].identifier.Name} in range (${
                        loop.parameter[0].from.Value
                    }, ${this.visitExpr(
                        loop.parameter[0].to as Operand
                )}): \n`;
                this.level.incre();
                ctx +=
                this.level.getSpaceByLevel() +
                `for ${loop.parameter[1].identifier.Name} in range (${
                    loop.parameter[1].from.Value
                }, ${this.visitExpr(
                    loop.parameter[1].to as Operand
            )}): \n`;
                ctx += this.visitIfElseExpr(
                    new IfElseExpr(
                        loop.body as MathExpr,
                        new CommandExpr(`${this.f?.Return?.Name}=True`)
                    )
                );
            } else if (loop.parameter[0].type == LoopType.VM) {
                ctx +=
                    this.level.getSpaceByLevel() +
                    this.visitCommandExpr(
                        new CommandExpr(`${this.f?.Return?.Name}=True`)
                    ) +
                    "\n";
                ctx +=
                    this.level.getSpaceByLevel() +
                    `for ${loop.parameter[0].identifier.Name} in range (${
                        loop.parameter[0].from.Value
                    }, ${this.visitExpr(
                        loop.parameter[0].to as Operand
                    )}): \n`;
                this.level.incre();
                ctx += this.visitIfElseExpr(
                    new IfElseExpr(
                        // loop.body as MathExpr,
                        loop.body as MathExpr,
                        new CommandExpr(`${this.f?.Return?.Name}=False`)
                    )
                );
            }
        }
        //CLOSE
        loop.parameter.forEach((value) => {
            this.level.decre();
            ctx += this.level.getSpaceByLevel() + "\n";
        });
        return ctx;
    }
}


