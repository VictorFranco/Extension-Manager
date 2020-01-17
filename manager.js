const contenedor=document.getElementById("extensiones");
let div=document.createElement("DIV");
let checks=[];
let ids=[];
let checked;
carga();
let input=document.getElementById("buscar");
input.addEventListener("keyup",buscar);
let habilitar=document.getElementById("habilitar");
let deshabilitar=document.getElementById("deshabilitar");
habilitar.addEventListener("click",activar_desactivar);
deshabilitar.addEventListener("click",activar_desactivar);

function carga(){
    chrome.management.getAll(
        a=>{
            ids=a;
            let etiqueta="";
            ids.map((element,index)=>{
                etiqueta+="<div class='fila' id='fila"+index+"'>"+icon(element)+name(element.name)+button(index,element.enabled)+"</div>";
            });
            contenedor.innerHTML=etiqueta;
            ids.map((element,index)=>{
                checks[index]=document.getElementById("check"+index+"");
                checks[index].addEventListener("click",pressed);
            });
    });
}
function name(name){
    return "<div class='div_ext'>"+name+"</div>";
}
function icon(id){
    let etiqueta="";
    id.icons.map(element=>{if(element.size==128) etiqueta="<img src='"+element.url+"'>";});
    return etiqueta;
}
function button(i,check){
    let checked="";
    if(check) checked="checked";
    return "<input id='check"+i+"' type='checkbox'"+checked+"><label for='check"+i+"'></label>";
}
function pressed(){
    let id=window.event.target.id;
    let num=id.split("check")[1];
    let input=document.getElementById(id);
    let id_ext=ids[num].id;
    chrome.management.setEnabled(id_ext,input.checked);
}
function buscar(){
    ids.map((element,index)=>{    
        let display="none";
        let fila=document.getElementById("fila"+index+"");
        let nombre=element.name.toUpperCase();
        if (nombre.indexOf(input.value.toUpperCase())>-1) display=""; 
        fila.style.display=display;
    });
}
function activar_desactivar(){
    let estado=false,elemento;
    if(window.event.target.id=="habilitar") estado=true;
    ids.map((element,index)=>{
        if(chrome.runtime.id!=element.id)
            chrome.management.setEnabled(element.id,estado,()=>{
                elemento=document.getElementById("check"+index);
                elemento.checked=estado;
            });
    });
}