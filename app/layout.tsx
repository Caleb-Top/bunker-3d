import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
export async function generateMetadata():Promise<Metadata>{
  const h=await headers(),host=h.get("host")||"mountain-bunker-3d.yweric92.chatgpt.site";
  const origin=(host.startsWith("localhost")?"http://":"https://")+host;
  return {title:"深山独居堡垒 · 交互三维模型",description:"自由旋转、分层查看五层地下空间，探索车库、无人机、生活、农业、仓储与水电。",openGraph:{title:"深山独居堡垒",description:"五层交互模型 · 自由旋转与分层探索",images:[origin+"/og.png"]},twitter:{card:"summary_large_image",images:[origin+"/og.png"]}};
}
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="zh-CN"><body>{children}</body></html>;}
