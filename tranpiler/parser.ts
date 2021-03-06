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
		const op = this.genASTTree(tokens);
		return op ? new UnaryExpr(new Token(Operator.NOT), op) : undefined;
	}
	genASTTree(tokens: Token[]): MathExpr | undefined {
		const RPN = this.genRPN(tokens) as Operand[];
		//RPN Shunting-yard algorithm from  https://en.wikipedia.org/wiki/Shunting-yard_algorithm :)) ?????c m???t qu?? =(())
		// https://aquarchitect.github.io/swift-algorithm-club/Shunting%20Yard/
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
				case Operator.ARRAY:
				case Operator.OR:
					let right = temp.pop() as Operand;
					let left = temp.pop() as Operand;
					if (token.Type == Operator.ARRAY) {
						temp.push(new ArrayInjectorExpr(left as LiTToken, right));
					} else {
						temp.push(new BinaryExpr(token, left, right));
					}
					break;
				case Operator.UNARY_PLUS:
				case Operator.UNARY_MINUS:
				case Operator.NOT:
					temp.push(new UnaryExpr(token, temp.pop() as LiTToken | Expr));
					break;
			}
		}
		return temp.pop() as MathExpr | undefined;
	}
	genRPN(tokens: Token[]) {
		const operatorStack: Token[] = [];
		const outputStack: Token[] = [];
		tokens.forEach((token, index, arr) => {
			if (
				arr.length >= index + 2 &&
				token.Type == Basic.LITERAL &&
				(arr[index + 1] as Token).Type == Delemiter.LPRAREN
			) {
				(arr[index + 1] as Token).Type = Delemiter.LBRACK;
				let bracket: Token[] = [];
				for (let i = index + 1; i < arr.length; i++) {
					if (arr[i].Type == Delemiter.LPRAREN) {
						bracket.push(arr[i]);
					} else if (arr[i].Type == Delemiter.RPRAREN) {
						const pop = bracket.pop();
						if (!pop) {
							arr[i].Type = Delemiter.RBRACK;
						}
					}
				}
			}

			switch (token.Type) {
				case Basic.LITERAL:
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
				case Operator.NOT:
				case Operator.UNARY_MINUS:
				case Operator.UNARY_PLUS:
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
				case Delemiter.LBRACK:
					operatorStack.push(token);
					break;
				case Delemiter.RPRAREN:
					let z: Token | undefined;
					while (true) {
						z = operatorStack.pop();
						if (z && (z as Token).Type != Delemiter.LPRAREN) {
							outputStack.push(z as Token);
						} else {
							break;
						}
					}
					break;
				case Delemiter.RBRACK:
					let t: Token | undefined;
					while (true) {
						t = operatorStack.pop();
						if (t && (t as Token).Type != Delemiter.LBRACK) {
							outputStack.push(t as Token);
						} else {
							break;
						}
					}
					outputStack.push(new Token(Operator.ARRAY));
					break;
			}
		});
		while (operatorStack.length > 0) {
			outputStack.push(operatorStack.pop() as Token);
		}

		return outputStack;
	}
	genIfElse(
		ast: Operand | undefined
	): AssignExpr | IfElseExpr | Expr | undefined {
		if (ast instanceof BinaryExpr && ast.Type == Operator.OR) {
			const left = this.genIfElse(ast.left);
			const right = this.genIfElse(ast.right);
			let cur = left;
			while (cur instanceof IfElseExpr && cur.Wrong) {
				cur = cur.Wrong;
			}
			if (cur instanceof IfElseExpr && right instanceof Expr) {
				cur.Wrong = right;
			}
			return left;
			// TODO: Some bug was there #1
		} else if (ast instanceof BinaryExpr && ast.Type == Operator.EQUALS) {
			const t = VariableIdentifier.fromLitoken(ast.left as LiTToken);
			const assign = new AssignExpr(t, ast.right);
			return assign;
		} else if (ast instanceof BinaryExpr && ast.Type == Operator.AND) {
			if (ast.left instanceof BinaryExpr && ast.left.Type == Operator.EQUALS) {
				const t = VariableIdentifier.fromLitoken(ast.left.left as LiTToken);
				const assign = new AssignExpr(t, ast.left.right);
				return new IfElseExpr(ast.right as MathExpr, assign);
			}
			if (ast.left instanceof BinaryExpr && ast.left.Type == Operator.AND) {
				let start = ast;
				let prev = start;
				let cur = start;
				while (
					cur.left instanceof BinaryExpr &&
					cur.left.Type != Operator.EQUALS
				) {
					prev = cur;
					cur = cur.left;
				}
				prev.left = cur.right;
				if (
					cur.left instanceof BinaryExpr &&
					cur.left.Type == Operator.EQUALS
				) {
					const t = VariableIdentifier.fromLitoken(cur.left.left as LiTToken);
					const assign = new AssignExpr(t, cur.left.right);
					return new IfElseExpr(start as MathExpr, assign);
				}
				return ast;
			}
			return ast;
		}
		return undefined;
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
			if (cur == undefined || cur.Type == Basic.EOF) {
				break;
			}
			bodyToks.push(cur);
		}
		bodyToks.pop(); // pop last )
		expr.body = this.genASTTree(bodyToks) as MathExpr;
		return expr;
	}
	parsePostExpr(tokens: Token[]): Operand | undefined {
		const isType2 = tokens.findIndex((value) => {
			return value.Type == LoopType.TH;
		});

		if (isType2 < 0) {
			//type 1
			const ast: Operand | undefined = this.genASTTree(tokens);
			const exprs = this.genIfElse(ast);
			return exprs ? exprs : ast;
		} else if (isType2 > 0) {
			//type 2 no idea
			const exprs = this.parseLoop(tokens);
			if (
				exprs instanceof NestedLoopExpr &&
				exprs.parameter[0].type == LoopType.VM
			) {
				exprs.body = new UnaryExpr(new Token(Operator.NOT), exprs.body);
			}
			return exprs ? exprs : this.genASTTree(tokens);
		}
	}
}
