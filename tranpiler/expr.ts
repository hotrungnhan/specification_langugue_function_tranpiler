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
		} else if (value instanceof ArrayInjectorExpr) {
			return visitor.visitArrayInjectorExpr(value);
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
		return this.left ? this.OperandParser(this.left, visitor) : "";
	}
	valueRight(visitor: FunctionVisitor) {
		return this.right ? this.OperandParser(this.right, visitor) : "";
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
			if t ==false break;
		}
	if t==true return true;
return false;
***	VM.TT
for each i :
	let t = false;
  	for each j :
	if (a[i]>a[j]){
		t=true
		break;
	}
	if (t==false) {
		kq=false;
		break;
	};
kq=true
***	VM.VM
for each i :
	for each j :
		if (a[i]>a[j])
			return false;
return true
 */
export class LoopParameter {
	from!: LiTToken;
	to!: Operand | undefined;
	identifier!: VariableIdentifier;
	type!: LoopType;
}
export class NestedLoopExpr extends KeywordExpr {
	parameter: LoopParameter[] = [];
	body!: Expr;
	constructor() {
		super();
	}
}
export class VariableIdentifier {
	private name: string;
	private type?: DataType;
	constructor(name: string, type?: DataType) {
		this.name = name;
		this.type = type;
	}
	static fromLitoken(tok: LiTToken, datatype?: DataType) {
		if (datatype) {
			return new VariableIdentifier(tok.Value, datatype);
		}
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
export class ArrayInjectorExpr extends Expr {
	private array: VariableIdentifier;
	private position: LiTToken | VariableIdentifier;
	constructor(
		array: VariableIdentifier,
		position: LiTToken | VariableIdentifier
	) {
		super();
		this.position = position;
		this.array = array;
	}
	get PositionValue(): string | undefined {
		if (this.position instanceof VariableIdentifier) {
			return this.position.Name;
		} else if (this.position instanceof LiTToken) {
			return this.position.Value;
		}
		return undefined;
	}
	get ArrayName() {
		return this.array.Name;
	}
	set Position(t: LiTToken | VariableIdentifier) {
		this.position = t;
	}
	set Array(t: VariableIdentifier) {
		this.array = t;
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
