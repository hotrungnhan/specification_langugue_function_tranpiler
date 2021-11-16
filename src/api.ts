import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL =
	"https://cors-anywhere.herokuapp.com/" + "https://api.jdoodle.com/v1";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
interface AuthBody {
	clientId: string;
	clientSecret: string;
}
interface ExecuteBody extends AuthBody {
	script?: string;
	stdin?: string;
	language?: Language;
	versionIndex?: number;
}
interface CreditRespone {
	used: number;
}
interface ExecuteRespone {
	output: string;
	statusCode: number;
	memory: string;
	cpuTime: string;
}
interface ExecuteError {
	error: string;
	statusCode: string;
}
const auth: AuthBody = {
	clientId: "9e4586cf0a0140c864cc63ceeb573393",
	clientSecret:
		"b3ec885354973f0d4e30b874d85a1ee009641a6945b8847a6496ace59e9e281d"
};
function executeCode(
	src: string,
	language: Language,
	stdin?: string,
	versionIndex: number = 3
) {
	return axios.post<ExecuteRespone, AxiosResponse<ExecuteRespone>, ExecuteBody>(
		"/execute",
		{
			script: src,
			language: language,
			versionIndex: versionIndex,
			stdin: stdin,
			...auth
		}
	);
}
export enum Language {
	py = "python3",
	js = "nodejs"
}
function getCredit() {
	return axios.post<CreditRespone, AxiosResponse<CreditRespone>, AuthBody>(
		"/credit-spent",
		auth
	);
}
export { executeCode, getCredit };
