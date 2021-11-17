import { LiTToken, NameToken, Token, TokenT, ValueToken } from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { VariableIdentifier } from "@tranpiler/function";
type Operand = ValueToken | Expr;
export class ExprAST {
	topNode?: Expr;
	constructor(node?: Expr) {
		this.topNode = node;
	}
	visitNode(visitor: FunctionVisitor): string {
		if (this.topNode) {
			return visitor.visitExpr(this.topNode);
		} else {
			return "";
		}
	}
	static Parser(list: Array<Token>) {}
}

export abstract class Expr {}
export abstract class MathExp extends Expr {
	private token: Token;
	constructor(token: Token) {
		super();
		this.token = token;
	}
	get type(): TokenT {
		return this.token.Type;
	}
}
export abstract class KeywordExpr {}
export class UnaryExpr extends MathExp {
	right: Operand;
	constructor(token: Token, right: Operand) {
		super(token);
		this.right = right;
	}
	visitRight(visitor: FunctionVisitor) {
		if (this.right instanceof Expr) {
			return visitor.visitExpr(this.right);
		} else if (this.right instanceof ValueToken) {
			return this.right.Value;
		}
		return "";
	}
}
export class BinaryExpr extends MathExp {
	left: Operand;
	right: Operand;
	constructor(token: Token, left: Operand, right: Operand) {
		super(token);
		this.left = left;
		this.right = right;
	}
	visitLeft(visitor: FunctionVisitor) {
		if (this.left instanceof MathExp) {
			return visitor.visitExpr(this.left);
		} else if (this.left instanceof ValueToken) {
			return this.left.Value;
		}
		return "";
	}
	visitRight(visitor: FunctionVisitor) {
		if (this.right instanceof MathExp) {
			return visitor.visitExpr(this.right);
		} else if (this.right instanceof ValueToken) {
			return this.right.Value;
		}
		return "";
	}
}
export class ForloopExpr extends Expr {
	condition: Operand;
	loopkey: NameToken;
	body: Operand;
	token: Token;
	constructor(token: Token, condition: Expr, Loopkey: NameToken, body: Expr) {
		super();
		this.token = token;
		this.condition = condition;
		this.body = body;
		this.loopkey = Loopkey;
	}
}

export class DeclareVariableExpr extends KeywordExpr {
	private variable: VariableIdentifier;
	private token?: LiTToken;
	constructor(variable: VariableIdentifier, token?: LiTToken) {
		super();
		this.variable = variable;
		this.token = token || undefined;
	}
	get DataType() {
		return this.variable.type;
	}
	get Name() {
		return this.variable.name;
	}
	get valueToken() {
		return this.token;
	}
}
export class IfElseExpr extends KeywordExpr {
	private condition: Expr;
	private mainbody: Expr;
	private elsebody: Expr;

	constructor(condition: Expr, body: Expr, elsebody: Expr) {
		super();
		this.mainbody = body;
		this.elsebody = elsebody;
		this.condition = condition;
	}
}
export class ForLoopExpr extends KeywordExpr {
	private token: Token; //tt vm ...
	private loopvariable: DeclareVariableExpr;
	private body: Expr;
	private assign: Expr;
	constructor(
		token: Token,
		loopvariable: DeclareVariableExpr,
		body: Expr,
		assign: Expr
	) {
		super();
		this.token = token;
		this.loopvariable = loopvariable;
		this.body = body;
		this.assign = assign;
	}
}
