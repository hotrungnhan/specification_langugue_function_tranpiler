import { VariableIdentifier } from "@tranpiler/expr";

export class VariableContext {
	variable: Array<VariableIdentifier> = [];
	isVariableExist(vi: VariableIdentifier) {
		return this.variable.find((value) => {
			return value.Equal(vi);
		});
	}

	concatVariable(vi: VariableIdentifier[]) {
		this.variable = this.variable.concat(vi);
	}
	pushVariable(...vi: VariableIdentifier[]) {
		this.variable = this.variable.concat(vi);
	}
	reset() {
		this.variable = [];
	}
}
export class FunctionContext extends VariableContext {
	level: Blocklevel = new Blocklevel();
	constructor() {
		super();
	}
	reset() {
		super.reset();
		this.level.reset();
	}
}
class Blocklevel {
	level = 0;
	setReturn(){
		return 1;
	}
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
	reset() {
		this.level = 0;
	}
}
