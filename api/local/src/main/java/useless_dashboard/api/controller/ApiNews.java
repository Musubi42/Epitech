package useless_dashboard.api.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/News")
public class ApiNews {
    @CrossOrigin(origins = "http://127.0.0.1:5501")
    @GetMapping
    public @ResponseBody ResponseEntity<?> getNews(@RequestParam(required = false) String category , @RequestParam(required = false) String country) throws Exception {
        String url = category == null ? "https://newsapi.org/v2/top-headlines?category=health&" : "https://newsapi.org/v2/top-headlines?category=" + category + "&";
        url = country == null ? url+"country=fr&" : url + "country=" + country + "&";
        HttpRequest request = HttpRequest.newBuilder()
		.uri(URI.create(url+"apiKey=8e635fff867740e991369cf5b5b8f842"))
		// .uri(URI.create("https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=8e635fff867740e991369cf5b5b8f842"))
		.header("accept", "application/json")
		.method("GET", HttpRequest.BodyPublishers.noBody())
		.build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return ResponseEntity.ok(response.body());
    }
}