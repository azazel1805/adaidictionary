let oxfordWords = []

let quizWords = []
let currentQuestion = 0
let score = 0
let totalQuestions = 5

async function loadOxford(){

const res = await fetch("/data/oxford_master_5000.json")
oxfordWords = await res.json()

console.log("Oxford loaded:", oxfordWords.length)

}

loadOxford()



export function quiz(app){

app.innerHTML = `

<div class="max-w-3xl mx-auto p-4 space-y-6">

<h2 class="text-2xl font-semibold">
Quiz
</h2>

<select id="cefrLevel" class="border p-2 rounded w-full">

<option value="all">All Levels</option>
<option value="A1">A1</option>
<option value="A2">A2</option>
<option value="B1">B1</option>
<option value="B2">B2</option>
<option value="C1">C1</option>

</select>

<select id="questionCount" class="border p-2 rounded w-full">

<option value="5">5 Questions</option>
<option value="10">10 Questions</option>
<option value="20">20 Questions</option>

</select>

<button
onclick="startQuiz()"
class="bg-black text-white p-3 rounded w-full">

Start Quiz

</button>

<div id="quizArea"></div>

</div>

`

}



window.startQuiz = function(){

let level = document.getElementById("cefrLevel").value
totalQuestions = parseInt(document.getElementById("questionCount").value)

let words = oxfordWords

if(level !== "all"){

words = words.filter(w => (w.cefr || w.level) === level)

}

if(words.length === 0){

alert("No words found")

return

}

quizWords = shuffle(words).slice(0,totalQuestions)

currentQuestion = 0
score = 0

nextQuestion()

}



async function nextQuestion(){

if(currentQuestion >= totalQuestions){

showResult()
return

}

let wordObj = quizWords[currentQuestion]

let correctWord = wordObj.word || wordObj.headword

let aiData = {tr:""}

try{

const res = await fetch("/.netlify/functions/ai-quiz",{

method:"POST",
body:JSON.stringify({word:correctWord})

})

aiData = await res.json()

}catch(e){

console.log("AI error")

}



renderQuestion(correctWord, aiData.tr)

}



function renderQuestion(correctWord,tr){

let options = [correctWord]

while(options.length < 4){

let random = oxfordWords[Math.floor(Math.random()*oxfordWords.length)]

let w = random.word || random.headword

if(!options.includes(w)) options.push(w)

}

options = shuffle(options)

let buttons = options.map(o=>`

<button
class="border p-3 rounded w-full text-left hover:bg-gray-100"
onclick="checkAnswer('${o}','${correctWord}')">

${o}

</button>

`).join("")



document.getElementById("quizArea").innerHTML = `

<div class="space-y-4 mt-6">

<p class="text-sm text-gray-500">
Question ${currentQuestion+1} / ${totalQuestions}
</p>

<p class="text-lg">
Türkçe anlamı verilen kelimeyi seçiniz
</p>

<p class="font-semibold text-lg">
${tr || correctWord}
</p>

<div class="space-y-2">

${buttons}

</div>

<div id="feedback" class="mt-3 text-sm"></div>

</div>

`

}



window.checkAnswer = function(choice,correct){

let feedback = document.getElementById("feedback")

if(choice === correct){

score++

feedback.innerHTML =
"<span class='text-green-600'>Correct</span>"

}else{

feedback.innerHTML =
"<span class='text-red-600'>Wrong. Correct answer: "+correct+"</span>"

}

setTimeout(()=>{

currentQuestion++
nextQuestion()

},1200)

}



function showResult(){

document.getElementById("quizArea").innerHTML = `

<div class="text-center space-y-4 mt-6">

<h3 class="text-xl font-semibold">
Quiz Finished
</h3>

<p class="text-lg">

Score: ${score} / ${totalQuestions}

</p>

<button
onclick="startQuiz()"
class="bg-black text-white px-6 py-3 rounded">

Try Again

</button>

</div>

`

}



function shuffle(array){

return array.sort(()=>Math.random()-0.5)

}