export function notebook(app){

let notebook =
JSON.parse(localStorage.getItem("notebook")) || []

app.innerHTML = `

<div class="max-w-4xl mx-auto p-4 space-y-6">

<h2 class="text-2xl font-semibold">
Notebook
</h2>

<input
id="notebookSearch"
placeholder="Search saved words..."
class="border p-2 rounded w-full"
/>

<div
id="notebookList"
class="grid gap-3">

</div>

</div>

`

renderNotebook(notebook)

}

function renderNotebook(words){

const list =
document.getElementById("notebookList")

if(!list) return

if(words.length === 0){

list.innerHTML = `

<p class="text-gray-500">
No saved words yet
</p>

`

return
}

let html = words.map((w,i)=>`

<div class="border rounded-xl p-4 bg-white">

<div class="flex justify-between items-center">

<h3 class="font-semibold text-lg">
${w.word}
</h3>

<button
onclick="deleteWord(${i})"
class="text-red-500">

Delete

</button>

</div>

<p class="text-gray-600 text-sm mt-1">

${w.tr || ""}

</p>

<div class="flex gap-2 mt-3">

<button
onclick="searchFromWord('${w.word}')"
class="bg-black text-white px-3 py-1 rounded text-sm">

Open

</button>

</div>

</div>

`).join("")

list.innerHTML = html

}

document.addEventListener("input",(e)=>{

if(e.target.id === "notebookSearch"){

let notebook =
JSON.parse(localStorage.getItem("notebook")) || []

let filtered =
notebook.filter(w =>

w.word
.toLowerCase()
.includes(
e.target.value.toLowerCase()
)

)

renderNotebook(filtered)

}

})

window.deleteWord = function(index){

let notebook =
JSON.parse(localStorage.getItem("notebook")) || []

notebook.splice(index,1)

localStorage.setItem(
"notebook",
JSON.stringify(notebook)
)

location.reload()

}