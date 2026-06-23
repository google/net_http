import { createWebChannelTransport, WebChannel } from '../dist/webchannel_blob_es2022';

const logElement = document.getElementById('log') as HTMLTextAreaElement;
const endpointSelect = document.getElementById('endpoint') as HTMLSelectElement;
const customEndpointInput = document.getElementById('custom-endpoint') as HTMLInputElement;
const sendRawJsonCheckbox = document.getElementById('sendRawJson') as HTMLInputElement;
const detectBufferingProxyCheckbox = document.getElementById('detectBufferingProxy') as HTMLInputElement;
const forceLongPollingCheckbox = document.getElementById('forceLongPolling') as HTMLInputElement;
const fastHandshakeCheckbox = document.getElementById('fastHandshake') as HTMLInputElement;

const connectButton = document.getElementById('connect') as HTMLButtonElement;
const disconnectButton = document.getElementById('disconnect') as HTMLButtonElement;
const sendButton = document.getElementById('send') as HTMLButtonElement;
const messageInput = document.getElementById('message') as HTMLInputElement;
const clearButton = document.getElementById('clear') as HTMLButtonElement;
const statusBadge = document.getElementById('status-badge') as HTMLSpanElement;

function updateStatus(status: 'disconnected' | 'connecting' | 'connected') {
  if (!statusBadge) return;
  if (status === 'disconnected') {
    statusBadge.textContent = 'Disconnected';
    statusBadge.style.backgroundColor = '#6c757d'; // Grey
    statusBadge.style.color = 'white';
  } else if (status === 'connecting') {
    statusBadge.textContent = 'Connecting...';
    statusBadge.style.backgroundColor = '#ffc107'; // Yellow
    statusBadge.style.color = '#333';
  } else if (status === 'connected') {
    statusBadge.textContent = 'Connected';
    statusBadge.style.backgroundColor = '#28a745'; // Green
    statusBadge.style.color = 'white';
  }
}

function log(msg: string) {
  console.log(msg);
  if (logElement) {
    logElement.value += msg + '\n';
    logElement.scrollTop = logElement.scrollHeight;
  }
}

log('Initializing WebChannel demo...');

const channelFactory = createWebChannelTransport();
let activeChannel: any = null;
let lastSendTime: number = 0;
let isPendingEcho: boolean = false;

function updateUIState(connected: boolean) {
  if (connectButton) connectButton.disabled = connected;
  if (disconnectButton) disconnectButton.disabled = !connected;
  if (sendButton) sendButton.disabled = !connected;
  if (endpointSelect) endpointSelect.disabled = connected;
  if (customEndpointInput) customEndpointInput.disabled = connected;
  
  // Disable options toggles while connected
  if (sendRawJsonCheckbox) sendRawJsonCheckbox.disabled = connected;
  if (detectBufferingProxyCheckbox) detectBufferingProxyCheckbox.disabled = connected;
  if (forceLongPollingCheckbox) forceLongPollingCheckbox.disabled = connected;
  if (fastHandshakeCheckbox) fastHandshakeCheckbox.disabled = connected;
}

connectButton?.addEventListener('click', () => {
  try {
    const url = endpointSelect?.value === 'custom'
      ? (customEndpointInput?.value || '')
      : (endpointSelect?.value || 'https://webchannel.sandbox.google.com/staging/channel/generator');
    
    const options: any = {
      supportsCrossDomainXhr: true,
      httpSessionIdParam: 'gsessionid',
      sendRawJson: sendRawJsonCheckbox?.checked,
      detectBufferingProxy: detectBufferingProxyCheckbox?.checked,
      forceLongPolling: forceLongPollingCheckbox?.checked,
      fastHandshake: fastHandshakeCheckbox?.checked
    };
    
    log(`>>> Opening WebChannel connection to: ${url}`);
    log(`>>> With options: ${JSON.stringify(options)}`);
    
    const channel = channelFactory.createWebChannel(url, options);
    activeChannel = channel;
    
    channel.listen(WebChannel.EventType.OPEN, () => {
      log('>>> WebChannel connection established!');
      updateUIState(true);
      updateStatus('connected');
    });
    
    channel.listen(WebChannel.EventType.MESSAGE, (event: any) => {
      const inbound = event.data;
      log(`<<< Received message event. Raw data: ${JSON.stringify(inbound)}`);
      
      if (isPendingEcho) {
        const duration = (performance.now() - lastSendTime).toFixed(2);
        log(`<<< [E2E Latency] Round-trip echo completed in ${duration} ms.`);
        isPendingEcho = false;
      }

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
        updateUIState(false);
        updateStatus('disconnected');
      }
    });
    
    channel.listen(WebChannel.EventType.CLOSE, () => {
      log('<<< WebChannel closed!');
      if (activeChannel === channel) {
        activeChannel = null;
        updateUIState(false);
        updateStatus('disconnected');
      }
    });
    
    updateStatus('connecting');
    channel.open();
  } catch (err: any) {
    log(`!!! Exception caught during connect: ${err.message}\n${err.stack}`);
    updateStatus('disconnected');
  }
});

disconnectButton?.addEventListener('click', () => {
  if (activeChannel) {
    log('>>> Closing active WebChannel connection...');
    activeChannel.close();
  }
});

sendButton?.addEventListener('click', () => {
  if (!activeChannel) return;
  
  const text = messageInput?.value || 'Hello from WebChannel TS Demo!';
  const endpoint = endpointSelect?.value === 'custom'
    ? (customEndpointInput?.value || '')
    : (endpointSelect?.value || '');
  
  let payload: any;
  if (endpoint.includes('/staging/channel/generator')) {
    payload = {
      message: text,
      num_messages: 5,
      message_interval: 1000
    };
    log(`>>> Sending request payload to generator: ${JSON.stringify(payload)}`);
  } else {
    payload = {
      message: text
    };
    log(`>>> Sending request payload to echo: ${JSON.stringify(payload)}`);
  }
  
  lastSendTime = performance.now();
  isPendingEcho = true;
  activeChannel.send(payload);
});

endpointSelect?.addEventListener('change', () => {
  if (customEndpointInput) {
    customEndpointInput.style.display = endpointSelect.value === 'custom' ? 'inline-block' : 'none';
  }
});

clearButton?.addEventListener('click', () => {
  if (logElement) {
    logElement.value = '';
  }
});

log('Initialization completed. Ready.');
