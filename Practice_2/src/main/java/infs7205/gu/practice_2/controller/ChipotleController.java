package infs7205.gu.practice_2.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import infs7205.gu.practice_2.common.ApiRestResponse;
import infs7205.gu.practice_2.model.Chipotle;
import infs7205.gu.practice_2.service.ChipotleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChipotleController {
    @Autowired
    ChipotleService chipotleService;

    @PostMapping("/storeInquiry")
    public ApiRestResponse storeInquiry(@RequestParam double latitude,@RequestParam double longitude, @RequestParam Integer num) {
        List<Chipotle> chipotleList = chipotleService.storeInquiry(latitude, longitude, num);
        return ApiRestResponse.success(chipotleList);
    }

    @PostMapping("/storeInquiryByRectangle")
    public ApiRestResponse storeInquiryByRectangle(@RequestParam double minLat,@RequestParam double minLng, @RequestParam double maxLat,@RequestParam double maxLng) {
        List<Chipotle> chipotleList = chipotleService.storeInquiryByRectangle(minLat,minLng,maxLat,maxLng);
        return ApiRestResponse.success(chipotleList);
    }

    @PostMapping("/storeInquiryByCorridor")
    public ApiRestResponse storeInquiryByCorridor(@RequestParam double Lat1,@RequestParam double Lng1, @RequestParam double Lat2,@RequestParam double Lng2, @RequestParam double radius) {
        List<Chipotle> chipotleList = chipotleService.storeInquiryByCorridor(Lat1,Lng1,Lat2,Lng2,radius);
        return ApiRestResponse.success(chipotleList);
    }

    @GetMapping("/corridorGeo")
    public ApiRestResponse corridorGeo(@RequestParam double Lat1,@RequestParam double Lng1, @RequestParam double Lat2,@RequestParam double Lng2, @RequestParam double radius) throws JsonProcessingException {
        String geoJson = chipotleService.corridorGeo(Lng1, Lat1, Lng2, Lat2, radius);
        // 转成对象让前端拿到 {"type":"Polygon", "coordinates":[...] }
        Object json = new com.fasterxml.jackson.databind.ObjectMapper().readValue(geoJson, Object.class);
        return ApiRestResponse.success(json);
    }

}
