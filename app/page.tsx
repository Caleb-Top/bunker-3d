"use client";
import { useEffect, useRef } from "react";
export default function Home() {
  const frame=useRef<HTMLIFrameElement>(null);
  useEffect(()=>{const onMessage=(event:MessageEvent)=>{if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=="bunker-viewer-height")return;const height=Number(event.data.height);if(Number.isFinite(height)&&frame.current)frame.current.style.height=Math.min(4000,Math.max(650,height))+"px";};window.addEventListener("message",onMessage);return()=>window.removeEventListener("message",onMessage);},[]);
  return <main><header><div><span className="eyebrow">MOUNTAIN / HABITAT 01</span><h1>深山独居堡垒</h1><p>九车位车辆库 · 共墙生活区 · 加深仓储 · 第一人称探索</p></div><a href="/og.png" target="_blank" rel="noreferrer">查看总剖面图 ↗</a><a href="/bunker-offline.zip" download>下载离线版 ↗</a></header><iframe ref={frame} src="/model.html" title="五层堡垒交互三维模型" allow="fullscreen" /><footer>车库与无人机间设独立厚重隔断门（未定级） · 物品替换保存在本浏览器 · 非施工模型</footer></main>;
}
