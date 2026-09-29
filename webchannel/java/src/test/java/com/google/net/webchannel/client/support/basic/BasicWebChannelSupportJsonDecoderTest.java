package com.google.net.webchannel.client.support.basic;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class BasicWebChannelSupportJsonDecoderTest {
  private final BasicWebChannelSupportJsonDecoder decoder = new BasicWebChannelSupportJsonDecoder();
  private static final String NESTED_ARRAYS_JSON = "[[[[{}]]],[[]],{\"x\":1}]";

  private static final String JSON_ARRAY_WITH_OBJECT_WITH_STRING_MAP =
      "[{\"http_headers\": {\"test_key\": \"test_value\"}}]";
  private static final String JSON_STRING_MAP_JSON_STRING = "{\"test_key\":\"test_value\"}";
  private static final String JSON_OBJECT_MAP_KEY = "http_headers";
  private static final String JSON_STRING_MAP_KEY = "test_key";
  private static final String JSON_STRING_MAP_VALUE = "test_value";

  private static final String JSON_ARRAY_WITH_OBJECT_WITH_INT = "[{\"status_code\": 404}]";
  private static final String JSON_OBJECT_INT_KEY = "status_code";
  private static final int JSON_OBJECT_INT_VALUE = 404;

  private static final String JSON_ARRAY_WITH_OBJECT_WITH_STRING =
      "[{\"test_key\": \"test_value\"}]";

  @Test
  public void decodeArray_emptyArray() throws Exception {
    List<?> result = decoder.decodeArray("[]", 1);

    assertThat(result).isEmpty();
  }

  @Test
  public void decodeArray_nestedArraysOneLevel() throws Exception {
    List<?> result = decoder.decodeArray(NESTED_ARRAYS_JSON, 1);

    // Sadly, JSONArray does not override equals(), so this will have to do.
    assertThat(result).hasSize(3);
    assertThat(result.get(0)).isInstanceOf(JSONArray.class);
    assertThat(result.get(1)).isInstanceOf(JSONArray.class);
    assertThat(result.get(2)).isInstanceOf(JSONObject.class);
    assertThat(((JSONObject) result.get(2)).getInt("x")).isEqualTo(1);
  }

  @Test
  public void decodeArray_nestedArraysTwoLevels() throws Exception {
    List<?> result = decoder.decodeArray(NESTED_ARRAYS_JSON, 2);

    assertThat(result).hasSize(3);
    assertThat(result.get(0)).isInstanceOf(List.class);
    assertThat(result.get(1)).isInstanceOf(List.class);
    assertThat(((List<?>) result.get(0)).get(0)).isInstanceOf(JSONArray.class);
    assertThat(((List<?>) result.get(1)).get(0)).isInstanceOf(JSONArray.class);
    assertThat(result.get(2)).isInstanceOf(JSONObject.class);
    assertThat(((JSONObject) result.get(2)).getInt("x")).isEqualTo(1);
  }

  @Test
  public void decodeArray_nestedArraysAllLevels() throws Exception {
    List<?> result = decoder.decodeArray(NESTED_ARRAYS_JSON, Integer.MAX_VALUE);

    assertThat(result).hasSize(3);
    assertThat(result.get(0)).isInstanceOf(List.class);
    assertThat(result.get(1)).isInstanceOf(List.class);
    assertThat(((List<?>) result.get(0)).get(0)).isInstanceOf(List.class);
    assertThat(((List<?>) result.get(1)).get(0)).isInstanceOf(List.class);
    assertThat(result.get(2)).isInstanceOf(JSONObject.class);
    assertThat(((JSONObject) result.get(2)).getInt("x")).isEqualTo(1);
  }

  @Test
  public void decodeArray_zeroMaxDepth() throws Exception {
    IllegalArgumentException expected =
        assertThrows(IllegalArgumentException.class, () -> decoder.decodeArray("unused", 0));

    assertThat(expected).hasMessageThat().contains("maxDepth");
  }

  @Test
  public void decodeArray_negativeMaxDepth() throws Exception {
    IllegalArgumentException expected =
        assertThrows(IllegalArgumentException.class, () -> decoder.decodeArray("unused", -1));

    assertThat(expected).hasMessageThat().contains("maxDepth");
  }

  @Test
  public void decodeArray_nonJsonString() throws Exception {
    IllegalArgumentException expected =
        assertThrows(IllegalArgumentException.class, () -> decoder.decodeArray("<garbage>", 1));

    assertThat(expected).hasMessageThat().contains("Unable to decode given data into JSON");
  }

  @Test
  public void isJsonObjectAndHasKey() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_STRING_MAP, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.isJsonObjectAndHasKey(jsonObject, JSON_OBJECT_MAP_KEY)).isTrue();
  }

  @Test
  public void getAnyKey() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_INT, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.getAnyKey(jsonObject)).isEqualTo(JSON_OBJECT_INT_KEY);
  }

  @Test
  public void get_valueIsJsonObject() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_STRING_MAP, 1);
    Object jsonObject = result.get(0);

    Object childObject = decoder.get(jsonObject, JSON_OBJECT_MAP_KEY);

    assertThat(childObject).isInstanceOf(JSONObject.class);
    assertThat(((JSONObject) childObject).getString(JSON_STRING_MAP_KEY))
        .isEqualTo(JSON_STRING_MAP_VALUE);
  }

  @Test
  public void get_valueIsInt() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_INT, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.get(jsonObject, JSON_OBJECT_INT_KEY)).isEqualTo(JSON_OBJECT_INT_VALUE);
  }

  @Test
  public void get_valueIsString() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_STRING, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.get(jsonObject, JSON_STRING_MAP_KEY)).isEqualTo(JSON_STRING_MAP_VALUE);
  }

  @Test
  public void getJsonObjectFromJsonObject() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_STRING_MAP, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.getJsonObjectFromJsonObject(jsonObject, JSON_OBJECT_MAP_KEY).toString())
        .isEqualTo(JSON_STRING_MAP_JSON_STRING);
  }

  @Test
  public void getStringMapFromJsonObject() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_STRING_MAP, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.getStringMapFromJsonObject(jsonObject, JSON_OBJECT_MAP_KEY))
        .containsExactly(JSON_STRING_MAP_KEY, JSON_STRING_MAP_VALUE);
  }

  @Test
  public void getIntFromJsonObject() throws Exception {
    List<?> result = decoder.decodeArray(JSON_ARRAY_WITH_OBJECT_WITH_INT, 1);
    Object jsonObject = result.get(0);

    assertThat(decoder.getIntFromJsonObject(jsonObject, JSON_OBJECT_INT_KEY))
        .isEqualTo(JSON_OBJECT_INT_VALUE);
  }
}
