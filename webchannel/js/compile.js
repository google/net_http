// Maintained Closure build for dist/; normal package builds use TypeScript.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyRequire = createRequire(path.join(__dirname, 'legacy/package.json'));
const ClosureCompiler = legacyRequire('google-closure-compiler').compiler;
const { getNativeImagePath } = legacyRequire('google-closure-compiler/lib/utils');

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

const closureRoot = path.dirname(legacyRequire.resolve('google-closure-library/package.json'));
const outputDir = path.join(__dirname, 'dist');
fs.mkdirSync(outputDir, {recursive: true});
const entryPoint = path.join(__dirname, 'exports.js');
const outputFile = path.join(outputDir, 'webchannel_blob_es2022.js');

const sourceFiles = [
  ...getJsFilesRecursive(path.join(__dirname, 'imported_src')),
  entryPoint,
  ...getJsFilesRecursive(path.join(closureRoot, 'closure/goog'))
    .filter(file => !file.toLowerCase().includes((path.join('closure', 'goog', 'labs', 'net', 'webchannel') + path.sep).toLowerCase())),
  ...getJsFilesRecursive(path.join(closureRoot, 'third_party/closure/goog'))
];

console.log(`Found ${sourceFiles.length} files to resolve dependencies from.`);

const compiler = new ClosureCompiler({
  js: sourceFiles,
  entry_point: entryPoint,
  dependency_mode: 'PRUNE',
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
  language_in: 'ECMASCRIPT_NEXT',
  language_out: 'ECMASCRIPT_2021',
  js_output_file: outputFile,
  output_wrapper: '(function(){\n%output%\n}).apply(typeof global !== \'undefined\' ? global : typeof self !== \'undefined\' ? self : typeof window !== \'undefined\' ? window : {});',
  warning_level: 'QUIET',
  define: ['COMPILED=true', 'goog.FEATURESET_YEAR=2022', 'goog.json.USE_NATIVE_JSON=true'],
  externs: path.join(__dirname, 'legacy/externs.js'),
  formatting: 'PRETTY_PRINT'
});

compiler.JAR_PATH = null;
compiler.javaPath = getNativeImagePath();

compiler.run((exitCode, stdOut, stdErr) => {
  if (exitCode === 0) {
    console.log('Successfully compiled WebChannel JS library: ' + outputFile);
    if (stdErr) {
      console.log('Warnings/Notes:\n', stdErr);
    }
  } else {
    console.error('Compilation failed with exit code:', exitCode);
    console.error(stdErr);
    process.exit(exitCode);
  }
});
