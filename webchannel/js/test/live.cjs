// Optional remote smoke test. Never run by npm test.
const legacy = process.argv.includes('--legacy');
const {createWebChannelTransport, WebChannel} = legacy
  ? require('../dist/webchannel_blob_es2022.js') : require('../lib/index.js');
const endpoint = process.env.WEBCHANNEL_ECHO_URL ??
  'https://webchannel.sandbox.google.com/staging/channel/echo';
const message = 'typescript-port-smoke';

async function echo(name, options) {
  await new Promise((resolve, reject) => {
    const channel = createWebChannelTransport().createWebChannel(endpoint, {
      useFetchStreams: true, sendRawJson: true, supportsCrossDomainXhr: true,
      httpSessionIdParam: 'gsessionid', ...options,
    });
    let finished = false;
    const finish = error => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      channel.close();
      if (error) reject(error); else resolve();
    };
    const timer = setTimeout(() => finish(new Error(name + ': timed out after 15s')), 15_000);
    channel.listen(WebChannel.EventType.ERROR, event => {
      finish(new Error(name + ': channel error ' + event.errorCode));
    });
    channel.listen(WebChannel.EventType.MESSAGE, event => {
      const data = JSON.stringify(event.data);
      if (data.includes(message)) {
        console.log(`${legacy ? 'legacy' : 'typescript'} ${name}: ${data}`);
        finish();
      }
    });
    // Queue initial data to exercise fast handshake's zero-RTT request path.
    channel.open();
    channel.send({message});
  });
}
(async () => {
  for (const [name, options] of [
    ['streaming', {}], ['long polling', {forceLongPolling: true}],
    ['fast handshake', {fastHandshake: true}],
  ]) await echo(name, options);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
