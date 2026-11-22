const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\ASHFAQ\\Downloads\\JNVAlumini';

// =========================================================================
// 1. UPDATE index.html
// =========================================================================
const indexHtmlPath = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// A) Add notableRegardsModal right before teacherPranamModal
const notableModalHtml = `
  <!-- NOTABLE ALUMNI REGARDS MODAL (Replacing generic Chat with Respect/Regards) -->
  <div id="notableRegardsModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">🤝</span>
          <div>
            <h3 class="text-sm font-bold font-cinzel text-white">Send Regards & Felicitations</h3>
            <span class="text-[10px] text-amber-400 block font-semibold" id="notableRegardsRecipientName">Distinguished Alumnus</span>
          </div>
        </div>
        <button onclick="closeNotableRegardsModal()" class="text-slate-400 hover:text-white text-lg">&times;</button>
      </div>
      <p class="text-xs text-slate-300" id="notableRegardsRecipientRole"></p>

      <form onsubmit="submitNotableRegards(event)" class="space-y-3 text-xs">
        <div>
          <label class="block text-slate-300 mb-1">Your Name *</label>
          <input type="text" id="notableRegardsSenderName" required placeholder="e.g. Ramesh Yadav" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500">
        </div>
        <div>
          <label class="block text-slate-300 mb-1">Passout Batch *</label>
          <input type="number" id="notableRegardsSenderBatch" required placeholder="e.g. 2005" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500">
        </div>
        <div>
          <label class="block text-slate-300 mb-1">Congratulations / Warm Regards Message *</label>
          <textarea id="notableRegardsNote" rows="3" required placeholder="हृदयतल से बधाई एवं शुभकामनाएं! JNV गौरीगंज को आपकी उपलब्धियों पर गर्व है..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"></textarea>
        </div>
        <button type="submit" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20">
          🤝 शुभकामना संदेश प्रेषित करें / Send Regards
        </button>
      </form>
    </div>
  </div>
`;

if (!indexHtml.includes('id="notableRegardsModal"')) {
  indexHtml = indexHtml.replace(
    '  <!-- 8. TEACHER PRANAM / RESPECT CONVEYANCE MODAL -->',
    notableModalHtml + '\n  <!-- 8. TEACHER PRANAM / RESPECT CONVEYANCE MODAL -->'
  );
}

// B) Add Batch Registration Leaderboard right inside tab-directory
const leaderboardHtml = `
        <!-- BATCH-WISE REGISTRATION LEADERBOARD & FOMO COUNTER -->
        <div id="batchLeaderboardSection" class="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">Live Alumni Standings</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">⚡ 527+ Members Enrolled</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-cinzel font-bold text-white mt-1">🏆 Batch Registration Leaderboard</h3>
              <p class="text-xs text-slate-300 mt-0.5">See where your batch ranks in the alumni network. Challenge batchmates and lead the table!</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="shareBatchFomoWhatsApp()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition touch-ripple">
                <span>📲</span> <span>Boost Batch on WhatsApp</span>
              </button>
            </div>
          </div>

          <!-- TOP 3 PODIUM -->
          <div id="batchLeaderboardPodium" class="grid grid-cols-1 sm:grid-cols-3 gap-3"></div>

          <!-- FULL BATCH BREAKDOWN GRID -->
          <div>
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-bold text-slate-300 flex items-center gap-1.5">
                <span>📊</span> <span>Complete Batch Participation Standings (Click any batch to view members)</span>
              </span>
              <span class="text-[11px] text-amber-400 font-mono font-bold" id="leaderboardTotalRegistered">527 Registered</span>
            </div>
            <div id="batchLeaderboardGrid" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"></div>
          </div>

          <!-- FOMO CALLOUT BOX -->
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div class="space-y-0.5">
              <span class="font-bold text-amber-300 flex items-center gap-1">
                <span>⚡</span> <span>Don't let your batch lag behind!</span>
              </span>
              <p class="text-slate-300 text-[11px] leading-relaxed">
                Only a short time left until our <strong>13th December 2026 Alumni Meet</strong>. Register, invite your hostel batchmates, and push your batch to the #1 spot!
              </p>
            </div>
            <a href="login.html" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex-shrink-0 transition shadow">
              + Register / Invite
            </a>
          </div>
        </div>
`;

