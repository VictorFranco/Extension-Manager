const container=document.getElementById("container");
const input=document.getElementById("search");
const all_enabled=document.getElementById("all_enabled");
const all_disabled=document.getElementById("all_disabled");
const div=document.createElement("DIV");
const btn_close=document.getElementById("close");
let checks=[];
let extensions=[];
input.addEventListener("keyup",search);
all_enabled.addEventListener("click",activate_desactivate);
all_disabled.addEventListener("click",activate_desactivate);
btn_close.addEventListener("click",()=>window.close());

load();

function load(){
    chrome.management.getAll(
        array=>{
            extensions=array;
            let html_elements=extensions.map((extension,index)=>{
                return `<div class="row" id="row${index}">${
                    icon(extension)+
                    name_(extension.name)+
                    button(index,extension.enabled)
                }</div>`;
            }).reduce((a,b)=>a+b);
            container.innerHTML=html_elements;
            extensions.forEach((_,index)=>{
                checks[index]=document.getElementById(`check${index}`);
                checks[index].addEventListener("click",pressed);
            });
    });
}

const name_=(name:string)=>{
    return `<div class="div_ext">${name}</div>`;
};

interface IExtension{
    icons:[{url:string,size:number}]
}

const icon=(extension:IExtension)=>{
    let html_element="";
    extension.icons.forEach(ext_icon=>{
        if(ext_icon.size==128) html_element=`<img src="${ext_icon.url}">`;
    });
    return html_element;
};

const button=(i:number,check:boolean)=>{
    let checked="";
    if(check) checked="checked";
    return `<input id="check${i}" type="checkbox" ${checked}><label for="check${i}"></label>`;
};

function pressed(){
    let id=(window.event.target as HTMLInputElement).id;
    let num=id.split("check")[1];
    let input=document.getElementById(id) as HTMLInputElement;
    let id_ext=extensions[num].id;
    chrome.management.setEnabled(id_ext,input.checked);
}

function search(){
    extensions.forEach((element,index)=>{    
        let display="none";
        let row=document.getElementById(`row${index}`);
        let nombre=element.name.toUpperCase();
        if (nombre.indexOf((input as HTMLInputElement).value.toUpperCase())>-1) display=""; 
        row.style.display=display;
    });
}

function activate_desactivate(){
    let state=false,toggle:HTMLElement;
    if((window.event.target as HTMLButtonElement).id=="all_enabled") state=true;
    extensions.forEach((extension,index)=>{
        if(chrome.runtime.id!=extension.id)
            chrome.management.setEnabled(extension.id,state,()=>{
                toggle=document.getElementById(`check${index}`);
                (toggle as HTMLInputElement).checked=state;
            });
    });
}
