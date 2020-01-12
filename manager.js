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
            for(let i=0;i<ids.length;i++){
                contenedor.innerHTML+="<div class='fila' id='fila"+i+"'>"+icon(ids[i])+name(ids[i].name)+button(i,ids[i].enabled)+"</div>";
            }
            for(let i=0;i<ids.length;i++){
                checks[i]=document.getElementById("check"+i+"");
                checks[i].addEventListener("click",pressed);
            }
    });
}
function name(name){
    let etiqueta="";
    etiqueta="<div class='div_ext'>"+name+"</div>";
    return etiqueta;
}
function icon(id){
    let etiqueta="";
    for(let j=0;j<id.icons.length;j++){
        if(id.icons[j].size==128){
            etiqueta="<img src='"+id.icons[j].url+"'>";
        }
    }
    return etiqueta;
}
function button(i,check){
    let etiqueta="",checked="";
    if(check){
        checked="checked";
    }
    etiqueta="<input id='check"+i+"' type='checkbox'"+checked+"><label for='check"+i+"'></label>";    
    return etiqueta;
}
function pressed(){
    let id=window.event.target.id;
    let num=id.split("check")[1];
    let input=document.getElementById(id);
    let id_ext=ids[num].id;
    if(input.checked==true)
        chrome.management.setEnabled(id_ext,true,()=>{console.log("listo")});
    else
        chrome.management.setEnabled(id_ext,false,()=>{console.log("listo")});
}
function buscar(){
    console.log(input.value.toUpperCase());
    for(let i=0;i<ids.length;i++){
        let fila=document.getElementById("fila"+i+"");
        nombre=ids[i].name.toUpperCase();
        if(nombre.indexOf(input.value.toUpperCase())>-1){
            fila.style.display=""; 
        }
        else{
            fila.style.display="none";
        }
    }
}
function activar_desactivar(){
    let estado=false;
    let elemento;
    if(window.event.target.id=="habilitar"){
        estado=true;
    }
    for(let i=0;i<ids.length;i++){
        if(chrome.runtime.id!=ids[i].id){
            chrome.management.setEnabled(ids[i].id,estado,()=>{
                elemento=document.getElementById("check"+i);
                elemento.checked=estado;
            });
        }
    }
}