import { Char } from "./char";
const linebase = 0;
const colbase = 0;
export class Source {
	protected file: string;
	private line: number = linebase;
	private position: number = colbase; // source position of ch (0-based)
	eof: boolean = false;
	constructor(file: string) {
		this.file = file;
		if (this.file.length == 0) {
			this.eof = true;
		}
	}

	protected getCurrentChar() {
		return Char.Create(this.file[this.position]);
	}
	isEnd() {
		return this.getCurrentChar() == null;
	}

	protected next() {
		let c: Char | null;
		this.nextChar();
		c = this.getCurrentChar();
		if (c?.value == "\n") {
			this.line++;
		}
		return c;
	}
	protected nextChar() {
		this.position++;
	}
	protected prevChar() {
		this.position--;
	}
	protected skip() {
		let c: Char | null;
		c = this.next();
		while (
			" " == c?.value ||
			"\t" == c?.value ||
			"\n" == c?.value ||
			"\r" == c?.value ||
			"\f" == c?.value
		) {
			c = this.next();
		}
		return c;
		// skip white space
	}
}
