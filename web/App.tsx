import { useEffect, useState, useMemo, useRef } from "react";
import Modal, { Styles } from "react-modal";
import { FaInfoCircle } from "react-icons/fa";
import Editor, { useMonaco } from "@monaco-editor/react";
import { specsTokenizer } from "@web/monaco-spec";
const editorOptions = { minimap: { enabled: false } };
Modal.setAppElement("#root");
const modelType: Styles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)"
	},
	overlay: {
		zIndex: 1000
	}
};

import * as Api from "@web/api";
function App() {
	const [language, setLanguage] = useState("javascript");
	const [credit, setCredit] = useState(0);
	const [src, setSrc] = useState("");
	const [stdin, setStdin] = useState("");
	const [output, setOutput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const monaco = useMonaco();
	const isModalOpen = useMemo(() => {
		if (typeof errorMessage === "string") return errorMessage.trim() !== "";
		else return false;
	}, [errorMessage]);

	function closeModal() {
		setErrorMessage("");
	}
	type TLanguage = "javascript" | "python";
	const languageMap = {
		javascript: Api.Language.js,
		python: Api.Language.py
	};
	useEffect(() => {
		if (monaco) {
			monaco.languages.register({ id: "specs" });
			monaco.languages.setMonarchTokensProvider("specs", specsTokenizer);
		}
	}, [monaco]);

	useEffect(() => {
		Api.getCredit()
			.then((res) => {
				setCredit(res.data.used);
			})
			.catch((err) => {
				console.log(err);
				if (err.response && err.response.error) {
					console.log(err.response);
					setErrorMessage(err.response.error);
				} else if (err.response) {
					console.log(err.response);
					setErrorMessage(err.response);
				} else setErrorMessage(err.message);
			});
	}, []); // [] as 2nd parameter is componentDidmount
	function executeCode() {
		let lang = languageMap[language.toLocaleLowerCase() as TLanguage];
		if (src.trim() == "") {
			return setErrorMessage("Code in the left is empty");
		}
		if (credit >= 200) {
			return setErrorMessage("Out of credit");
		}
		Api.executeCode(src, lang, stdin)
			.then((res) => {
				setCredit(credit + 1);
				setOutput(res.data.output.trim());
			})
			.catch((err) => {
				if (err.response && err.response.error) {
					setErrorMessage(err.response.error);
				} else if (err.response) {
					setErrorMessage(err.response);
				} else setErrorMessage(err.message);
			});
	}
	return (
		<div className="container m-auto ">
			{/* //error modal */}
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				style={modelType}
				// contentLabel="Error model"
			>
				<h2 className="text-red-600 flex justify-start">
					<FaInfoCircle /> Error
				</h2>
				<p>{errorMessage}</p>
				<button
					className="btn border-blue-100 border-2 bg-green-400 my-auto text-white"
					onClick={closeModal}
				>
					Close
				</button>
			</Modal>
			<div className="p-4 inline-flex justify-between w-full mt-4 ">
				<div className="w-19/40 h-96">
					<h1 className="text-xl text-white mb-4 pl-2">Ngôn ngữ đặc tả</h1>
					<Editor
						height="100%"
						width="100%"
						theme="github"
						className="rounded-md"
						loading={<h1 className="text-white">loading...</h1>}
						language="specs"
						options={editorOptions}
					/>
				</div>

				<div className=" flex flex-col px-4 gap-4 my-auto">
					<button className="btn border-blue-100 border-2 bg-green-400 my-auto text-white ">
						Tranpiler
					</button>
					<button
						className="btn border-blue-100 border-2 bg-green-400 my-auto text-white"
						onClick={executeCode}
					>
						Run
					</button>
					<select
						value={language}
						className="rounded-md p-2 text-center"
						onChange={(event) => setLanguage(event.target.value)}
					>
						<option value="Javascript">Javascript</option>
						<option value="Python">Python</option>
					</select>
					<p className="text-white text-center text-sm font-semibold">
						Current Credit: {credit}
					</p>
				</div>
				<div className="w-19/40 h-96">
					<h1 className="text-xl text-white mb-4 pl-2">{language}</h1>
					<Editor
						height="100%"
						width="100%"
						className="rounded-md"
						language={language.toLowerCase()}
						theme="github"
						loading={<h1 className="text-white">loading...</h1>}
						value={src}
						options={editorOptions}
						onChange={(newsrc) => (newsrc ? setSrc(newsrc) : setSrc(""))}
					/>
				</div>
			</div>
			<div className="inline-flex p-4 justify-between w-full">
				<div className="w-2/6 h-40 ">
					<h1 className="text-xl text-white py-4 pl-2">Input</h1>
					<textarea
						value={stdin}
						onChange={(event) => setStdin(event.target.value)}
						className="text-area "
					></textarea>
				</div>
				<div className="w-4/6 pl-4">
					<h1 className="text-xl text-white py-4 pl-2">Console</h1>
					<textarea disabled value={output} className="text-area">
						some thing was there
					</textarea>
				</div>
			</div>
		</div>
	);
}

export default App;
