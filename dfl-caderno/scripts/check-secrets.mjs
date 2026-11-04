import { execSync } from 'node:child_process';

function stagedDiff() {
  try {
    return execSync('git diff --cached -U0', { encoding: 'utf8' });
  } catch {
    return '';
  }
}

const diff = stagedDiff();
if (!diff.trim()) {
  process.exit(0);
}

const blocked = [];
if (/(^|\n)diff --git a\/\.env b\/\.env/.test(diff) || diff.includes('a/.env ')) {
  blocked.push('.env está no stage');
}
if (diff.includes('service_role')) {
  blocked.push('service_role apareceu no stage');
}

if (blocked.length > 0) {
  for (const message of blocked) {
    console.error(`Bloqueado: ${message}`);
  }
  process.exit(1);
}
