window.addEventListener('load',()=>{
  const nav_bar = document.getElementById("nav_bar");
  /** @type { HTMLDivElement } */
  const select = nav_bar.querySelector(".select");
  const animalStep = {}

  /** 
   * 获取改变后select元素的left 和 right
   * @param { HTMLElement } item
   */
  function getChange(item){
    const padding = 5;
    return {
      left: item.offsetLeft - padding + "px",
      right: nav_bar.offsetWidth - item.offsetLeft - item.offsetWidth - padding + "px"
    }
  }

  //初始化选择元素
  const defaultItem = nav_bar.querySelector("nav")
  Object.assign(select.style,getChange(defaultItem));
  defaultItem.querySelector("input").click();
  select.style.transition = "300ms";

  nav_bar.addEventListener("change",(event)=>{
    /** @type { HTMLElement } */
    const item = event.target.parentElement;
    const { left,right } = getChange(item)
    if(item.offsetLeft < select.offsetLeft){
      select.style.left = left;
      animalStep.right = right;
    }else{
      select.style.right = right;
      animalStep.left = left;
    }
  });
  select.addEventListener('transitionend',()=>{
    for(const key in animalStep){
      select.style[key] = animalStep[key];
      delete animalStep[key]
    }
  })

})