import {
	Token,
	LitKind,
	Basic,
	Delemiter,
	LiTToken,
	Keyword,
	LoopType,
	Operator,
	DataType,
	SpecialLITERAL
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
	scan(src: string): Token[] {
		let s = "";
		let tokens: Token[] = [];
		for (let i = 0; i < src.length; i++) {
			const c = src[i];
			const peek = src[i + 1] || " ";
			if (isBlank(c) && isBlank(peek)) {
				continue;
			}
			s = s.trimStart() + c;
			if (
				(s.length > 0 && isNum(s[0]) && !isNum(peek) && !isDot(peek)) ||
				(s.length > 0 && isSign(s[0]) && !isNum(peek) && !isDot(peek)) ||
				(i == src.length - 1 && isNum(s[0])) ||
				isSign(s[0])
			) {
				//capture number
				let number = Number.parseFloat(s.trim());
				let hasDotDot = false;
				if (s.endsWith("..")) {
					hasDotDot = true;
				}
				if (isInt(number)) {
					tokens.push(new LiTToken(number, LitKind.IntLit));
					s = "";
					if (hasDotDot) {
						tokens.push(new Token(Delemiter.DOTDOT));
					}
					continue;
				}
				if (isFloat(number)) {
					tokens.push(new LiTToken(number, LitKind.FloatLit));
					s = "";

					continue;
				}
			} else if (
				(s.length > 0 &&
					isAlphabet(s[0]) &&
					!isAlphabet(peek) &&
					!isNum(peek) &&
					!isStar(peek)) ||
				(i == src.length - 1 && isAlphabet(s[0]))
			) {
				//capture keyword && literal
				switch (s.trimEnd()) {
					case "TT":
						tokens.push(new Token(LoopType.TT));
						s = "";
						continue;
					case "TRUE":
						tokens.push(new LiTToken(SpecialLITERAL.TRUE, LitKind.IntLit));
						s = "";
						continue;
					case "FALSE":
						tokens.push(new LiTToken(SpecialLITERAL.FALSE, LitKind.IntLit));
						s = "";
						continue;
					case "VM":
						tokens.push(new Token(LoopType.VM));
						s = "";
						continue;
					case "TH":
						tokens.push(new Token(LoopType.TH));
						s = "";
						continue;
					case "pre":
						tokens.push(new Token(Keyword.PRE));
						s = "";
						continue;
					case "post":
						tokens.push(new Token(Keyword.POST));
						s = "";
						continue;
					case "N":
						tokens.push(new Token(DataType.N));
						s = "";
						continue;
					case "R":
						tokens.push(new Token(DataType.R));
						s = "";
						continue;
					case "Z":
						tokens.push(new Token(DataType.Z));
						s = "";
						continue;
					case "R*":
						tokens.push(new Token(DataType.R_STAR));
						s = "";
						continue;
					case "Z*":
						tokens.push(new Token(DataType.Z_STAR));
						s = "";
						continue;
					case "B":
						tokens.push(new Token(DataType.B));
						s = "";
						continue;
					case "char*":
						tokens.push(new Token(DataType.CHAR_STAR));
						s = "";
						continue;
				}
				tokens.push(new LiTToken(s, LitKind.Unknown));
				s = "";
				continue;
			} else if (s.length > 2 && s.startsWith('"') && s.endsWith('"')) {
				tokens.push(new LiTToken(s.replaceAll('"', ""), LitKind.StringLit));
				s = "";
			} else if (
				(s.length > 0 && isNum(s[0])) ||
				(s.length > 0 && isAlphabet(s[0]) && isStar(c)) ||
				(s == "<" && peek == "=") ||
				(s == ">" && peek == "=") ||
				(s == "!" && peek == "=") ||
				(s == "&" && peek == "&") ||
				(s == "|" && peek == "|")
			) {
				// skip if current char is dot and start with number
				continue;
			}
			switch (s) {
				//Delemiter
				case "(":
					tokens.push(new Token(Delemiter.LPRAREN));
					s = "";
					continue;
				case "[":
					tokens.push(new Token(Delemiter.LBRACK));
					s = "";
					continue;
				case "{":
					tokens.push(new Token(Delemiter.LBRACE));
					s = "";
					continue;
				case ")":
					tokens.push(new Token(Delemiter.RPRAREN));
					s = "";
					continue;
				case "]":
					tokens.push(new Token(Delemiter.RBRACK));
					s = "";
					continue;
				case "}":
					tokens.push(new Token(Delemiter.RBRACE));
					s = "";
					continue;
				case ",":
					tokens.push(new Token(Delemiter.COMMA));
					s = "";
					continue;
				case ":":
					tokens.push(new Token(Delemiter.COLON));
					s = "";
					continue;
				case ".":
					tokens.push(new Token(Delemiter.DOT));
					s = "";
					continue;
				case "+":
					if (tokens.at(-1)?.Type != Basic.LITERAL) {
						tokens.push(new Token(Operator.UNARY_PLUS));
					} else {
						tokens.push(new Token(Operator.PLUS));
					}
					s = "";
					continue;
				case "-":
					if (tokens.at(-1)?.Type != Basic.LITERAL) {
						tokens.push(new Token(Operator.UNARY_MINUS));
					} else {
						tokens.push(new Token(Operator.MINUS));
					}
					s = "";
					continue;
				case "*":
					tokens.push(new Token(Operator.STAR));
					s = "";
					continue;
				case "%":
					tokens.push(new Token(Operator.PERCENT));
					s = "";
					continue;
				case ">":
					tokens.push(new Token(Operator.GREATER));
					s = "";
					continue;
				case "<":
					tokens.push(new Token(Operator.LESSER));
					s = "";
					continue;
				case "=":
					tokens.push(new Token(Operator.EQUALS));
					s = "";
					continue;
				case "!=":
					tokens.push(new Token(Operator.NOT_EQUAL));
					s = "";
					continue;
				case ">=":
					tokens.push(new Token(Operator.GREATER_EQUAL));
					s = "";
					continue;
				case "<=":
					tokens.push(new Token(Operator.LESSER_EQUAL));
					s = "";
					continue;
				case "/":
					tokens.push(new Token(Operator.SLASH));
					s = "";
					continue;
				case "&&":
					tokens.push(new Token(Operator.AND));
					s = "";
					continue;
				case "||":
					tokens.push(new Token(Operator.OR));
					s = "";
					continue;
				//Delemiter
			}
		}
		tokens.push(new Token(Basic.EOF));
		return tokens;
	}
}
