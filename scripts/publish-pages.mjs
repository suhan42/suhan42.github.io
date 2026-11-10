// 发布检查脚本：校验当前分支、提交状态和 site/ 产物，确认后把 site/ 子树推送到 gh-pages。
// --check 只执行检查不推送，供人工发布前确认前置条件。

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const CHECK_ONLY = process.argv.includes('--check');
const SUPPORTED_ARGS = new Set(['--check']);
const REQUIRED_PATHS = [
  'site/index.html',
  'site/404.html',
  'site/archive/index.html',
  'site/assets',
  'site/.nojekyll'
];

function fail(message) {
  console.error(`发布检查失败：${message}`);
  process.exit(1);
}

function runGit(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.error) {
    fail(`无法执行 git ${args.join(' ')}：${result.error.message}`);
  }
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || '').trim();
    fail(`git ${args.join(' ')} 执行失败${detail ? `：${detail}` : ''}`);
  }
  return (result.stdout || '').trim();
}

for (const arg of process.argv.slice(2)) {
  if (!SUPPORTED_ARGS.has(arg)) {
    fail(`不支持参数 ${arg}，当前只允许 --check。`);
  }
}

const repoRoot = runGit(['rev-parse', '--show-toplevel']);
const currentDir = resolve(process.cwd()).replace(/\\/g, '/').toLowerCase();
const normalizedRoot = resolve(repoRoot).replace(/\\/g, '/').toLowerCase();
if (currentDir !== normalizedRoot) {
  fail(`请在仓库根目录执行，当前目录是 ${process.cwd()}，仓库根目录是 ${repoRoot}。`);
}

const branch = runGit(['branch', '--show-current']);
if (branch !== 'main') {
  fail(`当前分支是 ${branch || 'detached HEAD'}，发布必须以 main 分支的 site/ 为准。`);
}

const siteStatus = runGit(['status', '--porcelain', '--', 'site']);
if (siteStatus) {
  fail(`site/ 有未提交改动，请先确认并提交后再发布：\n${siteStatus}`);
}

for (const relativePath of REQUIRED_PATHS) {
  if (!existsSync(resolve(repoRoot, relativePath))) {
    fail(`发布产物缺失：${relativePath}`);
  }
}

runGit(['cat-file', '-e', 'HEAD:site/index.html']);
runGit(['cat-file', '-e', 'HEAD:site/.nojekyll']);
const originUrl = runGit(['remote', 'get-url', 'origin']);
if (!originUrl) {
  fail('未配置 origin 远端。');
}

console.log('发布检查通过：当前分支 main，site/ 已提交，index.html 与 .nojekyll 位于发布根目录。');
console.log(`远端：${originUrl}`);
if (CHECK_ONLY) {
  console.log('--check 模式结束：未推送 gh-pages。');
  process.exit(0);
}

console.log('开始推送 site/ 子树到 gh-pages...');
const pushResult = spawnSync('git', ['subtree', 'push', '--prefix=site', 'origin', 'gh-pages'], { stdio: 'inherit' });
if (pushResult.error) {
  fail(`无法执行 git subtree push：${pushResult.error.message}`);
}
if (pushResult.status !== 0) {
  process.exit(pushResult.status || 1);
}

console.log('gh-pages 已更新；请确认 GitHub Pages 构建结果和线上页面。');
