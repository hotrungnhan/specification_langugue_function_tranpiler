var R=Object.defineProperty;var g=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var y=(n,t,r)=>t in n?R(n,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[t]=r,v=(n,t)=>{for(var r in t||(t={}))O.call(t,r)&&y(n,r,t[r]);if(g)for(var r of g(t))z.call(t,r)&&y(n,r,t[r]);return n};import{a as h,j as w,M as N,r as c,F,R as I,b as k}from"./vendor.9cbbee73.js";const q=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function r(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerpolicy&&(a.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?a.credentials="include":e.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(e){if(e.ep)return;e.ep=!0;const a=r(e);fetch(e.href,a)}};q();h.defaults.baseURL="https://cors-anywhere.herokuapp.com/https://api.jdoodle.com/v1";h.defaults.headers.common["X-Requested-With"]="XMLHttpRequest";const C={clientId:"9e4586cf0a0140c864cc63ceeb573393",clientSecret:"b3ec885354973f0d4e30b874d85a1ee009641a6945b8847a6496ace59e9e281d"};function A(n,t,r=3,i){return h.post("/execute",v({script:n,language:t,versionIndex:r,stdin:i},C))}var p;(function(n){n.py="python3",n.js="nodejs"})(p||(p={}));function P(){return h.post("/credit-spent",C)}const s=w.exports.jsx,o=w.exports.jsxs;N.setAppElement("#root");const T={content:{top:"50%",left:"50%",right:"auto",bottom:"auto",marginRight:"-50%",transform:"translate(-50%, -50%)"}};function B(){const[n,t]=c.exports.useState("javascript"),[r,i]=c.exports.useState(0),[e,a]=c.exports.useState(""),[u,j]=c.exports.useState(""),[M,E]=c.exports.useState(""),[f,d]=c.exports.useState(""),L=c.exports.useMemo(()=>f.trim()!=="",[f]);function x(){d("")}const S={javascript:p.js,python:p.py};c.exports.useEffect(()=>{P().then(l=>{i(l.data.used)}).catch(l=>{d(l.message)})},[]);function b(){let l=S[n.toLocaleLowerCase()];if(e.trim()=="")return d("Code in the left is empty");if(r>=200)return d("Out of credit");A(e,l).then(m=>{i(r+1),E(m.data.output)}).catch(m=>{d(m.message)})}return o("div",{className:"container m-auto ",children:[o(N,{isOpen:L,onRequestClose:x,style:T,contentLabel:"Error model",children:[o("h2",{className:"text-red-600 flex justify-start",children:[s(F,{})," Error"]}),s("p",{children:f}),s("button",{className:"btn border-blue-100 border-2 bg-gray-600 my-auto text-white",onClick:x,children:"Close"})]}),o("div",{className:"p-4 inline-flex justify-between w-full mt-4 ",children:[o("div",{className:"w-19/40 h-96",children:[s("h1",{className:"text-xl text-white mb-4 pl-2",children:"Ng\xF4n ng\u1EEF \u0111\u1EB7c t\u1EA3"}),s("textarea",{className:" resize-none w-full h-full p-4"})]}),o("div",{className:" flex flex-col px-4 self-start gap-4",children:[s("button",{className:"btn border-blue-100 border-2 bg-gray-600 my-auto text-white ",children:"Tranpiler"}),s("button",{className:"btn border-blue-100 border-2 bg-gray-600 my-auto text-white",onClick:b,children:"Run"}),s("button",{className:"btn border-blue-100 border-2 bg-gray-600 my-auto text-white",onClick:b,children:"TestModel"}),o("select",{value:n,onChange:l=>t(l.target.value),children:[s("option",{value:"Javascript",children:"Javascript"}),s("option",{value:"Python",children:"Python"})]}),o("p",{className:"text-white",children:["Current Credit: ",r]})]}),o("div",{className:"w-19/40 h-96",children:[s("h1",{className:"text-xl text-white mb-4 pl-2",children:n}),s("textarea",{value:e,onChange:l=>a(l.target.value),className:"resize-none w-full h-full p-4"})]})]}),o("div",{className:"inline-flex p-4 justify-between w-full",children:[o("div",{className:"w-2/6 h-40 ",children:[s("h1",{className:"text-xl text-white py-4 pl-2",children:"Input"}),s("textarea",{value:u,onChange:l=>j(l.target.value),className:" h-full resize-none w-full resize-non  p-4 "})]}),o("div",{className:"w-4/6 pl-4",children:[s("h1",{className:"text-xl text-white py-4 pl-2",children:"Console"}),s("textarea",{disabled:!0,value:M,className:" h-full resize-none w-full p-4",children:"some thing was there"})]})]})]})}I.render(s(k.StrictMode,{children:s(B,{})}),document.getElementById("root"));