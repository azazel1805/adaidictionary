export async function handler(event){

try{

const { word } = JSON.parse(event.body)

const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
},
body:JSON.stringify({

model:"gpt-4o-mini",

messages:[

{
role:"system",
content:`

You are an advanced English dictionary similar to Oxford and Cambridge.

Rules:

- Include ALL common meanings.
- Group meanings by part of speech.
- Each meaning must include:
  definition
  example sentence
  Turkish translation

- Include:
  synonyms
  antonyms
  collocations
  word family
  idioms
  grammar patterns
  etymology

Return ONLY JSON.

`
},

{
role:"user",
content:`

Word: ${word}

Return JSON:

{
"word":"",

"pronunciation":{
"uk":"",
"us":""
},

"definitions":[
{
"pos":"",
"meanings":[
{
"definition":"",
"example":"",
"tr":""
}
]
}
],

"synonyms":[],
"antonyms":[],

"collocations":[],

"word_family":[],

"idioms":[],

"grammar_patterns":[],

"etymology":""

}

`
}

]

})
})

const data = await response.json()

let content = data.choices[0].message.content

// clean markdown if AI adds it

content = content
.replace(/```json/g,"")
.replace(/```/g,"")
.trim()

return{
statusCode:200,
headers:{
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
},
body:content
}

}catch(error){

console.log("AI WORD ERROR:",error)

return{
statusCode:200,
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({

word:"",
pronunciation:{uk:"",us:""},

definitions:[],

synonyms:[],
antonyms:[],

collocations:[],
word_family:[],
idioms:[],
grammar_patterns:[],

etymology:""

})

}

}

}