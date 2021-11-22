import {
	DataType,
	LitKind,
	LiTToken,
	LoopType,
	Operator,
	Token,
	TokenT
} from "@tranpiler/token";
import { FunctionVisitor } from "@tranpiler/visitor";
import { VariableContext } from "@tranpiler/context";
export type Operand = LiTToken | Expr;
export abstract class Expr {
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
	get Type(): TokenT {
		return this.token.Type;
	}
	set Type(t: TokenT) {
		this.token.Type = t;
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
	set Wrong(e: Expr | undefined) {
		this.wrong = e;
	}
}
/**
*** TT.TT
for each i :
 	for each j :
		if (a[i]>a[j])
			return true
***	TT.VM
for each i :
  	let t=true;
  	for each j :
		if (a[i]>a[j]){
			return false
		}

***	VM.TT
for each i :
	let t = false;
  	for each j :
	if (a[i]>a[j]){
		t=true
		break;
	}
	if (t==false) return false;
return true
***	VM.VM
for each i :
	for each j :
		if (a[i]>a[j])
			return false;
return true
 */
export class LoopExpr extends KeywordExpr {
	private from: Operand;
	private to: Operand;
	private identifier: VariableIdentifier;
	private type: LoopType;
	private body: Expr;
	private assignTo: VariableIdentifier;
	constructor(
		type: LoopType,
		from: Operand,
		to: Operand,
		identifier: VariableIdentifier,
		body: Expr,
		assignto: VariableIdentifier
	) {
		super();
		this.type = type;
		this.from = from;
		this.to = to;
		this.identifier = identifier;
		this.body = body;
		this.assignTo = assignto;
	}
	get IncrementByOne() {
		return new AssignExpr(
			this.identifier,
			new BinaryExpr(
				new Token(Operator.PLUS),
				this.identifier.toLitoken(),
				new LiTToken(1, LitKind.IntLit)
			)
		);
	}
	get Variable() {
		return new AssignExpr(this.identifier, this.From);
	}
	// get ConditionExpr() {
	// 	return new BinaryExpr(new Token(Operator.LESSER), this.identifier, this.To);
	// }
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
export class NestedLoopExpr extends LoopExpr {}
export class VariableIdentifier {
	private name: string;
	private type?: DataType;
	constructor(name: string, type?: DataType) {
		this.name = name;
		this.type = type;
	}
	static fromLitoken(tok: LiTToken) {
		return new VariableIdentifier(tok.Value, undefined);
	}
	toLitoken() {
		return new LiTToken(this.name, LitKind.Unknown);
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
	set Type(x: DataType | undefined) {
		this.type = x;
	}
}
export class FunctionDecl extends Expr {
	functionName: string;
	Parameter: Array<VariableIdentifier> = [];
	Post?: Operand;
	Return?: VariableIdentifier;
	Pre?: Operand;
	constructor(
		functionName: string,
		Parameter: Array<VariableIdentifier>,
		Post?: Operand,
		Pre?: Operand,
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
