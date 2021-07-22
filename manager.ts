const container    : HTMLElement = document.getElementById("container")
const input        : HTMLInputElement = document.getElementById("search") as HTMLInputElement
const all_enabled  : HTMLElement = document.getElementById("all_enabled")
const all_disabled : HTMLElement = document.getElementById("all_disabled")
const div          : HTMLElement = document.createElement("DIV")
const btn_close    : HTMLElement = document.getElementById("close")
let checks         : HTMLInputElement[] = []

type Extension = chrome.management.ExtensionInfo
let extensions : Extension[] = []

interface IconsInterface{
    icons:[{url:string,size:number}]
}

input.addEventListener("keyup",search)
all_enabled.addEventListener("click",activate_desactivate)
all_disabled.addEventListener("click",activate_desactivate)
btn_close.addEventListener("click",():void=>window.close())

load()

function load():void{
    chrome.management.getAll(
        (array):void=>{
            extensions=array
            let html_elements:string=extensions.map(
                (extension:Extension,index:number):string=>{
                    return `<div class="row" id="row${index}">${
                        icon(extension as unknown as IconsInterface)+
                        name_(extension.name)+
                        button(index,extension.enabled)
                    }</div>`
            }).reduce((a:string,b:string):string=>a+b)
            container.innerHTML=html_elements
            extensions.forEach((_:any,index:number):void=>{
                checks[index]=document.getElementById(`check${index}`) as HTMLInputElement
                checks[index].addEventListener("click",pressed)
            })
    })
}

const name_=(name:string):string=>{
    return `<div class="div_ext">${name}</div>`
}

const icon=(extension:IconsInterface):string=>{
    let html_element:string=""
    extension.icons.forEach((ext_icon):void=>{
        if(ext_icon.size==128) html_element=`<img src="${ext_icon.url}">`
    })
    return html_element
}

const button=(i:number,check:boolean):string=>{
    let checked:string=check?"checked":""
    return `<input id="check${i}" type="checkbox" ${checked}>
            <label for="check${i}"></label>`
}

function pressed():void{
    let input:HTMLInputElement
    input = window.event.target as HTMLInputElement
    let id:string     = input.id
    let num:number    = Number(id.split("check")[1])
    let id_ext:string = extensions[num].id
    input = document.getElementById(id) as HTMLInputElement
    chrome.management.setEnabled(id_ext,input.checked)
}

function search():void{
    extensions.forEach((element:Extension,index:number):void=>{
        let row:HTMLDivElement = document.getElementById(`row${index}`) as HTMLDivElement
        let nombre:string      = element.name.toUpperCase()
        let is_similar:boolean = nombre.indexOf(input.value.toUpperCase())>-1
        row.style.display      = is_similar?"":"none"
    })
}

function activate_desactivate():void{
    let toggle:HTMLInputElement
    let btn:HTMLButtonElement = window.event.target as HTMLButtonElement
    let state:boolean         = btn.id=="all_enabled"
    extensions.forEach((extension:Extension,index:number):void=>{
        if(chrome.runtime.id!=extension.id)
            chrome.management.setEnabled(extension.id,state,():void=>{
                toggle=document.getElementById(`check${index}`) as HTMLInputElement
                toggle.checked=state
            })
    })
}
