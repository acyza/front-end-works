console.log("auto reflush");
(async ()=>{
  (await fetch("/watch"))
  location.reload()
})()