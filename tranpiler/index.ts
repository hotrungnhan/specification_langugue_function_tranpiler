import { Parser } from "@tranpiler/parser";
import { Scanner } from "@tranpiler/scanner";
import type { FunctionVisitor } from "@tranpiler/visitor";
import { JavascriptFunctionVisitor } from "@tranpiler/visitor/jsvisitor";
import { PythonFunctionVisitor } from "@tranpiler/visitor/pyvisitor";

export class SpecTranpiler {
	private visitor: FunctionVisitor;
	private src: string;
	private parse: Parser;
	private scanner: Scanner;
	constructor(
		visitor?: FunctionVisitor,
		src?: string,
		parse?: Parser,
		scanner?: Scanner
	) {
		this.parse = parse ? parse : new Parser();
		this.scanner = scanner ? scanner : new Scanner();
		this.visitor = visitor ? visitor : new JavascriptFunctionVisitor();
		this.src = src ? src : "";
	}
	setVisitor(visitor: "js" | "py" | "python" | "javascript") {
		switch (visitor) {
			case "js":
			case "javascript":
				this.visitor = new JavascriptFunctionVisitor();
			case "py":
			case "python":
				this.visitor = new PythonFunctionVisitor();
		}
	}
	convert(src: string) {
		const tokens = this.scanner.scan(src);
		const parser = this.parse.parse(tokens);
		this.parse.reset();
		if (parser) {
			const kq = this.visitor.visitFunction(parser);
			this.visitor.reset();
			return kq;
		} else return "";
	}
}
