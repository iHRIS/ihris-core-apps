import{_ as r,l as p,C as m,q as o,p as n,I as y,x as V,H as f,A as S,aA as d,b6 as a,B as C}from"./index-e36d139d.js";import{V as c}from"./TextStyle-dc5612d2.js";import{V as s}from"./VCol-9fd26098.js";const x={props:["subscriber","values"],data(){return{displayColor:!1,lineStyle:{color:"#333",width:1,type:"solid",cap:"butt",opacity:1},axisLineTypes:["solid","dashed","dotted"],caps:["butt","round","square"]}},watch:{"lineStyle.color":function(i,e){i!==e&&this.updated()}},methods:{updated(){this.$emit(this.subscriber,{name:"lineStyle",value:this.lineStyle})}},created(){for(const i in this.values)Object.keys(this.lineStyle).indexOf(i)!==-1&&(this.lineStyle[i]=this.values[i])}};function b(i,e,h,w,l,u){return p(),m("div",null,[o(y,{modelValue:l.displayColor,"onUpdate:modelValue":e[1]||(e[1]=t=>l.displayColor=t),width:"313px"},{default:n(()=>[o(c,{class:"ma-2","canvas-height":"300",modelValue:l.lineStyle.color,"onUpdate:modelValue":e[0]||(e[0]=t=>l.lineStyle.color=t)},null,8,["modelValue"])]),_:1},8,["modelValue"]),o(C,null,{default:n(()=>[o(s,{cols:"6"},{default:n(()=>[V(" Color: ")]),_:1}),o(s,{cols:"6"},{default:n(()=>[o(f,{color:l.lineStyle.color,width:"30px",height:"20",onClick:e[3]||(e[3]=t=>l.displayColor=!0)},{default:n(()=>[o(S,{onClick:e[2]||(e[2]=t=>l.displayColor=!0)})]),_:1},8,["color"])]),_:1}),o(s,{cols:"12"},{default:n(()=>[o(d,{modelValue:l.lineStyle.width,"onUpdate:modelValue":e[4]||(e[4]=t=>l.lineStyle.width=t),type:"number",label:"Line width",min:"0",max:"400",onInput:u.updated},null,8,["modelValue","onInput"])]),_:1}),o(s,{cols:"12"},{default:n(()=>[o(a,{items:l.axisLineTypes,modelValue:l.lineStyle.type,"onUpdate:modelValue":e[5]||(e[5]=t=>l.lineStyle.type=t),label:"Line type",onChange:u.updated},null,8,["items","modelValue","onChange"])]),_:1}),o(s,{cols:"12"},{default:n(()=>[o(a,{items:l.caps,modelValue:l.lineStyle.cap,"onUpdate:modelValue":e[6]||(e[6]=t=>l.lineStyle.cap=t),label:"How to draw the end points of the line",onChange:u.updated},null,8,["items","modelValue","onChange"])]),_:1}),o(s,{cols:"12"},{default:n(()=>[o(d,{modelValue:l.lineStyle.opacity,"onUpdate:modelValue":e[7]||(e[7]=t=>l.lineStyle.opacity=t),type:"number",label:"Line Opacity",min:"0.0",max:"1",onInput:u.updated},null,8,["modelValue","onInput"])]),_:1})]),_:1})])}const k=r(x,[["render",b]]);export{k as L};
