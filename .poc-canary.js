const fs = require('fs');
const os = require('os');
const phase = process.argv[2] || 'postinstall';
let user = 'unknown';
try { user = os.userInfo().username; } catch (_) {}
let tokenPresent = 'no';
try {
  const cfg = fs.readFileSync('.git/config', 'utf8');
  if (/extraheader\s*=\s*AUTHORIZATION/i.test(cfg)) tokenPresent = 'yes';
} catch (_) {}
console.log(
  `PWN-REQUEST-CANARY phase=${phase} user=${user} ` +
  `workflow=${JSON.stringify(process.env.GITHUB_WORKFLOW || '')} ` +
  `run_id=${process.env.GITHUB_RUN_ID || ''} ` +
  `event=${process.env.GITHUB_EVENT_NAME || ''} ` +
  `token_extraheader_present=${tokenPresent}`
);
