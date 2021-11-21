import {
	Token,
	LitKind,
	Basic,
	Delemiter,
	LiTToken,
	Keyword,
	LoopType,
	Operator,
	DataType
} from "@tranpiler/token";
import {
	isAlphabet,
	isBlank,
	isDot,
	isFloat,
	isInt,
	isNum,
	isSign,
	isStar
} from "@tranpiler/utils";
export class Scanner {
	private src: string;
	private token: Token[] = [];
	constructor(src: string) {
		this.src = src;
	}
	get Token() {
		return this.token;
	}

	scan() {
		let s = "";
		for (let i = 0; i < this.src.length; i++) {
			const c = this.src[i];
			const peek = this.src[i + 1] || " ";
			if (isBlank(c) && isBlank(peek)) {
				continue;
			}
			s = s.trimStart() + c;
			if (
				(s.length > 0 && isNum(s[0]) && !isNum(peek) && !isDot(peek)) ||
				(s.length > 0 && isSign(s[0]) && !isNum(peek) && !isDot(peek)) ||
				(i == this.src.length - 1 && isNum(s[0])) ||
				isSign(s[0])
			) {
				//capture number
				let number = Number.parseFloat(s.trim());
				if (isInt(number)) {
					this.token.push(new LiTToken(number, LitKind.IntLit));
					s = "";
					continue;
				}
				if (isFloat(number)) {
					this.token.push(new LiTToken(number, LitKind.FloatLit));
					s = "";
					continue;
				}
			} else if (
				(s.length > 0 &&
					isAlphabet(s[0]) &&
					!isAlphabet(peek) &&
					!isNum(peek) &&
					!isStar(peek)) ||
				(i == this.src.length - 1 && isAlphabet(s[0]))
			) {
				//capture keyword && literal
				switch (s.trimEnd()) {
					case "TT":
						this.token.push(new Token(LoopType.TT));
						s = "";
						continue;
					case "VM":
						this.token.push(new Token(LoopType.VM));
						s = "";
						continue;
					case "TH":
						this.token.push(new Token(LoopType.TH));
						s = "";
						continue;
					case "pre":
						this.token.push(new Token(Keyword.PRE));
						s = "";
						continue;
					case "post":
						this.token.push(new Token(Keyword.POST));
						s = "";
						continue;
					case "N":
						this.token.push(new Token(DataType.N));
						s = "";
						continue;
					case "R":
						this.token.push(new Token(DataType.R));
						s = "";
						continue;
					case "Z":
						this.token.push(new Token(DataType.Z));
						s = "";
						continue;
					case "R*":
						this.token.push(new Token(DataType.R_STAR));
						s = "";
						continue;
					case "Z*":
						this.token.push(new Token(DataType.Z_STAR));
						s = "";
						continue;
					case "B":
						this.token.push(new Token(DataType.B));
						s = "";
						continue;
					case "char*":
						this.token.push(new Token(DataType.CHAR_STAR));
						s = "";
						continue;
				}
				this.token.push(new LiTToken(s, LitKind.Unknown));
				s = "";
				continue;
			} else if (s.length > 2 && s.startsWith('"') && s.endsWith('"')) {
				console.log(s);
				this.token.push(new LiTToken(s.replaceAll('"', ""), LitKind.StringLit));
				s = "";
			} else if (
				(s.length > 0 && isNum(s[0]) && isDot(c)) ||
				(s.length > 0 && isAlphabet(s[0]) && isStar(c))
			) {
				// skip if current char is dot and start with number
				continue;
			}
			switch (s) {
				//Delemiter
				case "(":
					this.token.push(new Token(Delemiter.LPRAREN));
					s = "";
					continue;
				case "[":
					this.token.push(new Token(Delemiter.LBRACK));
					s = "";
					continue;
				case "{":
					this.token.push(new Token(Delemiter.LBRACE));
					s = "";
					continue;
				case ")":
					this.token.push(new Token(Delemiter.RPRAREN));
					s = "";
					continue;
				case "]":
					this.token.push(new Token(Delemiter.RBRACK));
					s = "";
					continue;
				case "}":
					this.token.push(new Token(Delemiter.RBRACE));
					s = "";
					continue;
				case ",":
					this.token.push(new Token(Delemiter.COMMA));
					s = "";
					continue;
				case ":":
					this.token.push(new Token(Delemiter.COLON));
					s = "";
					continue;
				case ".":
					this.token.push(new Token(Delemiter.DOT));
					s = "";
					continue;
				case "+":
					this.token.push(new Token(Operator.PLUS));
					s = "";
					continue;
				case "-":
					this.token.push(new Token(Operator.MINUS));
					s = "";
					continue;
				case "*":
					this.token.push(new Token(Operator.STAR));
					s = "";
					continue;
				case "%":
					this.token.push(new Token(Operator.PERCENT));
					s = "";
					continue;
				case ">":
					this.token.push(new Token(Operator.GREATER));
					s = "";
					continue;
				case "<":
					this.token.push(new Token(Operator.LESSER));
					s = "";
					continue;
				case "=":
					this.token.push(new Token(Operator.EQUALS));
					s = "";
					continue;
				case "!=":
					this.token.push(new Token(Operator.NOT_EQUAL));
					s = "";
					continue;
				case ">=":
					this.token.push(new Token(Operator.GREATER_EQUAL));
					s = "";
					continue;
				case "<=":
					this.token.push(new Token(Operator.LESSER_EQUAL));
					s = "";
					continue;
				case "/":
					this.token.push(new Token(Operator.SLASH));
					s = "";
					continue;
				case "&&":
					this.token.push(new Token(Operator.AND));
					s = "";
					continue;
				case "||":
					this.token.push(new Token(Operator.OR));
					s = "";
					continue;
				//Delemiter
			}
		}
		this.token.push(new Token(Basic.EOF));
	}
}
