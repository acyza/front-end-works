const {writeFile, readdir,stat} = require("fs/promises")
const { spawnSync } = require("child_process")
const Selenium = require("selenium-webdriver")
const Firefox = require("selenium-webdriver/firefox")

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

let driver;

async function screenshot(dir){
  if(!driver){
    const builder = new Selenium.Builder();
    builder.forBrowser(Selenium.Browser.FIREFOX)
    builder.setFirefoxOptions(
      new Firefox.Options()
      .windowSize({
        width: 500,
        height: 500,
      })
    );
    driver = builder.build();
  }
  await driver.get(`file://${__dirname}/../${dir}/index.html`);
  driver
  const png = await driver.takeScreenshot();
  await writeFile(`${dir}/screenshot.png`, Buffer.from(png,"base64"));
}

async function main(){

  const dirs = await readdir("./")
  let data = "const list=["
  const exclude = ["previewServer","pushToGithub",".git",".github"]
  for(const dir of dirs) {
    if(exclude.includes(dir) || !await isDir(dir))continue;
    await screenshot(dir);
    data = `${data}\"${dir}\",`
  }
  await writeFile("list.js",data+"]")
  exec("git add *")
  exec(`git commit -m \"update ${new Date().toDateString()}\"`)
  exec("git push")
}

main()