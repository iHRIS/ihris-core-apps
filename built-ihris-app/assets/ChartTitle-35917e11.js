import{T as r}from"./TextStyle-69cf3cd2.js";import{_ as m,X as s,R as V,r as f,o as p,k as T,a,w as n,s as S,bb as c,d as v,h as g}from"./index-f63952f6.js";import{V as y}from"./VCol-35acb0bd.js";import{e as h,f as C,g as _,h as w,i as b}from"./VisualizationBuilder-2c493416.js";import"./VContainer-9f81b663.js";const A={props:["values","optValues"],setup(d,l){const o=s({show:!0,text:"My Chart",textAlign:"auto",left:"center",textStyle:{}}),e=s(["auto","left","right","center"]),u=s([]);function x(t){o.value[t.name]=t.value,i()}function i(){l.emit("chartTitle",{name:"title",value:o.value})}return V(()=>{for(const t in d.values)o.value[t]=d.values[t];u.value=[0],setTimeout(()=>{u.value=[]},500)}),{title:o,textAligns:e,expandTextStyle:u,externalSettings:x,updated:i}},components:{TextStyle:r}};function E(d,l,o,e,u,x){const i=f("TextStyle");return p(),T("div",null,[a(g,null,{default:n(()=>[a(y,{cols:"12"},{default:n(()=>[a(h,{color:"blue",label:"Show/Hide",modelValue:e.title.show,"onUpdate:modelValue":l[0]||(l[0]=t=>e.title.show=t),onChange:e.updated},null,8,["modelValue","onChange"]),a(S,{modelValue:e.title.text,"onUpdate:modelValue":l[1]||(l[1]=t=>e.title.text=t),label:"Text",onInput:e.updated},null,8,["modelValue","onInput"]),a(c,{items:e.textAligns,modelValue:e.title.textAlign,"onUpdate:modelValue":l[2]||(l[2]=t=>e.title.textAlign=t),label:"Text Alignment",onChange:e.updated},null,8,["items","modelValue","onChange"]),a(C,{multiple:"",focusable:"",modelValue:e.expandTextStyle,"onUpdate:modelValue":l[3]||(l[3]=t=>e.expandTextStyle=t)},{default:n(()=>[a(_,null,{default:n(()=>[a(w,null,{default:n(()=>[v("Text Style")]),_:1}),a(b,null,{default:n(()=>[a(i,{onTextStyle:e.externalSettings,values:e.title.textStyle},null,8,["onTextStyle","values"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})])}const M=m(A,[["render",E]]);export{M as default};
