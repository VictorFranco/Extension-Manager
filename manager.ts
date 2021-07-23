const container    : HTMLElement = document.getElementById("container")
const input        : HTMLInputElement = document.getElementById("search") as HTMLInputElement
const all_enabled  : HTMLElement = document.getElementById("all_enabled")
const all_disabled : HTMLElement = document.getElementById("all_disabled")
const div          : HTMLElement = document.createElement("DIV")
const btn_close    : HTMLElement = document.getElementById("close")
let checks         : HTMLInputElement[] = []

type Extension = chrome.management.ExtensionInfo
let extensions : Extension[] = []

type Icon = {url:string,size:number}
interface IconsInterface{
    icons:[Icon]
}

/*    <---Callback: Extension with index--->    */
interface IExt_i<Return>{
    (extension:Extension,index:number):Return
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

            /*    <---Create HTML structure--->    */
            let html_elements:string=extensions.map(
                html_extension
            ).reduce((a:string,b:string):string=>a+b)

            /*    <---Update DOM--->    */
            container.innerHTML=html_elements
            let callback:IExt_i<void>=(_,index)=>{
                checks[index]=document.getElementById(`check${index}`) as HTMLInputElement
                checks[index].addEventListener("click",pressed)
            }
            extensions.forEach(callback)
    })
}

const html_extension:IExt_i<string>=(extension,index)=>{
    return `<div class="row" id="row${index}">${
        icon_(extension as unknown as IconsInterface)+
        name_(extension.name)+
        button_(index,extension.enabled)
    }</div>`
}

const name_=(name:string):string=>{
    return `<div class="div_ext">${name}</div>`
}

const icon_=(extension:IconsInterface):string=>{
    let img:Icon = extension.icons.filter(
        (item):boolean => item.size==128
    )[0]
    return `<img src="${ img.url ?? "" }">`
}

const button_=(i:number,check:boolean):string=>{
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
    let callback:IExt_i<void>  = (extension,index)=>{
        let row:HTMLDivElement = document.getElementById(`row${index}`) as HTMLDivElement
        let name:string        = extension.name.toUpperCase()
        let is_similar:boolean = name.indexOf(input.value.toUpperCase())>-1
        row.style.display      = is_similar?"":"none"
    }
    extensions.forEach(callback)
}

function activate_desactivate():void{
    let toggle:HTMLInputElement
    let btn:HTMLButtonElement  = window.event.target as HTMLButtonElement
    let state:boolean          = btn.id=="all_enabled"
    let callback:IExt_i<void>  = (extension,index)=>{
        if(chrome.runtime.id  != extension.id)
            chrome.management.setEnabled(extension.id,state,():void=>{
                toggle=document.getElementById(`check${index}`) as HTMLInputElement
                toggle.checked = state
            })
    }
    extensions.forEach(callback)
}
