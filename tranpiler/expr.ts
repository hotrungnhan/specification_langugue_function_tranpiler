import {
	LiTToken,
	NameToken,
	Operator,
	Token,
	TokenT,
	ValueToken
} from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { VariableIdentifier } from "@tranpiler/function";
type Operand = LiTToken | Expr | VariableIdentifier;

export abstract class Expr {
	static Parser(list: Array<Token>) {}
	OperandParser(value: Operand | undefined, visitor: FunctionVisitor): string {
		if (value instanceof MathExpr) {
			return visitor.visitExpr(value);
		} else if (value instanceof LiTToken) {
			return visitor.visitLiterature(value);
		} else if (value instanceof VariableIdentifier) {
			return value.name;
		}
		return "";
	}
}
export abstract class MathExpr extends Expr {
	private token: Token;
	constructor(token: Token) {
		super();
		this.token = token;
	}
	get type(): TokenT {
		return this.token.Type;
	}
}
export abstract class KeywordExpr extends Expr {}
export class UnaryExpr extends MathExpr {
	right: Operand;
	constructor(token: Token, right: Operand) {
		super(token);
		this.right = right;
	}
	valueRight(visitor: FunctionVisitor) {
		return this.OperandParser(this.right, visitor);
	}
}
export class BinaryExpr extends MathExpr {
	left: Operand;
	right: Operand;
	constructor(token: Token, left: Operand, right: Operand) {
		super(token);
		this.left = left;
		this.right = right;
	}
	valueLeft(visitor: FunctionVisitor) {
		return this.OperandParser(this.left, visitor);
	}
	valueRight(visitor: FunctionVisitor) {
		return this.OperandParser(this.right, visitor);
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

export class AssignExpr extends KeywordExpr {
	private variable: VariableIdentifier;
	private value?: LiTToken | VariableIdentifier | MathExpr;
	constructor(
		variable: VariableIdentifier,
		value?: LiTToken | VariableIdentifier | MathExpr
	) {
		super();
		this.variable = variable;
		this.value = value || undefined;
	}
	get HasValue() {
		return this.value != null;
	}
	get DataType() {
		if (this.value instanceof LiTToken) {
			return this.variable.type;
		} else if (this.value instanceof VariableIdentifier) {
			return this.value.type;
		} else if (this.value instanceof MathExpr) {
			return null; // dont check type of expr
		}
		return null;
	}
	get Identifier() {
		return this.variable;
	}
	get VariableName() {
		return this.variable.name;
	}
	Value(visitor: FunctionVisitor): string {
		return this.OperandParser(this.value, visitor);
	}
}
export class IfElseExpr extends KeywordExpr {
	private condition: MathExpr;
	private right: Expr;
	private wrong?: Expr;
	constructor(condition: MathExpr, right: Expr, wrong?: Expr) {
		super();
		this.right = right;
		this.wrong = wrong;
		this.condition = condition;
	}
	get Condition() {
		return this.condition;
	}
	get Right() {
		return this.right;
	}
	get Wrong() {
		return this.wrong;
	}
}
