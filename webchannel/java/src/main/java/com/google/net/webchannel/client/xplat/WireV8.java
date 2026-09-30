package com.google.net.webchannel.client.xplat;

import com.google.net.webchannel.client.xplat.Support.JsonDecoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

class WireV8 {
  private Support support;

  public WireV8(Support support) {
    this.support = support;
  }

  public void encodeMessage(Map<String, String> message, List<String> buffer, String prefix) {
    String prefix_field = prefix == null ? "" : prefix;
    try {
      for (String key : message.keySet()) {
        buffer.add(prefix_field + key + "=" + support.getUrlEncoder().encode(message.get(key)));
      }
    } catch (Exception ex) {
      buffer.add(prefix + "type=" + support.getUrlEncoder().encode("_badmap"));
      throw ex;
    }
  }

  public String encodeMessageQueue(
      List<Wire.QueuedMap> messageQueue, int count, Wire.BadMessageHandler badMessageHandler) {
    long offset = -1;
    while (true) {
      List<String> buffer = new ArrayList<>();
      buffer.add("count=" + count);
      if (offset == -1) {
        if (count > 0) {
          offset = messageQueue.get(0).mapId;
          buffer.add("ofs=" + offset);
        } else {
          offset = 0;
        }
      } else {
        buffer.add("ofs=" + offset);
      }

      boolean done = true;
      for (int i = 0; i < count; i++) {
        long mapId = messageQueue.get(i).mapId;
        Map<String, String> map = messageQueue.get(i).map;
        mapId -= offset;
        if (mapId < 0) {
          offset = Math.max(0, messageQueue.get(i).mapId - 100);
          done = false;
          continue;
        }
        try {
          this.encodeMessage(map, buffer, "req" + mapId + '_');
        } catch (Exception ex) {
          if (badMessageHandler != null) {
            badMessageHandler.onBadMessage(map);
          }
        }
      }

      if (done) {
        StringBuilder sb = new StringBuilder();
        for (String item : buffer) {
          if (sb.length() == 0) {
            sb.append(item);
          } else {
            sb.append("&").append(item);
          }
        }

        return sb.toString();
      }
    }
  }

  public List<?> decodeMessage(String messageText, int arrayLevel) {
    JsonDecoder jsonDecoder = support.getJsonDecoder();
    return jsonDecoder.decodeArray(messageText, arrayLevel);
  }
}
