const fs = require('fs');

['index.html', 'mobile_app/index.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('href="privacy.html"')) {
    console.log(filePath, 'already has privacy link');
    return;
  }
  const target = `<button type="button" onclick="openModal('suggestionIssueModal')"`;
  if (content.includes(target)) {
    const replacement = `<a href="privacy.html" class="text-slate-400 hover:text-amber-300 font-semibold hover:underline transition">Privacy Policy</a>\n          <span>•</span>\n          ` + target;
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  } else {
    console.log('Target not found in', filePath);
  }
});
