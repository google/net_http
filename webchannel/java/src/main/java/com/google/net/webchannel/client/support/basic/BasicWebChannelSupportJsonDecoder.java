package com.google.net.webchannel.client.support.basic;

import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import com.google.net.webchannel.client.xplat.Support.JsonDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.annotation.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Implementation of WebChannel JsonDecoder interface using the org.json.* classes. */
public class BasicWebChannelSupportJsonDecoder extends JsonDecoder {
  @Override
  public List<?> decodeArray(String data, int maxDepth) {
    Preconditions.checkArgument(maxDepth > 0, "The maxDepth must be positive");
    try {
      return flattenJsonArrayToList(new JSONArray(data), maxDepth - 1);
    } catch (JSONException e) {
      throw new IllegalArgumentException("Unable to decode given data into JSON: " + data, e);
    }
  }

  // The main logic of the basic and xplat JsonDecoder implementations should be the same.
  @Override
  public boolean isJsonObjectAndHasKey(Object jsonObject, String key) {
    return jsonObject instanceof JSONObject && ((JSONObject) jsonObject).has(key);
  }

  @Override
  public Object get(Object jsonObject, String key) {
    validateObjectIsJsonObject(jsonObject);

    try {
      return ((JSONObject) jsonObject).get(key);
    } catch (JSONException e) {
      throw new IllegalArgumentException("Unable to get object from JSON object: " + jsonObject, e);
    }
  }

  @Override
  @Nullable
  public String getAnyKey(Object jsonObject) {
    validateObjectIsJsonObject(jsonObject);

    Iterator<String> keysItr = ((JSONObject) jsonObject).keys();
    if (keysItr.hasNext()) {
      return keysItr.next();
    }

    return null;
  }

  @Override
  public int getIntFromJsonObject(Object jsonObject, String key) {
    validateObjectIsJsonObject(jsonObject);

    try {
      return ((JSONObject) jsonObject).getInt(key);
    } catch (JSONException e) {
      throw new IllegalArgumentException("Unable to parse JSON object as int: " + jsonObject, e);
    }
  }

  @Override
  public Object getJsonObjectFromJsonObject(Object jsonObject, String key) {
    validateObjectIsJsonObject(jsonObject);

    try {
      return ((JSONObject) jsonObject).getJSONObject(key);
    } catch (JSONException e) {
      throw new IllegalArgumentException(
          "Unable to parse JSON object as JSON object: " + jsonObject, e);
    }
  }

  @Override
  public Map<String, String> getStringMapFromJsonObject(Object jsonObject, String key) {
    validateObjectIsJsonObject(jsonObject);

    JSONObject mapObject;
    try {
      mapObject = ((JSONObject) jsonObject).getJSONObject(key);
    } catch (JSONException e) {
      throw new IllegalArgumentException(
          "Unable to parse JSON object as string map: " + jsonObject, e);
    }

    Map<String, String> stringMap = new HashMap<>();
    Iterator<String> keysItr = mapObject.keys();
    while (keysItr.hasNext()) {
      String mapKey = keysItr.next();
      try {
        stringMap.put(mapKey, mapObject.getString(mapKey));
      } catch (JSONException e) {
        throw new IllegalArgumentException(
            "Unable to parse JSON object as string map: " + jsonObject, e);
      }
    }
    return stringMap;
  }

  /**
   * Converts and returns the given JSON array as a list of objects.
   *
   * @param maxDepth the max number of levels to recursively convert JSONArray elements as list. If
   *     not greater than 0, returns inner element as is.
   */
  private ImmutableList<Object> flattenJsonArrayToList(JSONArray array, int maxDepth)
      throws JSONException {
    ImmutableList.Builder<Object> builder = ImmutableList.builder();
    for (int i = 0; i < array.length(); ++i) {
      Object element = array.get(i);
      if (maxDepth > 0 && element instanceof JSONArray) {
        builder.add(flattenJsonArrayToList((JSONArray) element, maxDepth - 1));
      } else {
        builder.add(element);
      }
    }
    return builder.build();
  }

  /** Throws an exception if the given object is NOT a valid JSON object. */
  private void validateObjectIsJsonObject(Object jsonObject) {
    if (!(jsonObject instanceof JSONObject)) {
      throw new IllegalArgumentException("Not a JSON object: " + jsonObject);
    }
  }
}
