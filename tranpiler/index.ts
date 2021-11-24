import { Parser } from "@tranpiler/parser";
import { Scanner } from "@tranpiler/scanner";
import type { FunctionVisitor } from "@tranpiler/visitor";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { PythonFunctionVisitor } from "@tranpiler/visitor/pyvisitor";
interface Options {
	parser?: Boolean;
	scanner?: Boolean;
}
export class SpecTranpiler {
	private visitor: FunctionVisitor = new JavascriptFunctionVisitor();
	private parse: Parser;
	private scanner: Scanner;
	private log: Options;
	private isGenFunctionCall: boolean = true;
	constructor(
		log?: Options,
		visitor?: "js" | "py" | "python" | "javascript",
		parse?: Parser,
		scanner?: Scanner
	) {
		this.log = log || { parser: false, scanner: false };
		this.parse = parse ? parse : new Parser();
		this.scanner = scanner ? scanner : new Scanner();
		visitor ? this.setVisitor(visitor) : "";
	}
	set EnableGenFunctionCall(t: boolean) {
		this.isGenFunctionCall = t;
	}
	setVisitor(visitor: "js" | "py" | "python" | "javascript") {
		switch (visitor) {
			case "js":
			case "javascript":
				this.visitor = new JavascriptFunctionVisitor();
				break;
			case "py":
			case "python":
				this.visitor = new PythonFunctionVisitor();
				break;
		}
		console.log(this.visitor);
	}
	convert(src: string) {
		console.log(this.visitor);
		const tokens = this.scanner.scan(src);
		const parsers = this.parse.parse(tokens);
		this.parse.reset();
		if (this.log.scanner) {
			console.dir(tokens, { depth: 5, colors: true });
		}
		if (this.log.parser) {
			console.dir(parsers, { depth: 5, colors: true });
		}

		if (parsers) {
			let kq = this.visitor.visitFunction(parsers);
			if (this.isGenFunctionCall) {
				kq += "\n" + this.visitor.generateDemoFunctionCall(parsers);
			}
			return kq;
		} else return "Did you input has right sytax ??";
	}
}
