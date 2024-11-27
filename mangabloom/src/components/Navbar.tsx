import CommandCustomFiltering from "@/components/command-custom-filtering";
export default function Navbar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2 relative">
        <img src="/manga-bloom.webp" alt="manga bloom logo" className="w-[300px]"/>
          {/* search results goes here */}
          <CommandCustomFiltering className="rounded-lg border shadow-md"/>
        </div>
    )
}