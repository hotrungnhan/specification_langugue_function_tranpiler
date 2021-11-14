import { DataType } from "@/token";
import { FunctionVisitor } from "@/visitor";
import { ExprAST } from "@/expr";
export class DataTypeIdentifier {
	name!: string;
	type!: DataType;
	constructor(name: string, type: DataType) {
		this.name = name;
		this.type = type;
	}
}
export class FunctionDecl {
	functionName: string;
	Parameter: Array<DataTypeIdentifier> = [];
	Return: Array<DataTypeIdentifier> = [];
	Pre: ExprAST;
	Post: ExprAST;
	constructor(
		functionName: string,
		Parameter: Array<DataTypeIdentifier>,
		Pre: ExprAST,
		Post: ExprAST
	) {
		this.functionName = functionName;
		this.Parameter = Parameter;
		this.Pre = Pre;
		this.Post = Post;
	}
	visit(visitor: FunctionVisitor): string {
		return visitor.visitFunction(this);
	}
}
