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
content:"You are a dictionary."
},
{
role:"user",
content:`

Give the Turkish meaning of this English word.

Word: ${word}

Return ONLY JSON

{
"tr":"turkish meaning"
}

`
}
]

})
})

const data = await response.json()

let content = data.choices[0].message.content

content = content.replace(/```json/g,"").replace(/```/g,"")

return{
statusCode:200,
headers:{ "Content-Type":"application/json" },
body:content
}

}catch(e){

return{
statusCode:200,
body:JSON.stringify({
tr:""
})
}

}

}