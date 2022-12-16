/**矫正延时 */
function corrent() {
  return 1000 - new Date().getMilliseconds()
}

window.addEventListener('load',()=>{
  /**@type {HTMLDivElement} */
  const hour = document.querySelector(".hour");
  const minute = document.querySelector(".minute")
  const second = document.querySelector(".second")
  setInterval(()=>{
    const time = new Date()
    hour.style.setProperty("--value", time.getHours() * 2.5)
    minute.style.setProperty("--value",time.getMinutes())
    second.style.setProperty("--value",time.getSeconds())
  },corrent())
})