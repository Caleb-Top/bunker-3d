"use client";
import { useEffect, useRef } from "react";
export default function Home() {
  const frame=useRef<HTMLIFrameElement>(null);
  useEffect(()=>{const onMessage=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=="bunker-viewer-height")return;const height=Number(event.data.height);if(Number.isFinite(height)&&frame.current)frame.current.style.height=Math.min(4000,Math.max(650,height))+"px";};window.addEventListener("message",onMessage);return()=>window.removeEventListener("message",onMessage);},[]);
  return <main><header><div><span className="eyebrow">MOUNTAIN / HABITAT 01</span><h1>深山与海岛备用堡垒</h1><p>海岛建筑与周界 · 岛底五层剖面 · 1000 km 地下连接示意</p></div><a href="/og.png" target="_blank" rel="noreferrer">查看总剖面图 ↗</a><a href="/bunker-offline.zip" download>下载离线版 ↗</a></header><iframe ref={frame} src="/model.html" title="五层堡垒交互三维模型" allow="fullscreen" /><footer>轻量游戏模拟 · 防护造型未定级 · 物品替换保存在本浏览器 · 非施工模型</footer></main>;
}
