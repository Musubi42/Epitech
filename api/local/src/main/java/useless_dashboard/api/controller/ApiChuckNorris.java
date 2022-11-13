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
@RequestMapping(value = "/api/ChuckNorris")
public class ApiChuckNorris {
    @CrossOrigin(origins = "*")
    @GetMapping
    public @ResponseBody ResponseEntity<?> getJoke(@RequestParam(required = false) String category) throws Exception {
        // If no category is specified, return a random joke
        String url = category == null ? "https://api.chucknorris.io/jokes/random" : "https://api.chucknorris.io/jokes/random?category=" + category;
        HttpRequest request = HttpRequest.newBuilder()
		.uri(URI.create(url))
		.header("accept", "application/json")
		.header("X-RapidAPI-Key", "05ac93870amsh40fcb7719a01364p190b5ajsn263d10c2c29f")
		.header("X-RapidAPI-Host", "matchilling-chuck-norris-jokes-v1.p.rapidapi.com")
		.method("GET", HttpRequest.BodyPublishers.noBody())
		.build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return ResponseEntity.ok(response.body());
    }
}