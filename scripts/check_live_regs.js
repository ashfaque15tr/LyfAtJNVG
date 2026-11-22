const https = require('https');

https.get('https://ntfy.sh/jnvg_reg_v1/json?poll=1', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const lines = data.trim().split('\n').filter(Boolean);
    console.log('Total messages fetched:', lines.length);
    lines.forEach((l, i) => {
      try {
        const m = JSON.parse(l);
        const ist = new Date(m.time * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
        console.log(`[#${i + 1}] ${ist} | Title: "${m.title || ''}" | Msg: "${m.message || ''}"`);
      } catch (e) {}
    });
  });
}).on('error', err => {
  console.error('Error fetching ntfy.sh:', err);
});
