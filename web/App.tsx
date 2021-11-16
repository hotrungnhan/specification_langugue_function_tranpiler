import { useState } from "react";
// import Highlight, { defaultProps } from "prism-react-renderer";
function App() {
	const [count, setCount] = useState(0);
	const [language, setLanguage] = useState("javascript");
	const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`;
	return (
		<div className="container m-auto ">
			<div className="p-4 inline-flex justify-between w-full mt-4 ">
				<div className="w-19/40 h-96">
					<h1 className="text-xl text-white mb-4 pl-2">Ngôn ngữ đặc tả</h1>
					<textarea className=" resize-none w-full h-full p-4"></textarea>
				</div>

				<div className=" flex flex-col px-4 self-start gap-4">
					<button className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white ">
						Tranpiler
					</button>
					<button className="btn border-blue-100 border-2 bg-gray-600 my-auto text-white">
						Run
					</button>
					<select
						value={language}
						onChange={(event) => setLanguage(event.target.value)}
					>
						<option value="javascript">Javascript</option>
						<option value="python">Python</option>
					</select>
				</div>
				<div className="w-19/40 h-96 ">
					<h1 className="text-xl text-white mb-4 pl-2">{language}</h1>
					<textarea className="resize-none w-full h-full p-4"></textarea>
				</div>
			</div>
			<div className="inline-flex p-4 justify-between w-full">
				<div className="w-2/6 h-40 ">
					<h1 className="text-xl text-white py-4 pl-2">Input</h1>
					<textarea className=" h-full resize-none w-full resize-non  p-4 ">
						some thing was there
					</textarea>
				</div>
				<div className="w-4/6 pl-4">
					<h1 className="text-xl text-white py-4 pl-2">Console</h1>
					<textarea disabled className=" h-full resize-none w-full p-4">
						some thing was there
					</textarea>
				</div>
			</div>
		</div>
	);

	// return (
	// 	<div className="App">
	// 		<header className="App-header">
	// 			<img src={logo} className="App-logo" alt="logo" />
	// 			<p>Hello Vite + React!</p>
	// 			<p>
	// 				<button type="button" onClick={() => setCount((count) => count + 1)}>
	// 					count is: {count}
	// 				</button>
	// 			</p>
	// 			<p>
	// 				Edit <code>App.tsx</code> and save to test HMR updates.
	// 			</p>
	// 			<p>
	// 				<a
	// 					className="App-link"
	// 					href="https://reactjs.org"
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 				>
	// 					Learn React
	// 				</a>
	// 				{" | "}
	// 				<a
	// 					className="App-link"
	// 					href="https://vitejs.dev/guide/features.html"
	// 					target="_blank"
	// 					rel="noopener noreferrer"
	// 				>
	// 					Vite Docs
	// 				</a>
	// 			</p>
	// 		</header>
	// 	</div>
	// );
}

export default App;
