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
@RequestMapping(value = "/api/Satellites")
public class ApiSatellites {
    @CrossOrigin(origins = "http://127.0.0.1:5501")
    @GetMapping
    public @ResponseBody ResponseEntity<?> getPosition(@RequestParam(required = false) String satellite) throws Exception {
        // If no satellite is specified, return the position of the ISS
        String url = satellite == null ? "https://api.n2yo.com/rest/v1/satellite/positions/25544/0/0/0/2/&apiKey=6ZV3UP-YQPN6Q-HTXRCL-4YBX" : "https://api.n2yo.com/rest/v1/satellite/positions/" + satellite + "/0/0/0/2/&apiKey=6ZV3UP-YQPN6Q-HTXRCL-4YBX";
        HttpRequest request = HttpRequest.newBuilder()
		.uri(URI.create(url))
		.header("accept", "application/json")
		.method("GET", HttpRequest.BodyPublishers.noBody())
		.build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return ResponseEntity.ok(response.body());
    }
}