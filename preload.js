const { parseSong } = require("./chordpro/parser")
const arr = parseSong("{title: Who are you}");
console.log({ arr })

window.addEventListener('DOMContentLoaded', () => {
	const sidePanel = document.getElementById("side-panel")
	sidePanel.innerText = 'aaa'
})