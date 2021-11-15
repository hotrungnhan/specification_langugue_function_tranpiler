class Blocklevel {
	level = 0;
	incre() {
		this.level += 1;
		return this.level;
	}
	decre() {
		this.level -= 1;
		return this.level;
	}
	getSpaceByLevel() {
		return " ".repeat(4 * this.level);
	}
}
export class FunctionContext {
	level: Blocklevel = new Blocklevel();
}
