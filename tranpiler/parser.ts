import {
	Token,
	Basic,
	Delemiter,
	LiTToken,
	Operator,
	DataType,
	Keyword
} from "@tranpiler/token";
import { BinaryExpr, Expr, MathExpr, UnaryExpr } from "@tranpiler/expr";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/expr";

export class Parser {
	static inst: Parser | null;
	index: number = 0;
	expr: Array<Expr> = [];
	tokens: Array<Token> = [];
	static get Inst() {
		if (!this.inst) {
			Parser.inst = new Parser();
			return Parser.inst as Parser;
		} else {
			return Parser.inst as Parser;
		}
	}
	next() {
		return this.tokens[++this.index];
	}

	private get peek() {
		return this.tokens[this.index + 1];
	}
	private get current() {
		return this.tokens[this.index];
	}
	parse(tokens: Array<Token>) {
		this.tokens = tokens;
		while (this.current && this.current.Type != Basic.EOF) {
			let t = this.statements();
			if (t) this.expr.push(t);
			this.next();
		}
		return this.expr;
	}
	statements() {
		if (
			this.current.Type == Basic.LITERAL &&
			this.peek.Type == Delemiter.LPRAREN
		) {
			return this.functionParser();
		}
	}
	private functionParser() {
		const cur = this.current as LiTToken;
		const fname = cur.Value;
		const parameter = [];
		let pre: MathExpr | undefined = undefined;
		let post: Array<Expr> = [];
		// const return :
		this.next(); // get (
		// scan parameter ;
		while (this.current && this.current.Type != Delemiter.RPRAREN) {
			let parname = (this.next() as LiTToken).Value;
			this.next(); // skip to type
			let partype = this.next().Type;
			parameter.push(new VariableIdentifier(parname, partype as DataType));
			if (this.next().Type == Delemiter.RPRAREN) {
				continue; //continue to break;
			}
		}
		// scan return ;
		let parname = (this.next() as LiTToken).Value;
		this.next(); // skip to type
		let partype = this.next().Type;
		let retur = new VariableIdentifier(parname, partype as DataType);
		if (this.next().Type == Keyword.PRE) {
			pre = this.parsePreExpr();
		} // skip to type
		if (this.next().Type == Keyword.POST) {
			post = this.parsePostExpr();
		}
		return new FunctionDecl(fname, parameter, post, pre, retur);
	}
	parsePreExpr(): MathExpr {
		let prev: Token = this.next();
		let Expr: MathExpr | null = null;
		let currentexpr: MathExpr | null = null;
		console.log(this.current);
		while (this.current && this.current.Type != Keyword.POST) {
			console.log(this.current);
			if (prev.Type == Basic.LITERAL) {
				prev = this.next();
			} else {
				switch (this.current.Type) {
					case Operator.PLUS:
					case Operator.MINUS:
					case Operator.STAR:
					case Operator.SLASH:
					case Operator.PERCENT:
					case Operator.GREATER:
					case Operator.LESSER:
					case Operator.EQUALS:
					case Operator.NOT_EQUAL:
					case Operator.GREATER_EQUAL:
					case Operator.LESSER_EQUAL:
					case Operator.OR:
						if (
							currentexpr instanceof BinaryExpr ||
							currentexpr instanceof UnaryExpr
						) {
							currentexpr.right = new BinaryExpr(
								this.current,
								prev as LiTToken,
								this.next() as LiTToken
							);
							currentexpr = currentexpr.right as MathExpr;
						}
						break;
					case Operator.NOT:
						if (
							currentexpr instanceof BinaryExpr ||
							currentexpr instanceof UnaryExpr
						) {
							currentexpr.right = new UnaryExpr(
								this.current,
								this.next() as LiTToken
							);
							currentexpr = currentexpr.right as MathExpr;
						}
						break;
				}
			}
		}
		return Expr as unknown as MathExpr;
	}
	parsePostExpr(): Expr[] {
		return [];
	}
}
