import {
	Token,
	Basic,
	Delemiter,
	LiTToken,
	Operator,
	DataType,
	Keyword
} from "@tranpiler/token";
import {
	AssignExpr,
	BinaryExpr,
	Expr,
	IfElseExpr,
	MathExpr,
	Operand,
	UnaryExpr
} from "@tranpiler/expr";
import { FunctionDecl, VariableIdentifier } from "@tranpiler/expr";

export class Parser {
	index: number = 0;
	expr: Array<Expr> = [];
	tokens: Array<Token> = [];
	next() {
		return this.tokens[++this.index];
	}
	reset() {
		this.index = 0;
		this.expr = [];
		this.tokens = [];
	}
	private get peek() {
		return this.tokens[this.index + 1];
	}
	private get current() {
		return this.tokens[this.index];
	}
	parse(tokens: Array<Token>) {
		this.tokens = tokens;
		return this.statements();
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

		// const return :
		this.next(); // get (
		// scan parameter ;
		if (this.peek.Type != Delemiter.RPRAREN) {
			while (this.current && this.current.Type != Delemiter.RPRAREN) {
				let parname = (this.next() as LiTToken).Value;
				this.next(); // skip to type
				let partype = this.next().Type;
				parameter.push(new VariableIdentifier(parname, partype as DataType));
				if (this.next().Type == Delemiter.RPRAREN) {
					continue; //continue to break;
				}
			}
		} else {
			this.next();
		}

		let retur: VariableIdentifier | undefined = undefined;

		if (this.peek.Type != Keyword.PRE) {
			// scan return ;
			let parname = (this.next() as LiTToken).Value;
			this.next(); // skip to type
			let partype = this.next().Type;
			retur = new VariableIdentifier(parname, partype as DataType);
		}
		const preidx = this.tokens.findIndex((value) => {
			return value.Type == Keyword.PRE;
		});
		const postidx = this.tokens.findIndex((value) => {
			return value.Type == Keyword.POST;
		});
		const eofidx = this.tokens.findIndex((value) => {
			return value.Type == Basic.EOF;
		});

		let pretok = this.tokens.slice(preidx + 1, postidx);
		let pre: MathExpr | undefined = this.parsePreExpr(pretok);
		console.log("pre", pre);
		let posttok = this.tokens.slice(postidx + 1, eofidx);
		let post = this.parsePostExpr(posttok);
		console.log("post", posttok);
		return new FunctionDecl(fname, parameter, post, pre, retur);
	}
	parsePreExpr(tokens: Token[]): MathExpr | undefined {
		return this.genASTTree(tokens);
	}
	genASTTree(tokens: Token[]): MathExpr | undefined {
		const RPN = this.genRPN(tokens) as Operand[];
		//RPN Shunting-yard algorithm from  https://en.wikipedia.org/wiki/Shunting-yard_algorithm :)) đọc mệt quá =(())
		let temp: Operand[] = new Array(0);
		while (RPN.length > 0) {
			const token = RPN.shift() as Token;
			switch (token.Type) {
				case Basic.LITERAL:
					temp.push(token as LiTToken);
					break;
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
				case Operator.AND:
				case Operator.OR:
					let right = temp.pop() as LiTToken | Expr;
					let left = temp.pop() as LiTToken | Expr;
					temp.push(new BinaryExpr(token, left, right));
					break;
				case Operator.NOT:
					temp.push(new UnaryExpr(token, temp.pop() as LiTToken | Expr));
					break;
			}
		}
		return temp.pop() as MathExpr | undefined;
	}
	genRPN(token: Token[]) {
		const operatorStack: Token[] = [];
		const OutputStack: Token[] = [];
		token.forEach((token) => {
			switch (token.Type) {
				case Basic.LITERAL:
					OutputStack.push(token);
					break;
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
				case Operator.AND:
				case Operator.OR:
					operatorStack.push(token);
					break;
				case Delemiter.LPRAREN:
					operatorStack.push(token);
					break;
				case Delemiter.RPRAREN:
					let t: Token | undefined;
					while (true) {
						t = operatorStack.pop();
						if (t && (t as Token).Type != Delemiter.LPRAREN) {
							OutputStack.push(t as Token);
						} else {
							break;
						}
					}
					break;
			}
		});
		while (operatorStack.length > 0) {
			OutputStack.push(operatorStack.pop() as Token);
		}
		return OutputStack;
	}
	parsePostExpr(tokens: Token[]): Operand | undefined {
		let exprs: Operand | undefined;
		let ast: Operand | undefined = this.genASTTree(tokens);
		let cur: Expr | undefined;

		//type 1
		while (ast instanceof BinaryExpr && ast.Type == Operator.OR) {
			if (ast.left instanceof BinaryExpr) {
				if (ast.left.Type == Operator.EQUALS) {
					let t = VariableIdentifier.fromLitoken(ast.left.left as LiTToken);
					let assign = new AssignExpr(t, ast.left.right);
					let newif = new IfElseExpr(ast.right as MathExpr, assign);

					if (cur instanceof IfElseExpr) {
						cur.Wrong = assign;
						cur = cur.Wrong;
					} else {
						exprs = cur = newif;
					}
					ast = ast.right;
				} else if (
					ast.left.Type == Operator.AND &&
					ast.left.left instanceof BinaryExpr
				) {
					let t = VariableIdentifier.fromLitoken(
						ast.left.left.left as LiTToken
					);
					let assign = new AssignExpr(t, ast.left.left.right);
					let newif = new IfElseExpr(ast.left.right as MathExpr, assign);
					if (cur instanceof IfElseExpr) {
						cur.Wrong = newif;
						cur = cur.Wrong;
					} else {
						exprs = cur = newif;
					}
					ast = ast.right;
				} else {
					break;
				}
			} else {
				break;
			}
		}
		//type 2 no idea
		return exprs ? exprs : ast;
	}
}