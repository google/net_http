package com.google.net.webchannel.client.xplat;

import java.util.Map;
import org.jspecify.annotations.Nullable;

interface Wire {
  int LATEST_CHANNEL_VERSION = 8;
  String RAW_DATA_KEY = "__data__";

  class QueuedMap {
    public QueuedMap(long mapId, Map<String, String> map, @Nullable Object context) {
      this.mapId = mapId;
      this.map = map;
      this.context = context;
    }

    public long mapId;
    public Map<String, String> map;
    public @Nullable Object context;

    public int getRawDataSize() {
      if (this.map.containsKey(RAW_DATA_KEY)) {
        String data = this.map.get(RAW_DATA_KEY);
        if (data != null) {
          return data.length();
        }
      }

      return -1;  // unknown
    }
  }

  interface BadMessageHandler {
    void onBadMessage(Object message);
  }
}
