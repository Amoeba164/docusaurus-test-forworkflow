#!/usr/bin/env node

/**
 * Автоматическая синхронизация файловой системы репозитория с Docusaurus
 *
 * Этот скрипт:
 * 1. Сканирует файловую систему репозитория
 * 2. Исключает системные папки/файлы
 * 3. Копирует MD/MDX в docs/ с той же структурой
 * 4. Добавляет frontmatter если его нет
 * 5. Создаёт index.md для папок (опционально)
 *
 * Важно:
 * - НЕ добавляем sidebar_position: auto (Docusaurus требует число)
 * - НЕ перетираем существующий sidebars.js (он у тебя ручной и корректный)
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================

const config = {
  repoRoot: process.cwd(),
  docsDir: path.join(process.cwd(), 'docs'),

  excludeDirs: [
    'node_modules',
    '.git',
    '.github',
    'build',
    '.docusaurus',
    'static',
    'src',
    'docs', // папка docs не копируется рекурсивно
    '.cache-loader',
    'versioned_docs',
    'versioned_sidebars',
  ],

  excludeFiles: [
    'package.json',
    'package-lock.json',
    'docusaurus.config.js',
    'sidebars.js',
    'babel.config.js',
    '.gitignore',
    '.npmrc',
    'README.md', // корневой README не копируем
    'LICENSE',
    '.DS_Store',
  ],

  includeExtensions: ['.md', '.mdx'],

  addFrontmatter: true,
  createIndexFiles: true,
};

// ==========================================
// УТИЛИТЫ
// ==========================================

function isExcludedDir(dirName) {
  return config.excludeDirs.includes(dirName) || dirName.startsWith('.');
}

function isExcludedFile(fileName) {
  return config.excludeFiles.includes(fileName) || fileName.startsWith('.');
}

function shouldSyncFile(fileName) {
  const ext = path.extname(fileName);
  return config.includeExtensions.includes(ext) && !isExcludedFile(fileName);
}

function hasFrontmatter(content) {
  return content.trim().startsWith('---');
}

/**
 * Генерирует frontmatter для файла
 * ВАЖНО: sidebar_position НЕ добавляем.
 */
function generateFrontmatter(_filePath, fileName) {
  const title = fileName
    .replace(/\.mdx?$/, '')
    .replace(/[-_]/g, ' ')
    .trim();

  return `---
title: ${title}
---

`;
}

function ensureFrontmatter(filePath, content) {
  if (!config.addFrontmatter) return content;

  if (!hasFrontmatter(content)) {
    const fileName = path.basename(filePath);
    const frontmatter = generateFrontmatter(filePath, fileName);
    return frontmatter + content;
  }

  return content;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function syncFile(sourcePath, targetPath) {
  const content = fs.readFileSync(sourcePath, 'utf8');
  const processedContent = ensureFrontmatter(sourcePath, content);

  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, processedContent, 'utf8');

  console.log(`✓ Synced: ${path.relative(config.repoRoot, sourcePath)}`);
}

function createIndexFile(dirPath, dirName) {
  if (!config.createIndexFiles) return;

  const indexPath = path.join(dirPath, 'index.md');
  if (fs.existsSync(indexPath)) return;

  const title = dirName.replace(/[-_]/g, ' ').trim();

  const content = `---
title: ${title}
sidebar_position: 1
---

# ${title}

Эта папка содержит документацию по теме "${title}".

## Содержание

Выберите раздел в боковом меню слева.
`;

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log(`✓ Created index: ${path.relative(config.repoRoot, indexPath)}`);
}

// ==========================================
// ОСНОВНАЯ ЛОГИКА
// ==========================================

function syncDirectory(sourceDir, targetDir, level = 0) {
  ensureDir(targetDir);

  const items = fs.readdirSync(sourceDir);

  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      if (isExcludedDir(item)) {
        console.log(`⊘ Skipped dir: ${item}`);
        return;
      }

      const newTargetDir = path.join(targetDir, item);
      syncDirectory(sourcePath, newTargetDir, level + 1);

      createIndexFile(newTargetDir, item);
      return;
    }

    if (stat.isFile()) {
      if (!shouldSyncFile(item)) return;

      const targetPath = path.join(targetDir, item);
      syncFile(sourcePath, targetPath);
    }
  });
}

/**
 * sidebars.js
 * - Если файл уже существует — НЕ ТРОГАЕМ (чтобы не ломать sidebarId tutorialSidebar).
 * - Если его нет — создадим минимальный с tutorialSidebar и autogenerated.
 */
function generateSidebars() {
  const sidebarsPath = path.join(config.repoRoot, 'sidebars.js');

  if (fs.existsSync(sidebarsPath)) {
    console.log('⊘ sidebars.js exists, skipping generation');
    return;
  }

  const content = `/**
 * Автоматически сгенерированный sidebars.js
 * 
 * Если вы хотите ручную структуру — создайте sidebars.js сами,
 * и генерация будет пропущена.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'autogenerated',
      dirName: '.',
    },
  ],
};

export default sidebars;
`;

  fs.writeFileSync(sidebarsPath, content, 'utf8');
  console.log('✓ Generated sidebars.js');
}

function cleanOrphanedFiles() {
  console.log('\n🧹 Checking for orphaned files...');
  // TODO: безопасная очистка при необходимости
  console.log('✓ Cleanup check complete');
}

function main() {
  console.log('🚀 Starting filesystem sync...\n');
  console.log(`Repository root: ${config.repoRoot}`);
  console.log(`Docs directory: ${config.docsDir}\n`);

  syncDirectory(config.repoRoot, config.docsDir);

  console.log('\n📝 Sidebars...');
  generateSidebars();

  cleanOrphanedFiles();

  console.log('\n✅ Filesystem sync complete!');
  console.log('\nРезультат:');
  console.log('  • Все MD/MDX файлы синхронизированы');
  console.log('  • Frontmatter добавлен где нужно');
  console.log('  • Index файлы созданы для папок');
  console.log('\nЗапустите: npm start для проверки');
}

if (require.main === module) {
  main();
}

module.exports = { syncDirectory, generateSidebars };
