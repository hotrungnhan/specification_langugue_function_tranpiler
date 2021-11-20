import {
	DataType,
	LitKind,
	LiTToken,
	LoopType,
	NameToken,
	Operator,
	Token,
	TokenT,
	ValueToken
} from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { VariableContext } from "./context";
type Operand = LiTToken | Expr | VariableIdentifier;
export abstract class Expr {
	parent: Expr | null = null;
	static Parser(list: Array<Token>) {}
	OperandParser(value: Operand | undefined, visitor: FunctionVisitor): string {
		if (value instanceof MathExpr) {
			return visitor.visitExpr(value);
		} else if (value instanceof LiTToken) {
			return visitor.visitLiterature(value);
		} else if (value instanceof VariableIdentifier) {
			return value.Name;
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

export class AssignExpr extends KeywordExpr {
	private variable: VariableIdentifier;
	private value?: Operand;
	constructor(variable: VariableIdentifier, value?: Operand) {
		super();
		this.variable = variable;
		this.value = value || undefined;
	}
	get HasValue() {
		return this.value != null;
	}
	get DataType() {
		if (this.value instanceof LiTToken) {
			return this.variable.Type;
		} else if (this.value instanceof VariableIdentifier) {
			return this.value.Type;
		} else if (this.value instanceof MathExpr) {
			return null; // dont check type of expr
		}
		return null;
	}
	get Identifier() {
		return this.variable;
	}
	get VariableName() {
		return this.variable.Name;
	}
	Value(visitor: FunctionVisitor): string {
		return this.OperandParser(this.value, visitor);
	}
}
export class CommandExpr extends KeywordExpr {
	private command: string;
	constructor(command: string) {
		super();
		this.command = command;
	}
	get Command() {
		return this.command;
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
export class LoopExpr extends KeywordExpr {
	private from: Operand;
	private to: Operand;
	private identifier: VariableIdentifier;
	private type: LoopType;
	private body: Expr;
	constructor(
		type: LoopType,
		from: Operand,
		to: Operand,
		identifier: VariableIdentifier,
		body: Expr
	) {
		super();
		this.type = type;
		this.from = from;
		this.to = to;
		this.identifier = identifier;
		this.body = body;
	}
	get IncrementByOne() {
		return new AssignExpr(
			this.identifier,
			new BinaryExpr(
				new Token(Operator.PLUS),
				this.identifier,
				new LiTToken(1, LitKind.IntLit)
			)
		);
	}
	get Variable() {
		return new AssignExpr(this.identifier, this.From);
	}
	get ConditionExpr() {
		return new BinaryExpr(new Token(Operator.LESSER), this.identifier, this.To);
	}
	get To() {
		return this.to;
	}
	get From() {
		return this.from;
	}
	get Type() {
		return this.type;
	}
	get BodyExpr() {
		return this.body;
	}
	get Identifier() {
		return this.identifier;
	}
}
export class VariableIdentifier {
	private name: string;
	private type: DataType;
	constructor(name: string, type: DataType) {
		this.name = name;
		this.type = type;
	}
	Equal(cpr: VariableIdentifier) {
		return cpr.name == this.name;
	}
	get Name() {
		return this.name;
	}
	get Type() {
		return this.type;
	}
	set Name(x: string) {
		this.name = x;
	}
	set Type(x: DataType) {
		this.type = x;
	}
}
export class FunctionDecl extends Expr {
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
		super();
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
