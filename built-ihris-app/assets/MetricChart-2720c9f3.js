import{_ as v,X as d,N as U,R as _,o as u,c as p,w as o,a as e,d as m,h as b,s as V,bb as c,q as h}from"./index-f63952f6.js";import{f as x,g as k,h as S,i as W,e as r,d as A}from"./VisualizationBuilder-2c493416.js";import{V as a}from"./VCol-35acb0bd.js";import{V as z}from"./VContainer-9f81b663.js";const D={props:{option:Object},setup(f,t){const g=d(["normal","bold","bolder","lighter"]),l=d(!1),y=d({graphic:{elements:[{type:"text",left:"center",style:{text:"",fontSize:40,fontWeight:"bold",lineDash:[0,200],lineDashOffset:0,fill:"transparent",stroke:"#000",lineWidth:1},keyframeAnimation:{duration:3e3,loop:!1,keyframes:[{percent:.7,style:{fill:"transparent",lineDashOffset:200,lineDash:[200,0]}},{percent:.8,style:{fill:"transparent"}},{percent:1,style:{fill:"black"}}]}},{type:"text",left:"center",style:{text:`

 Total Staffs`,fontSize:30,fontWeight:"bold",lineDash:[0,200],lineDashOffset:0,fill:"transparent",stroke:"#000",lineWidth:1},keyframeAnimation:{duration:3e3,loop:!1,keyframes:[{percent:.7,style:{fill:"transparent",lineDashOffset:200,lineDash:[200,0]}},{percent:.8,style:{fill:"transparent"}},{percent:1,style:{fill:"black"}}]}}]}});let i=U({get(){return f.option},set(s){t.emit("update:option",s)}});_(()=>{f.option.graphic||(i.value=y.value)});function n(s){l.value?i.value.graphic.elements[s].keyframeAnimation.duration=3e3:i.value.graphic.elements[s].keyframeAnimation.duration=1}return{fontWeight:g,animation:l,options:i,animate:n}}};function T(f,t,g,l,y,i){return u(),p(z,{"grid-list-xs":""},{default:o(()=>[e(x,{multiple:"",focusable:""},{default:o(()=>[e(k,null,{default:o(()=>[e(S,null,{default:o(()=>[m("Metric Value")]),_:1}),e(W,null,{default:o(()=>[e(b,null,{default:o(()=>[e(a,{cols:"12"},{default:o(()=>[e(V,{modelValue:l.options.graphic.elements[0].style.fontSize,"onUpdate:modelValue":t[0]||(t[0]=n=>l.options.graphic.elements[0].style.fontSize=n),type:"number",label:"Font Size",min:"5",max:"100"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(c,{items:l.fontWeight,modelValue:l.options.graphic.elements[0].style.fontWeight,"onUpdate:modelValue":t[1]||(t[1]=n=>l.options.graphic.elements[0].style.fontWeight=n),label:"Font Weight"},null,8,["items","modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(r,{color:"blue",label:"Enable Animation",modelValue:l.animation,"onUpdate:modelValue":t[2]||(t[2]=n=>l.animation=n),onChange:t[3]||(t[3]=n=>l.animate(0))},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[l.animation?(u(),p(r,{key:0,color:"blue",label:"Loop Animation",modelValue:l.options.graphic.elements[0].keyframeAnimation.loop,"onUpdate:modelValue":t[4]||(t[4]=n=>l.options.graphic.elements[0].keyframeAnimation.loop=n)},null,8,["modelValue"])):h("",!0)]),_:1})]),_:1})]),_:1})]),_:1}),e(A,{activator:"parent",location:"bottom"},{default:o(()=>[m("Settings about metric value")]),_:1})]),_:1}),e(x,{multiple:"",focusable:""},{default:o(()=>[e(k,null,{default:o(()=>[e(S,null,{default:o(()=>[m("Metric Title")]),_:1}),e(W,null,{default:o(()=>[e(b,null,{default:o(()=>[e(a,{cols:"12"},{default:o(()=>[e(V,{modelValue:l.options.graphic.elements[1].style.text,"onUpdate:modelValue":t[5]||(t[5]=n=>l.options.graphic.elements[1].style.text=n),label:"Title"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(V,{modelValue:l.options.graphic.elements[1].style.fontSize,"onUpdate:modelValue":t[6]||(t[6]=n=>l.options.graphic.elements[1].style.fontSize=n),type:"number",label:"Font Size",min:"5",max:"100"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(c,{items:l.fontWeight,modelValue:l.options.graphic.elements[1].style.fontWeight,"onUpdate:modelValue":t[7]||(t[7]=n=>l.options.graphic.elements[1].style.fontWeight=n),label:"Font Weight"},null,8,["items","modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[e(r,{color:"blue",label:"Enable Animation",modelValue:l.animation,"onUpdate:modelValue":t[8]||(t[8]=n=>l.animation=n),onChange:t[9]||(t[9]=n=>l.animate(1))},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:o(()=>[l.animation?(u(),p(r,{key:0,color:"blue",label:"Loop Animation",modelValue:l.options.graphic.elements[1].keyframeAnimation.loop,"onUpdate:modelValue":t[10]||(t[10]=n=>l.options.graphic.elements[1].keyframeAnimation.loop=n)},null,8,["modelValue"])):h("",!0)]),_:1})]),_:1})]),_:1})]),_:1}),e(A,{activator:"parent",location:"bottom"},{default:o(()=>[m("Settings about metric title")]),_:1})]),_:1})]),_:1})}const w=v(D,[["render",T]]);export{w as default};
