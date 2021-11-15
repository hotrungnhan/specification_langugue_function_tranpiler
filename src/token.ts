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

export enum LitKind {
	IntLit,
	FloatLit,
	StringLit
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
	DOT = "." // .
}
export enum Keyword {
	// ***  keywords
	PRE = "pre", // pre
	POST = "post" // post
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
	CHAR_STAR = "N*", // N* // Natual array
	R_STAR = "R*", // R* // Real array
	N_STAR = "N*" // N* // Natual array
}
export enum Operator {
	// *** operator
	PLUS = "+", // +
	MINUS = "-", // -
	STAR = "*", // *
	SLASH = "/", // /
	PERCENT = "%", // %
	GREATER = ">=", // >=
	LESSER = "<=", // <=
	EQUALS = "=", // =
	ASSIGN = "=", // =
	NOT_EQUAL = "!=", // !=
	GREATER_EQUAL = ">=", // >=
	LESSER_EQUAL = "<=", // <=
	NOT = "!", // !
	AND = "&&", // &&
	OR = "||" // ||
}
