package infs7205.gu.practice_2.service;

import infs7205.gu.practice_2.model.Chipotle;

import java.util.List;

public interface ChipotleService {

    List<Chipotle> storeInquiry(double latitude, double longitude, Integer num);

    List<Chipotle> storeInquiryByRectangle(double minLat, double minLng, double maxLat, double maxLng);

    List<Chipotle> storeInquiryByCorridor(double lat1, double lng1, double lat2, double lng2, double radius);

    String corridorGeo(double lng1, double lat1, double lng2, double lat2, double radius);
}
