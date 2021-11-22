import {
	Token,
	Basic,
	Delemiter,
	LiTToken,
	Operator,
	DataType,
	Keyword,
	getAssociated,
	Associated,
	getPrecedence,
	LoopType
} from "@tranpiler/token";
import {
	AssignExpr,
	BinaryExpr,
	Expr,
	IfElseExpr,
	NestedLoopExpr,
	MathExpr,
	Operand,
	UnaryExpr,
	LoopParameter,
	ArrayInjectorExpr
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
		let posttok = this.tokens.slice(postidx + 1, eofidx);
		let post = this.parsePostExpr(posttok);
		return new FunctionDecl(fname, parameter, post, pre, retur);
	}
	parsePreExpr(tokens: Token[]): MathExpr | undefined {
		return this.genASTTree(tokens);
	}
	genASTTree(tokens: Token[]): MathExpr | undefined {
		const RPN = this.genRPN(tokens) as Operand[];
		//RPN Shunting-yard algorithm from  https://en.wikipedia.org/wiki/Shunting-yard_algorithm :)) đọc mệt quá =(())
		// https://aquarchitect.github.io/swift-algorithm-club/Shunting%20Yard/
		let temp: Operand[] = new Array(0);
		while (RPN.length > 0) {
			const token = RPN.shift() as Token;
			if (
				RPN.length > 3 &&
				token.Type == Basic.LITERAL &&
				(RPN[0] as Token).Type == Delemiter.LBRACK &&
				(RPN[1] as Token).Type == Basic.LITERAL &&
				(RPN[2] as Token).Type == Delemiter.RBRACK
			) {
				const aray = VariableIdentifier.fromLitoken(token as LiTToken);
				temp.push(new ArrayInjectorExpr(aray, RPN[1] as LiTToken));
				RPN.shift();
				RPN.shift();
				RPN.shift();
				continue;
			}
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
		const outputStack: Token[] = [];
		token.forEach((token, index, arr) => {
			if (
				arr.length > index + 1 + 3 &&
				token.Type == Basic.LITERAL &&
				(arr[index + 1] as Token).Type == Delemiter.LPRAREN &&
				(arr[index + 2] as Token).Type == Basic.LITERAL &&
				(arr[index + 3] as Token).Type == Delemiter.RPRAREN
			) {
				(arr[index + 1] as Token).Type = Delemiter.LBRACK;
				(arr[index + 3] as Token).Type = Delemiter.RBRACK;
			}

			switch (token.Type) {
				case Basic.LITERAL:
				case Delemiter.LBRACK:
				case Delemiter.RBRACK:
					outputStack.push(token);
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
					let top = operatorStack[operatorStack.length - 1]; // peek
					if (
						(top &&
							getAssociated(token.Type) == Associated.LEFT &&
							getPrecedence(token.Type) >=
								getPrecedence(top.Type as Operator)) ||
						(top &&
							getAssociated(token.Type) == Associated.RIGHT &&
							getPrecedence(token.Type) > getPrecedence(top?.Type as Operator))
					) {
						let y = operatorStack.pop();
						outputStack.push(y as Token);
					}
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
							outputStack.push(t as Token);
						} else {
							break;
						}
					}
					break;
			}
		});
		while (operatorStack.length > 0) {
			outputStack.push(operatorStack.pop() as Token);
		}

		return outputStack;
	}
	private genIfElse(
		ast: Operand | undefined
	): AssignExpr | IfElseExpr | undefined {
		if (ast instanceof BinaryExpr && ast.Type == Operator.OR) {
			const left = this.genIfElse(ast.left);
			const right = this.genIfElse(ast.right);
			if (left instanceof IfElseExpr && right instanceof Expr) {
				left.Wrong = right;
			}
			return left;
		} else if (ast instanceof BinaryExpr && ast.Type == Operator.EQUALS) {
			const t = VariableIdentifier.fromLitoken(ast.left as LiTToken);
			const assign = new AssignExpr(t, ast.right);
			return assign;
		} else if (ast instanceof BinaryExpr && ast.Type == Operator.AND) {
			if (ast.left instanceof BinaryExpr && ast.left.Type == Operator.EQUALS) {
				const t = VariableIdentifier.fromLitoken(ast.left.left as LiTToken);
				const assign = new AssignExpr(t, ast.left.right);
				const newif = new IfElseExpr(ast.right as MathExpr, assign);
				return newif;
			}
		}
	}
	parseLoop(tokens: Token[]) {
		let index = 0;
		function next() {
			return tokens[++index];
		}
		function current() {
			return tokens[index];
		}
		function peek() {
			return tokens[index + 1];
		}
		let cur = current();
		if (cur.Type == Basic.LITERAL) {
			new VariableIdentifier((cur as LiTToken).Value);
		}
		let expr = new NestedLoopExpr();

		next(); // skip =
		next(); // skip (
		const scanLoop = () => {
			let parameter = new LoopParameter();
			cur = next();
			if (cur.Type == LoopType.VM || cur.Type == LoopType.TT) {
				parameter.type = cur.Type;
			}
			cur = next();
			if (cur.Type == Basic.LITERAL) {
				parameter.identifier = VariableIdentifier.fromLitoken(
					cur as LiTToken,
					DataType.N
				);
			}
			next(); // next TH
			next(); // next {
			cur = next();
			if (cur.Type == Basic.LITERAL) {
				// from value
				parameter.from = cur as LiTToken;
			}
			next(); // next skip ..
			let toToken: Token[] = [];
			while (true) {
				cur = next();
				toToken.push(cur);
				if (cur.Type == Delemiter.RBRACE) {
					break;
				}
			}
			parameter.to = this.genASTTree(toToken);
			next(); //skip .
			expr.parameter.push(parameter);
		};
		cur = peek();
		scanLoop();
		if (peek().Type == LoopType.VM || peek().Type == LoopType.TT) {
			scanLoop();
		}
		let bodyToks: Token[] = [];
		while (true) {
			cur = next();
			bodyToks.push(cur);
			if (cur.Type == Basic.EOF) {
				break;
			}
		}
		bodyToks.pop(); // pop last )
		expr.body = this.genASTTree(bodyToks) as MathExpr;
		return expr;
	}
	parsePostExpr(tokens: Token[]): Operand | undefined {
		let isType2 = tokens.findIndex((value) => {
			value.Type == LoopType.TH;
		});
		if (isType2 < 0) {
			//type 1
			const ast: Operand | undefined = this.genASTTree(tokens);
			const exprs = this.genIfElse(ast);
			return exprs ? exprs : ast;
		} else if (isType2 > 0) {
			//type 2 no idea
		}
	}
}
