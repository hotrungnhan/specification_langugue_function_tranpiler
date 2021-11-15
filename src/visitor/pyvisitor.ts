// }
// export class PythonFunctionVisitor implements FunctionVisitor {
// 	visitFunction(f: FunctionDecl): string {
// 		let currentBlockLevel = new Blocklevel();
// 		let ctx = `def ${f.functionName}`;
// 		ctx += "(";
// 		f.Parameter.forEach((param, index, arr) => {
// 			if (index == arr.length - 1) {
// 				// last parameter
// 				ctx += param.name;
// 			} else {
// 				ctx += param.name + ",";
// 			}
// 		});
// 		ctx += "):\n";
// 		currentBlockLevel.incre();
// 		ctx += this.visitExprAST(f.Pre);
// 		ctx += this.visitExprAST(f.Pre);
// 		return ctx;
// 	}
// 	visitExprAST(AST: ExprAST): string {
// 		return "";
// 	}
// }
