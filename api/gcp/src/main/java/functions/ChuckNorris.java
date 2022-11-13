package functions;

import com.google.cloud.functions.HttpFunction;
import java.io.BufferedWriter;
import java.io.IOException;
import java.lang.InterruptedException;

public class ChuckNorris implements HttpFunction {
  @Override
  public void service(com.google.cloud.functions.HttpRequest request, com.google.cloud.functions.HttpResponse response) throws IOException, InterruptedException {
    java.net.http.HttpRequest API = java.net.http.HttpRequest.newBuilder()
    .uri(java.net.URI.create("https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random"))
	.header("accept", "application/json")
	.header("X-RapidAPI-Key", "05ac93870amsh40fcb7719a01364p190b5ajsn263d10c2c29f")
	.header("X-RapidAPI-Host", "matchilling-chuck-norris-jokes-v1.p.rapidapi.com")
	.method("GET", java.net.http.HttpRequest.BodyPublishers.noBody())
	.build();
    java.net.http.HttpResponse<String> Response = java.net.http.HttpClient.newHttpClient().send(API, java.net.http.HttpResponse.BodyHandlers.ofString());
    response.getWriter().write(Response.body());
  }
}

// gcloud functions deploy ChuckNorris --entry-point functions.ChuckNorris --trigger-http --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --allow-unauthenticated