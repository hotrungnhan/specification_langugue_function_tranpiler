import { LiTToken, LoopType, NameToken, Token, ValueToken } from "@/token";
import { FunctionVisitor } from "@/visitor";
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
type Operand = ValueToken | Expr | LiTToken | NameToken;
export abstract class Expr {
	token?: Token;
	right?: Operand;
	left?: Operand;
}
export class UnaryExpr extends Expr {
	token: Token;
	right: Operand;
	constructor(token: Token, right: Operand) {
		super();
		this.token = token;
		this.right = right;
	}
	visitRight(visitor: FunctionVisitor) {
		if (this.right instanceof Expr) {
			return visitor.visitExpr(this.right);
		} else if (this.right instanceof ValueToken) {
			return this.right.value;
		}
		return "";
	}
}
export class BinaryExpr extends Expr {
	token: Token;
	left: Operand;
	right: Operand;
	constructor(token: Token, left: Operand, right: Operand) {
		super();
		this.token = token;
		this.left = left;
		this.right = right;
	}
	visitLeft(visitor: FunctionVisitor) {
		console.log(this.left instanceof Expr);
		if (this.left instanceof Expr) {
			return visitor.visitExpr(this.left);
		} else if (this.left instanceof ValueToken) {
			return this.left.value;
		}
		return "";
	}
	visitRight(visitor: FunctionVisitor) {
		if (this.right instanceof Expr) {
			return visitor.visitExpr(this.right);
		} else if (this.right instanceof ValueToken) {
			return this.right.value;
		}
		return "";
	}
}
// export class ForloopExpr implements Expr {
// 	condition: Operand;
// 	loopkey: NameToken;
// 	body: Operand;
// 	LoopType: LoopType;
// 	constructor(
// 		LoopType: LoopType,
// 		condition: Expr,
// 		Loopkey: NameToken,
// 		body: Expr
// 	) {
// 		this.LoopType = LoopType;
// 		this.condition = condition;
// 		this.body = body;
// 		this.loopkey = Loopkey;
// 	}
