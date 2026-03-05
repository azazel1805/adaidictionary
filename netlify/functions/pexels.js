export async function handler(event){

try{

const { word } = JSON.parse(event.body)

const response = await fetch(
`https://api.pexels.com/v1/search?query=${word}&per_page=6`,
{
headers:{
Authorization: process.env.PEXELS_API_KEY
}
}
)

const data = await response.json()

const images = data.photos.map(photo=>photo.src.medium)

return{
statusCode:200,
headers:{
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
},
body:JSON.stringify(images)
}

}catch(error){

console.log("PEXELS ERROR:",error)

return{
statusCode:200,
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify([])
}

}

}