import { DataType } from "@web/tranpiler/token";
import { FunctionVisitor } from "@web/tranpiler/visitor";
import { ExprAST } from "@web/tranpiler/expr";
export class VariableIdentifier {
	name: string;
	type: DataType;
	constructor(name: string, type: DataType) {
		this.name = name;
		this.type = type;
	}
}
export class FunctionDecl {
	functionName: string;
	Parameter: Array<VariableIdentifier> = [];
	Return: VariableIdentifier;
	Pre: ExprAST;
	Post: ExprAST;
	constructor(
		functionName: string,
		Parameter: Array<VariableIdentifier>,
		Return: VariableIdentifier,
		Pre: ExprAST,
		Post: ExprAST
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
