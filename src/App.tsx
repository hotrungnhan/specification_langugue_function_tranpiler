import { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import { FaInfoCircle } from "react-icons/fa";
Modal.setAppElement("#root");
const modelType = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)"
	}
};

import * as Api from "@web/api";
// import Highlight, { defaultProps } from "prism-react-renderer";
function App() {
	const [language, setLanguage] = useState("javascript");
	const [credit, setCredit] = useState(0);
	const [src, setSrc] = useState("");
	const [stdin, setStdin] = useState("");
	const [output, setOutput] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const isModalOpen = useMemo(() => {
		return errorMessage.trim() !== "";
	}, [errorMessage]);

	function closeModal() {
		setErrorMessage("");
	}
	type TLanguage = "Javascript" | "Python";
	const languageMap = {
		Javascript: Api.Language.js,
		Python: Api.Language.py
	};
	useEffect(() => {
		Api.getCredit()
			.then((res) => {
				setCredit(res.data.used);
			})
			.catch((err) => {
				setErrorMessage(err.message);
			});
	}, []); // [] as 2nd parameter is componentDidmount
	function executeCode() {
		let lang = languageMap[language as TLanguage];
		if (src.trim() == "") {
			return setErrorMessage("Code in the left is empty");
		}
		if (credit >= 200) {
			return setErrorMessage("Out of credit");
		}
		Api.executeCode(src, lang)
			.then((res) => {
				setCredit(credit + 1);
				setOutput(res.data.output);
			})
			.catch((err) => {
				setErrorMessage(err.message);
			});
	}
	return (
		<div className="container m-auto ">
			{/* //error modal */}
			<Modal
				isOpen={isModalOpen}
				onRequestClose={closeModal}
				style={modelType}
				contentLabel="Error model"
			>
				<h2 className="text-red-600 flex justify-start">
					<FaInfoCircle /> Error
				</h2>
				<p>{errorMessage}</p>
				<button
					className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white"
					onClick={closeModal}
				>
					Close
				</button>
			</Modal>
			<div className="p-4 inline-flex justify-between w-full mt-4 ">
				<div className="w-19/40 h-96">
					<h1 className="text-xl text-white mb-4 pl-2">Ngôn ngữ đặc tả</h1>
					<textarea className=" resize-none w-full h-full p-4"></textarea>
				</div>

				<div className=" flex flex-col px-4 self-start gap-4">
					<button className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white ">
						Tranpiler
					</button>
					<button
						className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white"
						onClick={executeCode}
					>
						Run
					</button>
					<button
						className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white"
						onClick={executeCode}
					>
						TestModel
					</button>
					<select
						value={language}
						onChange={(event) => setLanguage(event.target.value)}
					>
						<option value="javascript">Javascript</option>
						<option value="python">Python</option>
					</select>
					<p className="text-white">Current Credit: {credit}</p>
				</div>
				<div className="w-19/40 h-96">
					<h1 className="text-xl text-white mb-4 pl-2">{language}</h1>
					<textarea
						value={src}
						onChange={(event) => setSrc(event.target.value)}
						className="resize-none w-full h-full p-4"
					></textarea>
				</div>
			</div>
			<div className="inline-flex p-4 justify-between w-full">
				<div className="w-2/6 h-40 ">
					<h1 className="text-xl text-white py-4 pl-2">Input</h1>
					<textarea
						value={stdin}
						onChange={(event) => setStdin(event.target.value)}
						className=" h-full resize-none w-full resize-non  p-4 "
					></textarea>
				</div>
				<div className="w-4/6 pl-4">
					<h1 className="text-xl text-white py-4 pl-2">Console</h1>
					<textarea
						disabled
						value={output}
						className=" h-full resize-none w-full p-4"
					>
						some thing was there
					</textarea>
				</div>
			</div>
		</div>
	);
}

export default App;
