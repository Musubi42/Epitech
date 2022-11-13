package functions;

import com.google.cloud.functions.HttpFunction;
import java.io.BufferedWriter;
import java.io.IOException;
import java.lang.InterruptedException;

public class News implements HttpFunction {
  @Override
  public void service(com.google.cloud.functions.HttpRequest request, com.google.cloud.functions.HttpResponse response) throws IOException, InterruptedException {
    java.net.http.HttpRequest API = java.net.http.HttpRequest.newBuilder()
    .uri(java.net.URI.create("https://newsapi.org/v2/top-headlines?country=fr&apiKey=8e635fff867740e991369cf5b5b8f842"))
	.header("accept", "application/json")
	.method("GET", java.net.http.HttpRequest.BodyPublishers.noBody())
	.build();
    java.net.http.HttpResponse<String> Response = java.net.http.HttpClient.newHttpClient().send(API, java.net.http.HttpResponse.BodyHandlers.ofString());
    response.getWriter().write(Response.body());
  }
}

// gcloud functions deploy News --entry-point functions.News --trigger-http --runtime java17 --region=europe-west1 --service-account firebase-adminsdk-eut15@dashboard-81b3f.iam.gserviceaccount.com --allow-unauthenticated