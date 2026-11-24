const fs = require('fs');
const path = require('path');

const mobPath = path.resolve(__dirname, '..', 'mobile_app', 'index.html');
let content = fs.readFileSync(mobPath, 'utf8');

// Replace 4 houses strip using regex
const housesRegex = /<!-- 4 Houses Color Strip \(Official NVS Mapping\) -->\s*<div class="flex items-center gap-2[\s\S]*?<!-- NAVIGATION TABS -->/;

const newHousesBlock = `<!-- 4 Houses Color Strip (Official NVS Mapping) -->
          <div class="grid grid-cols-4 gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-800 p-1.5 sm:p-2.5 rounded-xl shadow-inner w-full md:w-auto max-w-full">
            <div class="text-center px-1.5 sm:px-2.5 py-1 bg-red-950/80 border border-red-500/60 rounded-lg min-w-0">
              <span class="block text-[11px] sm:text-xs font-bold text-red-400 truncate">Aravali</span>
              <span class="text-[8px] sm:text-[9px] text-red-300 truncate block">Ashok</span>
            </div>
            <div class="text-center px-1.5 sm:px-2.5 py-1 bg-blue-950/80 border border-blue-500/60 rounded-lg min-w-0">
              <span class="block text-[11px] sm:text-xs font-bold text-blue-400 truncate">Shivalik</span>
              <span class="text-[8px] sm:text-[9px] text-blue-300 truncate block">Raman & Shivaji</span>
            </div>
            <div class="text-center px-1.5 sm:px-2.5 py-1 bg-yellow-950/80 border border-yellow-500/60 rounded-lg min-w-0">
              <span class="block text-[11px] sm:text-xs font-bold text-yellow-400 truncate">Udaigiri</span>
              <span class="text-[8px] sm:text-[9px] text-yellow-300 truncate block">Subhash</span>
            </div>
            <div class="text-center px-1.5 sm:px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-lg min-w-0">
              <span class="block text-[11px] sm:text-xs font-bold text-emerald-400 truncate">Nilgiri</span>
              <span class="text-[8px] sm:text-[9px] text-emerald-300 truncate block">Tagore</span>
            </div>
          </div>
        </div>
      </div>

      <!-- NAVIGATION TABS -->`;

content = content.replace(housesRegex, newHousesBlock);

fs.writeFileSync(mobPath, content, 'utf8');
console.log('✅ Updated 4 houses strip in mobile_app/index.html');
