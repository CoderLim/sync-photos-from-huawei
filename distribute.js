#!/usr/local/bin/node

var fs = require('fs');
var path = require('path');

const syncDir = './Camera';
const outputDir = './output';

eachFile(syncDir, function (file, idx) {
  if (!validateFile(file)) return;

  const targetDirName = getTargetDir(file);
  if (!targetDirName) return;

  const targetDir = `${outputDir}/${targetDirName}`;
  const exist = fs.existsSync(targetDir);
  if (!exist) {
    fs.mkdirSync(targetDir);
  }
  fs.copyFileSync(`${syncDir}/${file}`, `${targetDir}/${file}`);
});

/**
 * Manipulate every file in dir
 *
 * @param dir is a directory
 * @param callback for every file
 * @param deep indicates whether recurse
 *
 */
function eachFile(dir, callback, deep/*reserved*/) {
  const files = fs.readdirSync(dir);
  const total = files.length;

  files.forEach(function (file, idx) {
    // console.log(`${file} -- ${getProgress(idx, total)}`);
    console.log(`${file}`);
    const fullpath = `${dir}/${file}`;
    const stat = fs.statSync(fullpath);
    if (stat.isFile()) {
      callback && callback(file, idx);
    }
  });
}

/**
 * Get target directory where file will be moved.
 *
 * @param file is to moved
 * @return target directory
 *
 */
function getTargetDir(file) {
  console.assert(file.indexOf('.') > -1, `${file} 不是完整的文件名`);
  const filename = file.split('_')[1];

  if (!filename) return;

  const year = filename.substring(0, 4);
  const month = filename.substring(4, 6);
  const day = filename.substring(6, 8);
  return `${year}-${month}-${day}`;
}

/**
 *
 */
function validateFile(file) {
  const prefixs = ['IMG_', 'VID_'];
  return  prefixs.some(function (prefix) {
    return file.indexOf(prefix) == 0;
  });
}

function getProgress(current, total) {
  return (((current+1)/total*100) | 1) + '%';
}
