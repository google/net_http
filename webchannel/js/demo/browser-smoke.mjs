// Copyright 2026 The net_http Authors. SPDX-License-Identifier: Apache-2.0
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';

const {values} = parseArgs({options: {
  playwright: {type: 'string'},
  help: {type: 'boolean', short: 'h'},
}});
if (values.help) {
  console.log('Usage: npm run test:browser -- --playwright /path/to/node_modules/playwright/index.mjs');
  console.log('Runs six live Chromium checks; see demo/README.md for setup.');
  process.exit(0);
}

// Keep browser tooling optional and outside the project's locked dependencies.
const playwrightModule = values.playwright
  ? pathToFileURL(path.resolve(values.playwright)).href
  : 'playwright';
const {chromium} = await import(playwrightModule).catch(error => {
  throw new Error('Cannot load Playwright. Supply --playwright /path/to/playwright/index.mjs; see demo/README.md.', {cause: error});
});
const {createServer, preview, build} = await import('vite');
const root = fileURLToPath(new URL('.', import.meta.url));
const configFile = path.join(root, 'vite.config.mts');
const prefix = '<<< Received message event. Raw data: ';
const count = log => log.split('\n').filter(line => line.startsWith(prefix)).length;
let browser;
let dev;
let built;
let passed = 0;
let failed = 0;

async function connect(page) {
  await page.locator('#connect').click();
  await page.waitForFunction(() => document.querySelector('#status-badge').textContent === 'Connected', null, {timeout: 30_000});
}

async function send(page, message) {
  await page.locator('#message').fill(message);
  await page.locator('#send').click();
}

async function received(page, minimum) {
  await page.waitForFunction(({prefix, minimum}) =>
    document.querySelector('#log').value.split('\n').filter(line => line.startsWith(prefix)).length >= minimum,
  {prefix, minimum}, {timeout: 30_000});
}

async function scenario(name, base, options, callback) {
  let context;
  let page;
  const errors = [];
  const requests = [];
  try {
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(15_000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.origin === 'https://webchannel.sandbox.google.com') {
        requests.push({
          rid: url.searchParams.get('RID'),
          ci: url.searchParams.get('CI'),
          resourceType: request.resourceType(),
          body: request.postData(),
        });
      }
    });
    await page.goto(base, {waitUntil: 'networkidle', timeout: 30_000});
    for (const [key, value] of Object.entries(options)) {
      await page.locator('#' + key).setChecked(value);
    }
    await callback({page, requests});
    assert.deepEqual(errors, [], 'Unexpected browser console/page errors');
    passed++;
    console.log('PASS ' + name);
  } catch (error) {
    failed++;
    console.error('FAIL ' + name + ': ' + error.message);
    if (errors.length) console.error(errors.join('\n'));
    if (page) console.error(await page.locator('#log').inputValue({timeout: 1000}).catch(() => ''));
  } finally {
    if (context) await context.close();
  }
}

async function generator({page}, message) {
  await connect(page);
  await send(page, message);
  await received(page, 5);
  // Observe a short quiet period to catch extra/duplicate replies.
  await page.waitForTimeout(1200);
  assert.equal(count(await page.locator('#log').inputValue()), 5);
}

function origin(server) {
  return `http://127.0.0.1:${server.httpServer.address().port}/`;
}

try {
  browser = await chromium.launch({headless: true});
  console.log('Chromium: ' + browser.version());
  dev = await createServer({root, configFile, server: {host: '127.0.0.1', port: 0}});
  await dev.listen();
  const base = origin(dev);

  await scenario('generator-streaming', base, {}, async state => {
    await generator(state, 'qa-streaming');
    assert.ok(state.requests.some(request => request.rid === 'rpc' && request.ci === '0' && request.resourceType === 'xhr'), 'Expected streaming XHR backchannel');
  });
  await scenario('generator-long-polling', base, {forceLongPolling: true}, async state => {
    await generator(state, 'qa-long-polling');
    assert.ok(state.requests.some(request => request.rid === 'rpc' && request.ci === '1'), 'Expected long-polling backchannel');
  });
  await scenario('generator-map-messages', base, {sendRawJson: false}, async state => {
    await generator(state, 'qa-map');
    assert.ok(state.requests.some(request => new URLSearchParams(request.body ?? '').get('req0_message') === 'qa-map'), 'Expected form-encoded message');
  });
  await scenario('disconnect-and-reconnect', base, {}, async ({page}) => {
    await connect(page);
    await send(page, 'qa-before-disconnect');
    await received(page, 2);
    await page.locator('#disconnect').click();
    await page.waitForFunction(() => document.querySelector('#status-badge').textContent === 'Disconnected');
    const before = count(await page.locator('#log').inputValue());
    await page.waitForTimeout(4000);
    assert.equal(count(await page.locator('#log').inputValue()), before, 'Replies continued after disconnect');
    await page.locator('#clear').click();
    await generator({page}, 'qa-after-reconnect');
    assert.ok(!(await page.locator('#log').inputValue()).includes('qa-before-disconnect'), 'Old messages appeared after reconnect');
  });
  await scenario('echo-three-messages', base, {}, async ({page}) => {
    await page.locator('#endpoint').selectOption('https://webchannel.sandbox.google.com/staging/channel/echo');
    await connect(page);
    const messages = ['qa-echo-A', 'qa-echo-B', 'qa-echo-C'];
    for (const message of messages) await send(page, message);
    await received(page, 3);
    await page.waitForTimeout(1200);
    const events = (await page.locator('#log').inputValue()).split('\n')
      .filter(line => line.startsWith(prefix)).map(line => JSON.parse(line.slice(prefix.length)));
    assert.equal(events.length, 3);
    for (const message of messages) {
      assert.equal(events.filter(event => JSON.stringify(event).includes(message)).length, 1);
    }
  });

  await build({root, configFile});
  built = await preview({root, configFile, preview: {host: '127.0.0.1', port: 0}});
  await scenario('built-static-demo', origin(built), {}, state => generator(state, 'qa-built-static'));
  console.log(`${passed} passed, ${failed} failed`);
  if (failed) process.exitCode = 1;
} finally {
  // Attempt every cleanup even if an earlier close fails.
  const cleanup = await Promise.allSettled([
    browser?.close(), dev?.close(), built?.close(),
  ]);
  for (const result of cleanup) {
    if (result.status === 'rejected') {
      console.error('Cleanup failed:', result.reason);
      process.exitCode = 1;
    }
  }
}