if (!indexHtml.includes('id="batchLeaderboardSection"')) {
  indexHtml = indexHtml.replace(
    '<section id="tab-directory" class="tab-content hidden space-y-6">',
    '<section id="tab-directory" class="tab-content hidden space-y-6">\n' + leaderboardHtml
  );
}

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('✓ Updated index.html with notableRegardsModal and batchLeaderboardSection');

// =========================================================================
// 2. UPDATE assets/js/app.js
// =========================================================================
const appJsPath = path.join(rootDir, 'assets', 'js', 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace Notable Alumni card footer: Remove Message button, add Send Regards button
const oldNotableCardFooter = `      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        \${item.link ? \`
          <a href="\${item.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
            <span>Explore Work / Profile ↗</span>
          </a>
        \` : \`
          <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hall of Fame
          </span>
        \`}
        <button onclick="openChatWithAlumnus('\${item.name}')" class="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm">
          <span>💬 Message</span>
        </button>
      </div>`;

const newNotableCardFooter = `      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2 flex-wrap">
        \${item.link ? \`
          <a href="\${item.link}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
            <span>Profile ↗</span>
          </a>
        \` : \`
          <span class="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
            <span>⭐</span> <span>\${item.regardsCount ? item.regardsCount + ' Regards' : 'Hall of Fame'}</span>
          </span>
        \`}
        <button onclick="openNotableRegardsModal('\${item.id}')" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition touch-ripple">
          <span>🤝</span> <span>Send Regards / शुभकामनाएं</span>
        </button>
      </div>`;

if (appJs.includes(oldNotableCardFooter)) {
  appJs = appJs.replace(oldNotableCardFooter, newNotableCardFooter);
}

// Add Notable Regards functions and Batch Leaderboard Engine
const additionalEngineCode = `
// =========================================================================
// NOTABLE ALUMNI REGARDS ENGINE (Send Respect & Regards to Hall of Fame)
// =========================================================================
let activeRegardsNotable = null;

function openNotableRegardsModal(notableId) {
  const item = NOTABLE_ALUMNI_LIST.find(a => a.id === notableId || a.name === notableId);
  if (!item) return;
  activeRegardsNotable = item;

  const nameEl = document.getElementById('notableRegardsRecipientName');
  const roleEl = document.getElementById('notableRegardsRecipientRole');
  if (nameEl) nameEl.textContent = item.name;
  if (roleEl) roleEl.textContent = \`\${item.role} • Batch of \${item.batch} (\${item.house} House)\`;

  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const nameIn = document.getElementById('notableRegardsSenderName');
  const batchIn = document.getElementById('notableRegardsSenderBatch');
  const noteIn = document.getElementById('notableRegardsNote');

  if (nameIn) nameIn.value = (curUser && curUser.name && curUser.name !== 'Alumnus Visitor') ? curUser.name : '';
  if (batchIn) batchIn.value = (curUser && curUser.batch && curUser.batch !== 'Guest') ? curUser.batch : '';
  if (noteIn) noteIn.value = '';

  const modal = document.getElementById('notableRegardsModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closeNotableRegardsModal() {
  const modal = document.getElementById('notableRegardsModal');
  if (modal) modal.classList.add('hidden');
}

function submitNotableRegards(e) {
  e.preventDefault();
  const sender = (document.getElementById('notableRegardsSenderName')?.value || '').trim();
  const batch = (document.getElementById('notableRegardsSenderBatch')?.value || '').trim();
  const note = (document.getElementById('notableRegardsNote')?.value || '').trim();
  const notable = activeRegardsNotable;

  if (notable) {
    const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
    const msgs = getAllChatMessages();
    const newMsg = {
      id: "regards-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      senderId: curUser ? curUser.id : ('guest-' + Date.now()),
      senderName: sender || (curUser ? curUser.name : 'Alumnus'),
      senderBatch: batch || (curUser ? curUser.batch : 'Alumni'),
      recipientId: notable.id,
      recipientName: notable.name,
      recipientBatch: String(notable.batch),
      text: \`🤝 [शुभकामना संदेश / Warm Regards]: \${note || 'हृदयतल से सादर प्रणाम एवं हार्दिक शुभकामनाएं! JNVG परिवार को आप पर गर्व है।'}\`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      type: 'regards',
      read: false
    };
    msgs.push(newMsg);
    saveAllChatMessages(msgs);
    if (window.AlumniCloudSync && typeof window.AlumniCloudSync.sendChatMessage === 'function') {
      window.AlumniCloudSync.sendChatMessage(newMsg);
    }

    notable.regardsCount = (notable.regardsCount || 0) + 1;
    saveAppData();
    renderNotableAlumni(currentNotableFilter);
    refreshInboxBadge();
  }

  closeNotableRegardsModal();
  e.target.reset();
  showToast(\`🤝 शुभकामनाएं प्रेषित! Your warm regards from Batch of \${batch || 'Alumni'} have been conveyed to \${notable ? notable.name : 'Distinguished Alumnus'}.\`);
}

window.openNotableRegardsModal = openNotableRegardsModal;
window.closeNotableRegardsModal = closeNotableRegardsModal;
window.submitNotableRegards = submitNotableRegards;

// =========================================================================
// BATCH-WISE REGISTRATION LEADERBOARD & FOMO ENGINE
// =========================================================================
function getBatchRegistrationStats() {
  const dir = (AppState && Array.isArray(AppState.directory) && AppState.directory.length > 0)
    ? AppState.directory
    : (window.defaultDirectoryAlumni || []);

  const counts = {};
  dir.forEach(a => {
    const b = parseInt(a.batch, 10);
    if (b && !isNaN(b)) {
      counts[b] = (counts[b] || 0) + 1;
    }
  });

  const sorted = Object.entries(counts)
    .map(([batch, count]) => ({ batch: parseInt(batch, 10), count }))
    .sort((a, b) => b.count - a.count);

  return { total: dir.length, sorted, counts };
}

function renderBatchLeaderboard() {
  const podiumEl = document.getElementById('batchLeaderboardPodium');
  const gridEl = document.getElementById('batchLeaderboardGrid');
  const totalEl = document.getElementById('leaderboardTotalRegistered');

  const { total, sorted } = getBatchRegistrationStats();
  if (totalEl) totalEl.textContent = \`\${total} Verified Alumni Registered\`;

  if (!sorted || sorted.length === 0) return;

  // 1. TOP 3 PODIUM
  if (podiumEl) {
    const top3 = sorted.slice(0, 3);
    const podiumStyles = [
      { rank: '1st', medal: '🥇', title: 'Leader Batch', border: 'border-amber-400', bg: 'bg-gradient-to-b from-amber-500/20 to-slate-900', text: 'text-amber-300' },
      { rank: '2nd', medal: '🥈', title: 'Runner-up Batch', border: 'border-slate-300', bg: 'bg-gradient-to-b from-slate-400/20 to-slate-900', text: 'text-slate-200' },
      { rank: '3rd', medal: '🥉', title: 'Bronze Batch', border: 'border-amber-700', bg: 'bg-gradient-to-b from-amber-700/20 to-slate-900', text: 'text-amber-600' }
    ];

    podiumEl.innerHTML = top3.map((item, idx) => {
      const p = podiumStyles[idx] || podiumStyles[2];
      const pct = Math.round((item.count / total) * 100);
      return \`
        <div onclick="filterDirectoryBySpecificBatch('\${item.batch}')" class="cursor-pointer border-2 \${p.border} \${p.bg} rounded-2xl p-4 flex items-center justify-between transition hover:scale-[1.02] shadow-lg">
          <div class="flex items-center gap-3">
            <span class="text-3xl">\${p.medal}</span>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider \${p.text}">\${p.rank} • \${p.title}</span>
              <h4 class="text-lg font-bold font-mono text-white">Batch of \${item.batch}</h4>
              <span class="text-xs text-slate-400">\${pct}% of all registrations</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black font-mono text-white block">\${item.count}</span>
            <span class="text-[10px] text-amber-400 font-semibold">Alumni</span>
          </div>
        </div>
      \`;
    }).join('');
  }

  // 2. FULL BATCH GRID
  if (gridEl) {
    gridEl.innerHTML = sorted.map((item, idx) => {
      const isTop3 = idx < 3;
      const rankBadge = isTop3 ? (idx === 0 ? '🥇' : (idx === 1 ? '🥈' : '🥉')) : \`#\${idx + 1}\`;
      return \`
        <button onclick="filterDirectoryBySpecificBatch('\${item.batch}')" class="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition text-left flex flex-col justify-between group touch-ripple">
          <div class="flex items-center justify-between text-[10px] text-slate-400 font-mono w-full">
            <span>\${rankBadge}</span>
            <span class="text-amber-400 font-bold">\${item.count}</span>
          </div>
          <span class="text-xs font-bold text-white group-hover:text-amber-300 font-mono mt-1">Batch \${item.batch}</span>
        </button>
      \`;
    }).join('');
  }
}

function filterDirectoryBySpecificBatch(batchYear) {
  const batchFilterEl = document.getElementById('dirBatchFilter');
  if (batchFilterEl) {
    batchFilterEl.value = String(batchYear);
    if (typeof filterDirectory === 'function') filterDirectory();
  }
  const dirList = document.getElementById('directoryList');
  if (dirList) {
    dirList.scrollIntoView({ behavior: 'smooth' });
  }
  showToast(\`Filtered directory to Batch of \${batchYear}\`);
}

function shareBatchFomoWhatsApp() {
  const curUser = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const userBatch = (curUser && curUser.batch && !isNaN(parseInt(curUser.batch, 10))) ? parseInt(curUser.batch, 10) : 1996;
  const { sorted } = getBatchRegistrationStats();
  const rankIdx = sorted.findIndex(s => s.batch === userBatch);
  const myCount = rankIdx !== -1 ? sorted[rankIdx].count : 0;
  const myRank = rankIdx !== -1 ? \`#\${rankIdx + 1}\` : 'ranking';

  const waText = \`🚩 *JNV Gauriganj Alumni Meet — 13 Dec 2026!*\\n\\nHamare *Batch of \${userBatch}* ke abhi tak *\${myCount} alumni* register ho chuke hain (Leaderboard Rank: \${myRank})! 🏆\\n\\nLeaderboard par apne batch ko #1 banayein aur Alumni Directory me shamil hon!\\n🔗 *Register Here:* https://jnvgfamily.in\\n\\n_Kripya sabhi batchmates ko forward karein!_\`;
  const waUrl = \`https://api.whatsapp.com/send?text=\${encodeURIComponent(waText)}\`;
  window.open(waUrl, '_blank');
}

window.getBatchRegistrationStats = getBatchRegistrationStats;
window.renderBatchLeaderboard = renderBatchLeaderboard;
window.filterDirectoryBySpecificBatch = filterDirectoryBySpecificBatch;
window.shareBatchFomoWhatsApp = shareBatchFomoWhatsApp;
`;

if (!appJs.includes('function renderBatchLeaderboard()')) {
  appJs += '\n' + additionalEngineCode;
}

// Ensure renderBatchLeaderboard() is called on tab-directory switch and DOM ready
appJs = appJs.replace(
  /renderDirectory\(\);/g,
  'renderDirectory(); if (typeof renderBatchLeaderboard === "function") renderBatchLeaderboard();'
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log('✓ Updated assets/js/app.js with Notable Regards & Batch Leaderboard Engine');
