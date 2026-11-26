"use client";
export default function LandMap({ query }: { query: string }) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(query || "India")}&output=embed`;
  return <div className="overflow-hidden rounded-2xl border border-[#e7ebe5] bg-white"><iframe title="Land location map" src={mapUrl} className="h-[320px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><p className="px-4 py-2 text-xs text-[#69766f]">Map preview by Google Maps. Pin accuracy and land boundaries must be independently checked.</p></div>;
}
