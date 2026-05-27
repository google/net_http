const ClosureCompiler = require('google-closure-compiler').compiler;
const { getNativeImagePath } = require('google-closure-compiler/lib/utils');
const path = require('path');
const fs = require('fs');

console.log('Compiling WebChannel library using Closure Compiler...');

// Helper function to recursively find all JS files except tests
function getJsFilesRecursive(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsFilesRecursive(filePath));
    } else if (file.endsWith('.js') && !file.endsWith('_test.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const sourceFiles = [
  ...getJsFilesRecursive(path.join(__dirname, 'imported_src')),
  path.join(__dirname, 'exports.js'),
  ...getJsFilesRecursive(path.join(__dirname, 'node_modules/google-closure-library/closure/goog'))
    .filter(file => !file.toLowerCase().includes((path.join('closure', 'goog', 'labs', 'net', 'webchannel') + path.sep).toLowerCase())),
  ...getJsFilesRecursive(path.join(__dirname, 'node_modules/google-closure-library/third_party/closure/goog'))
];

console.log(`Found ${sourceFiles.length} files to resolve dependencies from.`);

const compiler = new ClosureCompiler({
  js: sourceFiles,
  entry_point: path.join(__dirname, 'exports.js'),
  dependency_mode: 'PRUNE',
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
  language_in: 'ECMASCRIPT_NEXT',
  language_out: 'ECMASCRIPT_2021',
  js_output_file: path.join(__dirname, 'dist/webchannel_blob_es2022.js'),
  output_wrapper: '(function(){\n%output%\n}).apply(typeof global !== \'undefined\' ? global : typeof self !== \'undefined\' ? self : typeof window !== \'undefined\' ? window : {});',
  warning_level: 'QUIET',
  define: ['COMPILED=true']
});

compiler.JAR_PATH = null;
compiler.javaPath = getNativeImagePath();

compiler.run((exitCode, stdOut, stdErr) => {
  if (exitCode === 0) {
    console.log('Successfully compiled WebChannel JS library!');
    if (stdErr) {
      console.log('Warnings/Notes:\n', stdErr);
    }
  } else {
    console.error('Compilation failed with exit code:', exitCode);
    console.error(stdErr);
    process.exit(exitCode);
  }
});
