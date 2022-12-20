const subjectList = [
  ["女装","男装","运动"],
  ["女鞋","男鞋","箱包"],
  ["美妆","饰品","洗护"],
  ["手机","电脑","数码"],
  ["家电","厨具","车品"],
  ["食品","水果","生鲜"],
  ["医药","保健","体育"]
]

window.addEventListener('load',()=>{

  const listDom = document.querySelector("#list")
  for(const row of subjectList){
    const rowDom = document.createElement("div")
    for(const item of row){
      const itemDom = document.createElement("span");
      itemDom.className = "item";
      itemDom.innerHTML = `<a href="">${item}</a>`;
      rowDom.appendChild(itemDom)
    }
    listDom.appendChild(rowDom)
  }
  carousel(".carousel")
  .add("测试广告位1")
  .add("测试广告位2")
  .add("测试广告位3")
  .auto(true)
  for(i of range(1,11))
  document.querySelector(".like-main")
  .appendChild(commondity({
    title: `测试商品${i}`,
    money: (Math.ceil(Math.random() * 1000) / 100 + 5.0001 + '').replace(/(?<=\...).*/,''),
    tags:["七天无理由"],
    img:"image.png"
  }))
})

/**
 * @param { HTMLElement } dom
 * 轮播图控件封装
 */
function carousel(dom){
  if (typeof dom == 'string') dom = document.querySelector(dom);
  dom.className = "carousel";
  const select = document.createElement("form");
  select.className = "select";
  dom.appendChild(select);
  select.addEventListener('change',()=>{
    const data = new FormData(select);
    selectIndex = data.get("select") || 0
    dom.style.setProperty('--value',selectIndex);
  })
  let count = 0;
  let HAuto = -1;
  let selectIndex = 0;
  return {
    get add(){
      return (value)=>{
        const item = document.createElement("div");
        item.className = "item";
        if(typeof value == 'string')
          item.innerHTML = value
        else
          item.appendChild(value)
        dom.appendChild(item)
        const selectInput = document.createElement("div");
        selectInput.innerHTML =
        `<input type="radio" name="select" value="${count}" ${count?"":"checked"}/><div></div>`;
        select.appendChild(selectInput);
        count++;
        return this
      }
    },
    set add(dom){
      this.add(dom);
    },
    get auto(){
      return (value)=>{
        if (value == undefined) value = true;
        clearInterval(HAuto);
        if(value){
          HAuto = setInterval(()=>{
            selectIndex++;
            selectIndex %= count;
            select.children[selectIndex].firstElementChild.click();
          },3000);
        }
      }
    },
    set auto(value){
      this.auto(value)
    }
  }
}

/**
 * for 次数
 */
function range(form,to){
  if(to == undefined) {
    to = form;
    form = 0;
  }
  const result = {
    [Symbol.iterator]() {
      return {
        next:() => {
          return {
            value: form++,
            done: to<form
          };
        }
      }
    }
  }
  return result
}

/**
 * 封装一个dom工具
 * @param {HTMLElement | undefined} dom
 */
function domTools(dom) {
  const doms = []
  let pre = undefined;
  const tool = new Proxy({},{
    /**
     * 
     * @param {string} value 
     * @returns 
     */
    get(obj,value){
      pre && pre()
      if(value == "domTools") return true
      else if(value == "get"){
        if(dom){
          for(const item of doms)
            dom.appendChild(item)
        }
        return doms;
      }
      pre = (props,childs)=>{
        pre = undefined;
        //允许第一个参数放childs
        if(props && props.domTools || Array.isArray(props)) {
          childs = props;
          props = undefined;
        }
        const split = value.split(/(?=(?<![\{|\"].*[^\}|\"])(?=\.|\#|\:)|\{)/);
        let dom;
        const _doms = [];
        for(const code of split) {
          if(/^[\.|\#|\:\{]/.test(code) && !dom)
            dom = document.createElement("div")
          switch(code[0]){
            case '#':
              dom.id = code.substring(1)
              break
            case '.':
              dom.classList.add(code.substring(1))
              break
            case ':':
              dom.innerText =
                code.substring(1)
                .replace(/(^\")|(\"$)/g,'')
              break
            case '{':
              if(!/^{.*}$/.test(code))throw '解析错误'
              dom.style = code.replace(/\{|\}/g,'')
              break
            default:
              if(dom) _doms.push(dom);
              dom = document.createElement(code)
          }
        }
        _doms.push(dom);
        if(childs && !Array.isArray(childs))childs = childs.get
        for(const dom of _doms){
          if(props)
            Object.assign(dom,props);
          if(childs) {
            for(const child of childs)
              dom.appendChild(child)
          }
        }
        doms.push.apply(doms,_doms);
        return tool;
      }
      return new Proxy(pre,{get:this.get})
    }
  })
  return tool;
}

/**
 * @param {{title?: string,img?: string,tags?: string[],money?: number}} option
 * @return { HTMLDivElement }
 */
function commondity(option){
  const dom = document.createElement("div");
  dom.className = "item"
  domTools(dom)
  [".image"](
    domTools()
    ["i.bi.bi-image"]
    ["img"]({
      src: option.img || "",
      onerror:({target}) => target.style.display = 'none'
    })
  )
  [".info"](
    domTools()
    [`.title:"${option?.title || 'title'}"`]
    [".tag"](option?.tags && (()=>{
      const t = domTools()
      for(const tag of option.tags)
        t[`span:"${tag}"`]
      return t 
    })())
    ["{flex-grow:1}"]
    [`.money:"${option?.money || "-"}"`]
  )
  .get
  return dom
}
