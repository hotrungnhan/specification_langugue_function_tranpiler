import React from "react";
import ReactDOM from "react-dom";
import "@web/tailwind.css";
import App from "@web/App";
// import Prism from "prism-react-renderer/prism";

// (typeof global !== "undefined" ? global : window).Prism = Prism;

// require("prismjs/components/prism-kotlin");
// require("prismjs/components/prism-csharp");
ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
