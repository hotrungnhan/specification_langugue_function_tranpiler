import { DataType } from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { Expr, MathExpr } from "@tranpiler/expr";
export class VariableIdentifier {
	name: string;
	type: DataType;
	constructor(name: string, type: DataType) {
		this.name = name;
		this.type = type;
	}
	Equal(cpr: VariableIdentifier) {
		return cpr.name == this.name;
	}
}
export class FunctionDecl {
	functionName: string;
	Parameter: Array<VariableIdentifier> = [];
	Post: Array<Expr>;
	Return?: VariableIdentifier;
	Pre?: MathExpr;
	constructor(
		functionName: string,
		Parameter: Array<VariableIdentifier>,
		Post: Array<Expr> = [],
		Pre?: MathExpr,
		Return?: VariableIdentifier
	) {
		this.functionName = functionName;
		this.Parameter = Parameter;
		this.Return = Return;
		this.Pre = Pre;
		this.Post = Post;
	}
	visit(visitor: FunctionVisitor): string {
		return visitor.visitFunction(this);
	}
}
