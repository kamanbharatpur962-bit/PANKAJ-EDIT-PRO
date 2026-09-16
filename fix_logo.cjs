const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreen.tsx', 'utf8');

const target1 = `      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-10">
        <button className="flex items-center justify-center p-1 rounded-full hover:bg-black/5 transition-colors">
          <User className="w-[26px] h-[26px] text-[#111111]" strokeWidth={2.2} />
        </button>
        <div className="flex items-center gap-5">`;

const replace1 = `      <header className="px-5 pt-6 pb-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* Custom Logo Container */}
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-lg border border-black/10">
            <img src="/logo.png" alt="Pankaj Editz Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.nextElementSibling?.classList.remove('hidden') }} />
            {/* Fallback icon if logo.png is not uploaded yet */}
            <User className="w-6 h-6 text-white hidden" strokeWidth={2} />
          </div>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight text-xl ml-1">
            Pankaj Editz
          </span>
        </div>
        <div className="flex items-center gap-4">`;

if (content.includes(target1)) {
    content = content.replace(target1, replace1);
    fs.writeFileSync('src/components/HomeScreen.tsx', content);
    console.log("Success");
} else {
    console.log("Target not found!");
}
