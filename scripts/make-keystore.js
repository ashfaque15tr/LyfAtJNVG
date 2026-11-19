const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const openssl = 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe';
const keystorePath = path.join(__dirname, '..', 'android', 'app', 'release.keystore');

console.log('Generating private key and certificate...');
execSync(`"${openssl}" req -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 10000 -out cert.pem -subj "/CN=JNV Alumni/OU=Mobile/O=JNVGFamily/C=IN"`);

console.log('Exporting PKCS12 keystore to ' + keystorePath + '...');
execSync(`"${openssl}" pkcs12 -export -in cert.pem -inkey key.pem -out "${keystorePath}" -name jnvalumni -passout pass:JnvAlumni2026!`);

if (fs.existsSync('key.pem')) fs.unlinkSync('key.pem');
if (fs.existsSync('cert.pem')) fs.unlinkSync('cert.pem');

const stats = fs.statSync(keystorePath);
console.log('Created release.keystore successfully! Size: ' + stats.size + ' bytes');
