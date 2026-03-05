let currentWord = ""

export function dictionary(app){

app.innerHTML = `

<div class="max-w-4xl mx-auto p-4 space-y-6">

<div class="flex gap-2">

<input
id="wordInput"
placeholder="Enter a word..."
class="border p-3 rounded w-full"
/>

<button
onclick="searchWord()"
class="bg-black text-white px-6 rounded">

Search

</button>

</div>

<div id="result"></div>

</div>

`

}

window.searchWord = async function(){

let word = document
.getElementById("wordInput")
.value
.trim()
.toLowerCase()

if(!word) return

currentWord = word

const result = document.getElementById("result")

result.innerHTML = "Loading..."

try{

const res = await fetch("/.netlify/functions/ai-word",{
method:"POST",
body:JSON.stringify({word})
})

const data = await res.json()

renderWord(data)

loadImages(word)

}catch{

result.innerHTML = "Error loading word."

}

}

function renderWord(data){

const result = document.getElementById("result")

const definitionsHTML = renderDefinitions(data)

const collocationsHTML = renderList(data.collocations)
const familyHTML = renderList(data.word_family)
const idiomsHTML = renderList(data.idioms)
const grammarHTML = renderList(data.grammar_patterns)
const synonymsHTML = renderList(data.synonyms)
const antonymsHTML = renderList(data.antonyms)

result.innerHTML = `

<div class="space-y-6">

<div>

<h2 class="text-2xl font-semibold">
${data.word}
</h2>

<p class="text-gray-500">
/${data.pronunciation?.uk || ""}/ (UK)
/${data.pronunciation?.us || ""}/ (US)
</p>

<button
onclick="speak('${data.word}')"
class="border px-3 py-1 rounded mt-2">

🔊 Pronounce

</button>

</div>

<div id="imageArea"></div>

<div class="flex gap-4 border-b pt-4 overflow-x-auto">

<button class="tabBtn" data-tab="definitions">Definitions</button>
<button class="tabBtn" data-tab="collocations">Collocations</button>
<button class="tabBtn" data-tab="family">Word Family</button>
<button class="tabBtn" data-tab="idioms">Idioms</button>
<button class="tabBtn" data-tab="grammar">Grammar</button>
<button class="tabBtn" data-tab="synonyms">Synonyms</button>
<button class="tabBtn" data-tab="antonyms">Antonyms</button>

</div>

<div id="definitionsTab" class="tabContent">

${definitionsHTML}

</div>

<div id="collocationsTab" class="tabContent hidden">

${collocationsHTML}

</div>

<div id="familyTab" class="tabContent hidden">

${familyHTML}

</div>

<div id="idiomsTab" class="tabContent hidden">

${idiomsHTML}

</div>

<div id="grammarTab" class="tabContent hidden">

${grammarHTML}

</div>

<div id="synonymsTab" class="tabContent hidden">

${synonymsHTML}

</div>

<div id="antonymsTab" class="tabContent hidden">

${antonymsHTML}

</div>

<div>

<h3 class="font-semibold mt-6">
Etymology
</h3>

<p>
${data.etymology || ""}
</p>

</div>

<button
onclick="saveWord('${data.word}')"
class="bg-black text-white px-4 py-2 rounded">

Save to Notebook

</button>

</div>

`

activateTabs()
activateWordLinks()

}

function renderDefinitions(data){

let html = ""

if(!data.definitions || data.definitions.length===0){

return `<p class="text-gray-400">No definitions</p>`

}

data.definitions.forEach(section=>{

html += `<h3 class="font-semibold mt-6">${section.pos}</h3>`

section.meanings.forEach(m=>{

html += `

<div class="mb-4">

<p class="text-gray-900">
${m.definition}
</p>

<p class="text-gray-500 italic text-sm">
"${m.example}"
</p>

<p class="text-blue-600 text-sm">
${m.tr || ""}
</p>

</div>

`

})

})

return html

}

function renderList(list){

if(!list || list.length===0){

return `<p class="text-gray-400">No data</p>`

}

return list
.map(w=>`<span class="linkWord">${w}</span>`)
.join(", ")

}

function activateTabs(){

document.querySelectorAll(".tabBtn")
.forEach(btn=>{

btn.onclick=function(){

let tab = this.dataset.tab

document
.querySelectorAll(".tabContent")
.forEach(t=>t.classList.add("hidden"))

document
.getElementById(tab+"Tab")
.classList.remove("hidden")

}

})

}

async function loadImages(word){

try{

const res = await fetch("/.netlify/functions/pexels",{
method:"POST",
body:JSON.stringify({word})
})

const images = await res.json()

if(!images.length) return

let html = images.map(src=>`

<img
src="${src}"
class="rounded-lg object-cover w-full h-40"
/>

`).join("")

document.getElementById("imageArea").innerHTML = `

<h3 class="font-semibold mt-6">
Images
</h3>

<div class="grid grid-cols-3 gap-3 mt-2">

${html}

</div>

`

}catch{}

}

function activateWordLinks(){

document.querySelectorAll(".linkWord")
.forEach(el=>{

el.style.cursor="pointer"
el.style.textDecoration="underline"

el.onclick=function(){

document.getElementById("wordInput").value=this.innerText
searchWord()

}

})

}

window.saveWord=function(word){

let notebook =
JSON.parse(localStorage.getItem("notebook")) || []

if(notebook.find(w=>w.word===word)){

alert("Already saved")
return

}

notebook.push({
word,
date:Date.now()
})

localStorage.setItem(
"notebook",
JSON.stringify(notebook)
)

alert("Saved!")

}

window.speak=function(word){

const utter = new SpeechSynthesisUtterance(word)

utter.lang="en-US"

speechSynthesis.speak(utter)

}