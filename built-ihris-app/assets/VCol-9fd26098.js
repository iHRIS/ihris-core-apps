import{b3 as f,O as S,Q as N,b as k,j as y}from"./index-e36d139d.js";const a=["sm","md","lg","xl","xxl"],i=(()=>a.reduce((e,t)=>(e[t]={type:[Boolean,String,Number],default:!1},e),{}))(),d=(()=>a.reduce((e,t)=>(e["offset"+f(t)]={type:[String,Number],default:null},e),{}))(),m=(()=>a.reduce((e,t)=>(e["order"+f(t)]={type:[String,Number],default:null},e),{}))(),c={col:Object.keys(i),offset:Object.keys(d),order:Object.keys(m)};function C(e,t,r){let n=e;if(!(r==null||r===!1)){if(t){const l=t.replace(e,"");n+=`-${l}`}return e==="col"&&(n="v-"+n),e==="col"&&(r===""||r===!0)||(n+=`-${r}`),n.toLowerCase()}}const h=["auto","start","end","center","baseline","stretch"],$=S()({name:"VCol",props:{cols:{type:[Boolean,String,Number],default:!1},...i,offset:{type:[String,Number],default:null},...d,order:{type:[String,Number],default:null},...m,alignSelf:{type:String,default:null,validator:e=>h.includes(e)},...N()},setup(e,t){let{slots:r}=t;const n=k(()=>{const l=[];let o;for(o in c)c[o].forEach(s=>{const g=e[s],u=C(o,s,g);u&&l.push(u)});const b=l.some(s=>s.startsWith("v-col-"));return l.push({"v-col":!b||!e.cols,[`v-col-${e.cols}`]:e.cols,[`offset-${e.offset}`]:e.offset,[`order-${e.order}`]:e.order,[`align-self-${e.alignSelf}`]:e.alignSelf}),l});return()=>{var l;return y(e.tag,{class:n.value},(l=r.default)==null?void 0:l.call(r))}}});export{$ as V};
