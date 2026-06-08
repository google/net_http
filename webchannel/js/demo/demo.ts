import { createWebChannelTransport, WebChannel } from '../dist/webchannel_blob_es2022';

const logElement = document.getElementById('log') as HTMLTextAreaElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;
const messageInput = document.getElementById('message') as HTMLInputElement;

function log(msg: string) {
  console.log(msg);
  if (logElement) {
    logElement.value += msg + '\n';
    logElement.scrollTop = logElement.scrollHeight;
  }
}

log('Initializing WebChannel demo...');

const channelFactory = createWebChannelTransport();
const url = 'https://webchannel.sandbox.google.com/staging/channel/generator';

let activeChannel: any = null;

sendButton?.addEventListener('click', () => {
  if (activeChannel) {
    log('>>> Closing previous active WebChannel connection...');
    activeChannel.close();
  }
  const text = messageInput?.value || 'Hello from WebChannel TS Demo!';
  log(`>>> Sending request with message: "${text}"`);
  
  const options = {
    supportsCrossDomainXhr: true,
    httpSessionIdParam: 'gsessionid'
  };
  
  const channel = channelFactory.createWebChannel(url, options);
  activeChannel = channel;
  
  channel.listen(WebChannel.EventType.OPEN, () => {
    log('>>> WebChannel opened!');
    
    const payload = {
      message: text,
      num_messages: 5,
      message_interval: 1000
    };
    
    channel.send(payload);
    log(`>>> Sent request payload: ${JSON.stringify(payload)}`);
  });
  
  channel.listen(WebChannel.EventType.MESSAGE, (event: any) => {
    const inbound = event.data;
    log(`<<< Received message event. Raw data: ${JSON.stringify(inbound)}`);
    
    const result = Array.isArray(inbound) ? inbound[0] : inbound;
    if (result) {
      if (result.error) {
        log(`<<< ERROR from server: ${result.error.message}`);
      } else if (result.message) {
        log(`<<< Echo response message: "${result.message}"`);
      }
    }
  });
  
  channel.listen(WebChannel.EventType.ERROR, (error: any) => {
    log(`<<< WebChannel error: ${JSON.stringify(error)}`);
    if (activeChannel === channel) {
      activeChannel = null;
    }
  });
  
  channel.listen(WebChannel.EventType.CLOSE, () => {
    log('<<< WebChannel closed!');
    if (activeChannel === channel) {
      activeChannel = null;
    }
  });
  
  channel.open();
});
