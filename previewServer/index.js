const { existsSync,watch } = require("fs")
const { readFile, stat } = require("fs/promises")
const http = require("http")

const waitQueue = [];

async function isDir(path){
  if(!existsSync(path))return false;
  const result = await stat(path)
  return result.isDirectory()
}

(async ()=>{
  const watchDir = await watch("./",{recursive:true})
  watchDir.on("change",()=>{
    while(!(waitQueue.pop()||(()=>true))());
  })
})()
/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.IncomingMessage} res 
 */
async function watchHandler(req,res) {
  await new Promise((next)=>waitQueue.push(next))
  res.end()
  console.log("reflush")
}

const server = new http.Server(async(req,res)=>{
  if(req.url == "/watch") return watchHandler(req,res);
  let url = "./"+decodeURI(req.url)
  if(/[\/|\\]$/.test(url))
    url = url + "/index.html"
  console.log(url)
  if(existsSync(decodeURI(url))){
    if(await isDir(url)) res.write("<script>location.href=`${location.href}/`</script>");
    else res.write(await readFile(url))
  }
  else
    res.statusCode = 404
  if(/\.html$/.test(url))
    res.write("<script src=\"/previewServer/watch.js\"></script>")
  res.end()
})

server.listen(8080)