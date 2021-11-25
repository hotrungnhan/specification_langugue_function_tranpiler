export enum LitKind {
	IntLit = "int",
	FloatLit = "float",
	StringLit = "string",
	Unknown = "unknown"
}
export type TokenT =
	| Basic
	| Delemiter
	| Keyword
	| LoopType
	| Operator
	| DataType; // token type
export enum Basic {
	EOF = "eof",
	NAME = "name", // variable or class name...
	LITERAL = "literal" // single value like a string "43" , a number 23
}

export enum Delemiter {
	// ***  delemiter
	LPRAREN = "(", // (
	LBRACK = "[", // [
	LBRACE = "{", // {
	RPRAREN = ")", // )
	RBRACK = "]", // ]
	RBRACE = "}", // }
	COMMA = ",", // ,
	COLON = ":", // :
	DOT = ".", // .
	DOTDOT = ".." // ..
}
export enum Keyword {
	// ***  keywords
	PRE = "pre", // pre
	POST = "post" // post
}
export enum SpecialLITERAL {
	TRUE = "TRUE",
	FALSE = "FALSE"
}
export enum LoopType {
	TT = "TT", //TT
	VM = "VM", //VM
	TH = "TH" // TH
}
export enum DataType {
	// ***  Class
	R = "R", // R
	N = "N", // N // natural
	B = "B", // B // boolean
	Z = "Z", // Z // integer
	CHAR_STAR = "char*", // char
	Z_STAR = "Z*", // char
	R_STAR = "R*" // char
}
export enum Operator {
	// *** operator
	PLUS = "+", // +
	MINUS = "-", // -
	STAR = "*", // *
	SLASH = "/", // /
	PERCENT = "%", // %
	GREATER = ">", // >
	LESSER = "<", // <
	EQUALS = "=", // =
	ASSIGN = "=", // =
	NOT_EQUAL = "!=", // !=
	GREATER_EQUAL = ">=", // >=
	LESSER_EQUAL = "<=", // <=
	NOT = "!", // !
	AND = "&&", // &&
	OR = "||" // ||
}
export enum Associated {
	LEFT,
	RIGHT
}
export function getPrecedence(op: Operator) {
	// https://i.stack.imgur.com/XgKf8.png
	// smaller is more precedence
	switch (op) {
		case Operator.STAR:
		case Operator.MINUS:
		case Operator.SLASH:
		case Operator.PERCENT:
			return 5;
		case Operator.PLUS:
		case Operator.MINUS:
			return 6;

		case Operator.GREATER:
		case Operator.LESSER:
		case Operator.EQUALS:
		case Operator.GREATER_EQUAL:
		case Operator.LESSER_EQUAL:
			return 8;
		case Operator.NOT_EQUAL:
			return 9;
		case Operator.NOT:
		case Operator.AND:
			return 13;
		case Operator.OR:
			return 14;
		default:
			return 1000;
	}
}
export function getAssociated(op: Operator) {
	if (op == Operator.NOT) {
		return Associated.RIGHT;
	} else {
		return Associated.LEFT;
	}
}

export const keywordArray: string[] = [
	...(Object.values(DataType) as string[]),
	...(Object.values(LoopType) as string[]),
	...(Object.values(Keyword) as string[])
];
export class Token {
	private type: TokenT;
	constructor(type: TokenT) {
		this.type = type;
	}
	is(type: TokenT): boolean {
		return this.type == type;
	}
	get Type() {
		return this.type;
	}
	set Type(t: TokenT) {
		this.type = t;
	}
}
export abstract class ValueToken extends Token {
	private value: any;
	constructor(value: any, type: TokenT) {
		super(type);
		this.value = value;
	}
	get Value() {
		return this.value;
	}
}
export class LiTToken extends ValueToken {
	private kind: LitKind;
	constructor(value: any, kind: LitKind) {
		super(value, Basic.LITERAL);
		this.kind = kind;
	}
	get Kind(): LitKind {
		return this.kind;
	}
}
export class NameToken extends ValueToken {
	constructor(value: any) {
		super(value, Basic.NAME);
	}
}
