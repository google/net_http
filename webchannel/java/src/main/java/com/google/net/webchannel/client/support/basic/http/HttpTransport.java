package com.google.net.webchannel.client.support.basic.http;

import com.google.auto.value.AutoValue;
import com.google.common.base.Preconditions;
import com.google.common.collect.ImmutableList;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.GeneralSecurityException;
import java.security.cert.X509Certificate;
import javax.annotation.Nullable;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/** Thread-safe HTTP low-level transport based on the {@code java.net} package. */
public class HttpTransport {

  private static final ImmutableList<String> SUPPORTED_METHODS =
      ImmutableList.of("DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "TRACE");

  @Nullable private final ServerVerifier serverVerifier;

  protected HttpTransport(@Nullable ServerVerifier serverVerifier) {
    this.serverVerifier = serverVerifier;
  }

  /** Returns an instance of HttpTransport. */
  public static HttpTransport createTransport() {
    return new HttpTransport(null);
  }

  /** Returns an instance of HttpTransport with SSL settings. */
  public static HttpTransport createTransporWithSSL(ServerVerifier serverVerifier) {
    return new HttpTransport(serverVerifier);
  }

  public HttpRequest createRequest(String method) {
    return new HttpRequest(this, method);
  }

  protected HttpURLConnection buildConnection(String method, URL connUrl) throws IOException {
    Preconditions.checkArgument(
        SUPPORTED_METHODS.contains(method), "HTTP method %s not supported", method);

    HttpURLConnection connection = (HttpURLConnection) connUrl.openConnection();
    connection.setRequestMethod(method);

    if (connection instanceof HttpsURLConnection && serverVerifier != null) {
      HttpsURLConnection secureConnection = (HttpsURLConnection) connection;
      if (serverVerifier.hostnameVerifier() != null) {
        secureConnection.setHostnameVerifier(serverVerifier.hostnameVerifier());
      }
      if (serverVerifier.sslSocketFactory() != null) {
        secureConnection.setSSLSocketFactory(serverVerifier.sslSocketFactory());
      }
    }
    return connection;
  }

  /**
   * Create an instance to trust all hosts and certs.
   *
   * <p>For testing environments only.
   */
  @SuppressWarnings("BadHostnameVerifier")
  public static HttpTransport createTransportNotValidateCertificate()
      throws GeneralSecurityException {
    // Trust all HostnameVerifier.
    HostnameVerifier hostnameVerifier =
        new HostnameVerifier() {
          @Override
          public boolean verify(String hostname, SSLSession session) {
            return true;
          }
        };

    // Trust all ssl context
    @SuppressWarnings("CustomX509TrustManager")
    X509TrustManager trustManager =
        new X509TrustManager() {
          @SuppressWarnings("TrustAllX509TrustManager")
          @Override
          public void checkClientTrusted(X509Certificate[] chain, String authType) {}

          @SuppressWarnings("TrustAllX509TrustManager")
          @Override
          public void checkServerTrusted(X509Certificate[] chain, String authType) {}

          @Nullable
          @Override
          public X509Certificate[] getAcceptedIssuers() {
            return null;
          }
        };
    TrustManager[] trustAllCerts = new TrustManager[] {trustManager};

    SSLContext context = SSLContext.getInstance("TLS");
    context.init(null, trustAllCerts, null);
    SSLSocketFactory sslSocketFactory = context.getSocketFactory();
    return createTransporWithSSL(
        ServerVerifier.builder()
            .setSslSocketFactory(sslSocketFactory)
            .setHostnameVerifier(hostnameVerifier)
            .build());
  }

  /** A wrapper of SSL settings */
  @AutoValue
  public abstract static class ServerVerifier {
    @Nullable
    abstract SSLSocketFactory sslSocketFactory();

    @Nullable
    abstract HostnameVerifier hostnameVerifier();

    public static Builder builder() {
      return new AutoValue_HttpTransport_ServerVerifier.Builder();
    }

    /** Builder for ServerVerifier. */
    @AutoValue.Builder
    public abstract static class Builder {
      public abstract Builder setSslSocketFactory(SSLSocketFactory sslSocketFactory);

      public abstract Builder setHostnameVerifier(HostnameVerifier hostnameVerifier);

      public abstract ServerVerifier build();
    }
  }
}
