#!/usr/bin/env node

/**
 * Watch режим для автоматической синхронизации
 * 
 * Отслеживает изменения в файловой системе и автоматически
 * синхронизирует с Docusaurus
 */

const fs = require('fs');
const path = require('path');
const { syncDirectory, generateSidebars } = require('./sync-filesystem.js');

const chokidar = require('chokidar');

// ==========================================
// КОНФИГУРАЦИЯ
// ==========================================

const config = {
  repoRoot: process.cwd(),
  docsDir: path.join(process.cwd(), 'docs'),
  
  // Что игнорируем при watch
  ignored: [
    '**/node_modules/**',
    '**/.git/**',
    '**/build/**',
    '**/.docusaurus/**',
    '**/docs/**', // не отслеживаем саму папку docs
  ],
  
  // Дебаунс для batch обработки изменений
  debounceMs: 1000,
};

// ==========================================
// WATCH ЛОГИКА
// ==========================================

let syncTimeout = null;

/**
 * Дебаунсим синхронизацию чтобы не делать её на каждое изменение
 */
function scheduleSynс() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(() => {
    console.log('\n🔄 Change detected, syncing...\n');
    
    try {
      syncDirectory(config.repoRoot, config.docsDir);
      generateSidebars();
      console.log('\n✅ Sync complete\n');
    } catch (error) {
      console.error('❌ Sync error:', error.message);
    }
  }, config.debounceMs);
}

/**
 * Главная функция
 */
function main() {
  console.log('👁️  Starting filesystem watch mode...\n');
  console.log(`Watching: ${config.repoRoot}`);
  console.log(`Target: ${config.docsDir}\n`);
  console.log('Press Ctrl+C to stop\n');
  
  // Первоначальная синхронизация
  console.log('📦 Initial sync...\n');
  syncDirectory(config.repoRoot, config.docsDir);
  generateSidebars();
  console.log('\n✅ Initial sync complete\n');
  console.log('👁️  Watching for changes...\n');
  
  // Создаём watcher
  const watcher = chokidar.watch(config.repoRoot, {
    ignored: config.ignored,
    persistent: true,
    ignoreInitial: true,
  });
  
  // События
  watcher
    .on('add', filePath => {
      if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        console.log(`➕ File added: ${path.relative(config.repoRoot, filePath)}`);
        scheduleSynс();
      }
    })
    .on('change', filePath => {
      if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        console.log(`✏️  File changed: ${path.relative(config.repoRoot, filePath)}`);
        scheduleSynс();
      }
    })
    .on('unlink', filePath => {
      if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
        console.log(`➖ File deleted: ${path.relative(config.repoRoot, filePath)}`);
        scheduleSynс();
      }
    })
    .on('addDir', dirPath => {
      console.log(`📁 Directory added: ${path.relative(config.repoRoot, dirPath)}`);
      scheduleSynс();
    })
    .on('unlinkDir', dirPath => {
      console.log(`📁 Directory deleted: ${path.relative(config.repoRoot, dirPath)}`);
      scheduleSynс();
    })
    .on('error', error => {
      console.error('❌ Watcher error:', error);
    });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping watcher...');
    watcher.close();
    process.exit(0);
  });
}

// ==========================================
// ЗАПУСК
// ==========================================

if (require.main === module) {
  main();
}
