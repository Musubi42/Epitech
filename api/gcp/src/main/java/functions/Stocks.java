package functions;

import com.google.cloud.functions.HttpFunction;
import java.io.BufferedWriter;
import java.io.IOException;
import java.lang.InterruptedException;

public class Stocks implements HttpFunction {
  @Override
  public void service(com.google.cloud.functions.HttpRequest request, com.google.cloud.functions.HttpResponse response) throws IOException, InterruptedException {
    java.net.http.HttpRequest API = java.net.http.HttpRequest.newBuilder()
    .uri(java.net.URI.create("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=TSLA&interval=15min&slice=year1month1&apikey=EOSDO58H9WPBPZIO"))
	.header("accept", "application/json")
	.method("GET", java.net.http.HttpRequest.BodyPublishers.noBody())
	.build();
    java.net.http.HttpResponse<String> Response = java.net.http.HttpClient.newHttpClient().send(API, java.net.http.HttpResponse.BodyHandlers.ofString());
    response.getWriter().write(Response.body());
  }
}

// gcloud functions deploy Stocks --entry-point functions.Stocks --trigger-http --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --allow-unauthenticated
