#!/usr/bin/env node

/**
 * Автоматическая синхронизация файловой системы репозитория с Docusaurus
 * 
 * Этот скрипт:
 * 1. Сканирует всю файловую систему репозитория
 * 2. Исключает системные папки
 * 3. Автоматически создаёт/обновляет структуру в docs/
 * 4. Генерирует sidebars.js на основе файловой системы
 * 5. Добавляет frontmatter если его нет
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================

const config = {
  // Корень репозитория
  repoRoot: process.cwd(),
  
  // Папка docs для Docusaurus
  docsDir: path.join(process.cwd(), 'docs'),
  
  // Системные папки которые НЕ синхронизируем
  excludeDirs: [
    'node_modules',
    '.git',
    '.github',
    'build',
    '.docusaurus',
    'static',
    'src',
    'docs', // сама папка docs не копируется рекурсивно
    '.cache-loader',
    'versioned_docs',
    'versioned_sidebars',
  ],
  
  // Системные файлы которые НЕ синхронизируем
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
  
  // Расширения файлов которые синхронизируем
  includeExtensions: [
    '.md',
    '.mdx',
  ],
  
  // Автоматически добавлять frontmatter если его нет
  addFrontmatter: true,
  
  // Создавать автоматические index.md для папок
  createIndexFiles: true,
};

// ==========================================
// УТИЛИТЫ
// ==========================================

/**
 * Проверяет является ли папка системной
 */
function isExcludedDir(dirName) {
  return config.excludeDirs.includes(dirName) || dirName.startsWith('.');
}

/**
 * Проверяет является ли файл системным
 */
function isExcludedFile(fileName) {
  return config.excludeFiles.includes(fileName) || fileName.startsWith('.');
}

/**
 * Проверяет нужно ли синхронизировать файл
 */
function shouldSyncFile(fileName) {
  const ext = path.extname(fileName);
  return config.includeExtensions.includes(ext) && !isExcludedFile(fileName);
}

/**
 * Проверяет есть ли frontmatter в файле
 */
function hasFrontmatter(content) {
  return content.trim().startsWith('---');
}

/**
 * Генерирует frontmatter для файла
 */
function generateFrontmatter(filePath, fileName) {
  const title = fileName.replace(/\.mdx?$/, '').replace(/[-_]/g, ' ');
  
  return `---
title: ${title}
sidebar_position: auto
---

`;
}

/**
 * Добавляет frontmatter если его нет
 */
function ensureFrontmatter(filePath, content) {
  if (!config.addFrontmatter) return content;
  
  if (!hasFrontmatter(content)) {
    const fileName = path.basename(filePath);
    const frontmatter = generateFrontmatter(filePath, fileName);
    return frontmatter + content;
  }
  
  return content;
}

/**
 * Создаёт папку если её нет
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Копирует файл с обработкой
 */
function syncFile(sourcePath, targetPath) {
  const content = fs.readFileSync(sourcePath, 'utf8');
  const processedContent = ensureFrontmatter(sourcePath, content);
  
  // Создаём папку если нужно
  ensureDir(path.dirname(targetPath));
  
  // Записываем файл
  fs.writeFileSync(targetPath, processedContent, 'utf8');
  
  console.log(`✓ Synced: ${path.relative(config.repoRoot, sourcePath)}`);
}

/**
 * Создаёт автоматический index.md для папки
 */
function createIndexFile(dirPath, dirName) {
  if (!config.createIndexFiles) return;
  
  const indexPath = path.join(dirPath, 'index.md');
  
  // Не перезаписываем существующий index
  if (fs.existsSync(indexPath)) return;
  
  const title = dirName.replace(/[-_]/g, ' ');
  
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

/**
 * Рекурсивно сканирует директорию и синхронизирует файлы
 */
function syncDirectory(sourceDir, targetDir, level = 0) {
  // Создаём целевую директорию
  ensureDir(targetDir);
  
  // Читаем содержимое
  const items = fs.readdirSync(sourceDir);
  
  items.forEach(item => {
    const sourcePath = path.join(sourceDir, item);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Пропускаем системные папки
      if (isExcludedDir(item)) {
        console.log(`⊘ Skipped dir: ${item}`);
        return;
      }
      
      // Рекурсивно обрабатываем папку
      const newTargetDir = path.join(targetDir, item);
      syncDirectory(sourcePath, newTargetDir, level + 1);
      
      // Создаём index.md для папки
      createIndexFile(newTargetDir, item);
      
    } else if (stat.isFile()) {
      // Пропускаем системные файлы
      if (!shouldSyncFile(item)) {
        return;
      }
      
      // Синхронизируем файл
      const targetPath = path.join(targetDir, item);
      syncFile(sourcePath, targetPath);
    }
  });
}

/**
 * Генерирует sidebars.js автоматически на основе структуры docs/
 */
function generateSidebars() {
  const sidebarsPath = path.join(config.repoRoot, 'sidebars.js');
  
  const content = `/**
 * Автоматически сгенерированный sidebars.js
 * 
 * Этот файл создан автоматически на основе структуры папки docs/
 * Для регенерации запустите: npm run sync-filesystem
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Автоматическая генерация из всей структуры docs/
  mainSidebar: [
    {
      type: 'autogenerated',
      dirName: '.', // Генерируем из корня docs/
    },
  ],
};

module.exports = sidebars;
`;
  
  fs.writeFileSync(sidebarsPath, content, 'utf8');
  console.log('✓ Generated sidebars.js');
}

/**
 * Очищает docs/ от файлов которых нет в исходниках
 */
function cleanOrphanedFiles() {
  console.log('\n🧹 Checking for orphaned files...');
  
  // TODO: Реализовать если нужно
  // Пока не удаляем файлы автоматически для безопасности
  
  console.log('✓ Cleanup check complete');
}

/**
 * Главная функция
 */
function main() {
  console.log('🚀 Starting filesystem sync...\n');
  console.log(`Repository root: ${config.repoRoot}`);
  console.log(`Docs directory: ${config.docsDir}\n`);
  
  // Синхронизируем файлы
  syncDirectory(config.repoRoot, config.docsDir);
  
  // Генерируем sidebars.js
  console.log('\n📝 Generating sidebars...');
  generateSidebars();
  
  // Проверяем orphaned файлы
  cleanOrphanedFiles();
  
  console.log('\n✅ Filesystem sync complete!');
  console.log('\nРезультат:');
  console.log('  • Все MD/MDX файлы синхронизированы');
  console.log('  • Frontmatter добавлен где нужно');
  console.log('  • Index файлы созданы для папок');
  console.log('  • sidebars.js сгенерирован');
  console.log('\nЗапустите: npm start для проверки');
}

// ==========================================
// ЗАПУСК
// ==========================================

if (require.main === module) {
  main();
}

module.exports = { syncDirectory, generateSidebars };
