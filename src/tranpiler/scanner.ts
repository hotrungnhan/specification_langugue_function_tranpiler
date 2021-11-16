export {};
// import { Token, TokenT, LitKind, Operator, Basic, Delemiter } from "./token";
// import { Source } from "./source";
// export class Scanner extends Source {
// 	// current token, valid after calling next()
// 	blank: Boolean = false; // line is blank up to col
// 	tok: Token | null = null;
// 	lit: string | null = null; // valid if tok is _Name, _Literal, or _Semi ("semicolon", "newline", or "EOF"); may be malformed if bad is true
// 	bad: Boolean = false; // valid if tok is _Literal, true if a syntax error occurred, lit may be malformed
// 	kind: LitKind | null = null; // valid if tok is _Literal
// 	op: Operator | null = null; // valid if tok is _Operator, _AssignOp, or _IncOp
// 	prec: number = 0; // valid if tok is _Operator, _AssignOp, or _IncOp
// 	constructor(file: string) {
// 		super(file);
// 	}
// 	scan() {
// 		let c: Char | null;
// 		c = this.skip();
// 		if (c == null) {
// 			return false;
// 		}
// 		ScanSingle: switch (c.value) {
// 			//Delemiter
// 			case "(":
// 				this.tok = new Token(Delemiter.LPRAREN);
// 				break;
// 			case "[":
// 				this.tok = new Token(Delemiter.LBRACK);
// 				break;
// 			case "{":
// 				this.tok = new Token(Delemiter.LBRACE);
// 				break;
// 			case ")":
// 				this.tok = new Token(Delemiter.RPRAREN);
// 				break;
// 			case "]":
// 				this.tok = new Token(Delemiter.RBRACK);
// 				break;
// 			case "}":
// 				this.tok = new Token(Delemiter.RBRACE);
// 				break;
// 			case ",":
// 				this.tok = new Token(Delemiter.COMMA);
// 				break;
// 			case ":":
// 				this.tok = new Token(Delemiter.COLON);
// 				break;
// 			case ".":
// 				this.tok = new Token(Delemiter.DOT);
// 				break;
// 			//Delemiter
// 			default:
// 		}
// 		let keyword = ["pre", "TT"];
// 		let tempstack = "";
// 		keyword = keyword.filter((value) => {
// 			return Scanner.scanPattern(tempstack, value);
// 		});
// 		return true;
// 	}
// 	static scanPattern(startwith: string, str: string) {
// 		return str.startsWith(startwith);
// 	}
// }
