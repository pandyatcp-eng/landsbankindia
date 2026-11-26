"use client";

import { useMemo, useState } from "react";

type Land = { id:number; title:string; place:string; type:string; area:string; price:number; unit:string; tag:string };
const demoLands:Land[] = [
 {id:1,title:"Agricultural land near village road",place:"Waghodia, Vadodara, Gujarat",type:"Agricultural Land",area:"5 acres",price:8500000,unit:"total",tag:"Road access"},
 {id:2,title:"Industrial plot in growth corridor",place:"Savli GIDC, Vadodara, Gujarat",type:"Industrial Land",area:"20,000 sq ft",price:12500000,unit:"total",tag:"Industrial zone"},
 {id:3,title:"Residential NA plot",place:"Dabhoi Road, Vadodara, Gujarat",type:"Residential Land",area:"2,400 sq ft",price:2400000,unit:"total",tag:"Residential"},
 {id:4,title:"Large agricultural parcel",place:"Anand, Gujarat",type:"Agricultural Land",area:"12 acres",price:18000000,unit:"total",tag:"Large parcel"},
];

const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);

export default function SearchPage(){
 const [q,setQ]=useState("");
 const [type,setType]=useState("All land types");
 const [maxBudget,setMaxBudget]=useState("");
 const [sort,setSort]=useState("recommended");
 const results=useMemo(()=>{
  const filtered=demoLands.filter(x=>(type==="All land types"||x.type===type)&&(!maxBudget||x.price<=Number(maxBudget))&&(!q||`${x.title} ${x.place} ${x.type}`.toLowerCase().includes(q.toLowerCase())));
  if(sort==="price-low") filtered.sort((a,b)=>a.price-b.price);
  if(sort==="price-high") filtered.sort((a,b)=>b.price-a.price);
  return filtered;
 },[q,type,maxBudget,sort]);
 return <main className="min-h-screen">
  <header className="border-b border-[#e7ebe5] bg-white"><div className="container flex h-[76px] items-center justify-between"><a href="/" className="font-display text-xl font-extrabold">landsbank<span className="text-[#176b4a]">india</span></a><a href="/" className="text-sm font-semibold text-[#176b4a]">← Back to home</a></div></header>
  <section className="container py-10 md:py-14">
   <div className="eyebrow">LAND DISCOVERY</div><h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Explore land opportunities</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#69766f]">Filter land opportunities by location, category and budget. Connectors for verified live listings and map search will be added in the next development phase.</p>
   <div className="soft-card mt-8 grid gap-3 p-4 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:p-5">
    <label className="rounded-xl border border-[#e7ebe5] px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#7b887f]">Search location or keyword</span><input value={q} onChange={e=>setQ(e.target.value)} className="search-field" placeholder="e.g. Vadodara, Savli"/></label>
    <label className="rounded-xl border border-[#e7ebe5] px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#7b887f]">Land category</span><select value={type} onChange={e=>setType(e.target.value)} className="search-field"><option>All land types</option><option>Agricultural Land</option><option>Industrial Land</option><option>Residential Land</option><option>Commercial Land</option></select></label>
    <label className="rounded-xl border border-[#e7ebe5] px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#7b887f]">Maximum budget (₹)</span><input type="number" min="0" value={maxBudget} onChange={e=>setMaxBudget(e.target.value)} className="search-field" placeholder="No limit"/></label>
    <label className="rounded-xl border border-[#e7ebe5] px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-wider text-[#7b887f]">Sort by</span><select value={sort} onChange={e=>setSort(e.target.value)} className="search-field"><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
   </div>
   <div className="mt-7 flex items-center justify-between"><p className="text-sm font-semibold">{results.length} sample {results.length===1?"listing":"listings"}</p><span className="rounded-full bg-[#fff4db] px-3 py-1 text-xs font-bold text-[#8a5a00]">Demo data · Not live listings</span></div>
   <div className="mt-4 grid gap-4 md:grid-cols-2">
    {results.map(x=><article key={x.id} className="soft-card overflow-hidden"><div className="flex h-32 items-center justify-center bg-[#eaf1e8]"><span className="text-4xl text-[#176b4a]">⌖</span></div><div className="p-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-[#edf5ef] px-3 py-1 text-xs font-bold text-[#176b4a]">{x.type}</span><span className="text-xs text-[#7b887f]">{x.tag}</span></div><h2 className="font-display mt-3 text-lg font-extrabold">{x.title}</h2><p className="mt-1 text-sm text-[#69766f]">⌖ {x.place}</p><div className="mt-5 flex items-end justify-between border-t border-[#e7ebe5] pt-4"><div><p className="text-xs text-[#7b887f]">Indicative demo price</p><p className="font-display text-xl font-extrabold">{money(x.price)}</p></div><div className="text-right"><p className="text-xs text-[#7b887f]">Area</p><p className="text-sm font-bold">{x.area}</p></div></div></div></article>)}
   </div>
   {results.length===0&&<div className="soft-card mt-4 p-10 text-center"><h2 className="font-display text-xl font-bold">No matching demo listings</h2><p className="mt-2 text-sm text-[#69766f]">Try a different location, category or budget.</p></div>}
   <p className="mt-8 rounded-xl bg-[#f0f4ee] p-4 text-xs leading-5 text-[#647168]">Important: These are illustrative sample records created for interface testing, not actual properties or offers. Prices, land status, ownership, title and permissions must be independently verified. No legal or investment assurance is provided.</p>
  </section>
 </main>;
}
