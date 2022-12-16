const {writeFile, readdir,stat} = require("fs/promises")
const { spawnSync } = require("child_process")

async function isDir(name) {
  return (await stat(name)).isDirectory()
}

function exec(name){
  const result=spawnSync(name,{shell:true,stdio:[process.stdin,process.stdout,process.stderr]})
  if(result.error){
    console.error(result.error)
    process.exit(-1)
  }
}

async function main(){
  const dirs = await readdir("./")
  let data = "const list=["
  const exclude = ["previewServer","pushToGithub",".git"]
  for(const dir of dirs) {
    if(exclude.includes(dir) || !await isDir(dir))continue;
    data = `${data}${dir},`
  }
  writeFile("list.js",data+"]")
  exec("git add *")
  exec(`git commit -m \"update ${new Date().toDateString()}\"`)
  exec("git push")
}

main()