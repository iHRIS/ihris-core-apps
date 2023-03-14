import{T as i}from"./TextStyle-dc5612d2.js";import{_ as m,af as p,l as r,C as g,q as n,p as d,b6 as s,aA as V,x,B as f}from"./index-e36d139d.js";import{V as y}from"./VCol-9fd26098.js";import{V as h}from"./VSwitch-196dfbc0.js";import{e as S,f as T,g as C,h as b}from"./VisualizationBuilder-d66444cb.js";import"./VContainer-e49a59e2.js";const v={props:["values"],data(){return{legend:{show:!0,type:"scroll",orient:"horizontal",align:"auto",top:"bottom",itemGap:10,selectedMode:!0,textStyle:{}},types:["plain","scroll"],aligns:["auto","left","right"],top:["bottom","middle","top"],selections:[!0,!1,"single","multiple"],orientation:["vertical","horizontal"],expandTextStyle:[]}},methods:{externalSettings(a){this.legend[a.name]=a.value,this.updated()},updated(){this.$emit("chartLegend",{name:"legend",value:this.legend})}},created(){for(const a in this.values)this.legend[a]=this.values[a];this.expandTextStyle=[0],setTimeout(()=>{this.expandTextStyle=[]},500)},components:{TextStyle:i}};function U(a,l,w,E,e,o){const u=p("TextStyle");return r(),g("div",null,[n(f,null,{default:d(()=>[n(y,{cols:"12"},{default:d(()=>[n(h,{color:"blue",label:"Show/Hide",modelValue:e.legend.show,"onUpdate:modelValue":l[0]||(l[0]=t=>e.legend.show=t),onChange:o.updated},null,8,["modelValue","onChange"]),n(s,{items:e.types,modelValue:e.legend.type,"onUpdate:modelValue":l[1]||(l[1]=t=>e.legend.type=t),label:"Type",onChange:o.updated},null,8,["items","modelValue","onChange"]),n(s,{items:e.orientation,modelValue:e.legend.orient,"onUpdate:modelValue":l[2]||(l[2]=t=>e.legend.orient=t),label:"Orientation",onChange:o.updated},null,8,["items","modelValue","onChange"]),n(s,{items:e.aligns,modelValue:e.legend.align,"onUpdate:modelValue":l[3]||(l[3]=t=>e.legend.align=t),label:"Align",onChange:o.updated},null,8,["items","modelValue","onChange"]),n(s,{items:e.top,modelValue:e.legend.top,"onUpdate:modelValue":l[4]||(l[4]=t=>e.legend.top=t),label:"Position",onChange:o.updated},null,8,["items","modelValue","onChange"]),n(V,{modelValue:e.legend.itemGap,"onUpdate:modelValue":l[5]||(l[5]=t=>e.legend.itemGap=t),type:"number",label:"Items Gap",min:"5",max:"100",onInput:o.updated},null,8,["modelValue","onInput"]),n(s,{items:e.selections,modelValue:e.legend.selectedMode,"onUpdate:modelValue":l[6]||(l[6]=t=>e.legend.selectedMode=t),label:"Selection Mode",onChange:o.updated},null,8,["items","modelValue","onChange"]),n(S,{multiple:"",focusable:"",modelValue:e.expandTextStyle,"onUpdate:modelValue":l[7]||(l[7]=t=>e.expandTextStyle=t)},{default:d(()=>[n(T,null,{default:d(()=>[n(C,null,{default:d(()=>[x("Text Style")]),_:1}),n(b,null,{default:d(()=>[n(u,{onTextStyle:o.externalSettings,values:e.legend.textStyle},null,8,["onTextStyle","values"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})])}const k=m(v,[["render",U]]);export{k as default};
