package infs7205.gu.practice_2.service.impl;

import infs7205.gu.practice_2.mapper.ChipotleMapper;
import infs7205.gu.practice_2.model.Chipotle;
import infs7205.gu.practice_2.service.ChipotleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChipotleServiceImpl implements ChipotleService {
    @Autowired
    ChipotleMapper chipotleMapper;

    @Override
    public List<Chipotle> storeInquiry(double latitude, double longitude, Integer num) {
        return chipotleMapper.selectChipotle(latitude, longitude, num);
    }

    @Override
    public List<Chipotle> storeInquiryByRectangle(double minLat, double minLng, double maxLat, double maxLng) {
        return chipotleMapper.selectChipotleByRectangle(minLat,minLng,maxLat,maxLng);
    }

    @Override
    public List<Chipotle> storeInquiryByCorridor(double Lat1, double Lng1, double Lat2, double Lng2, double radius) {
        return chipotleMapper.selectChipotleByCorridor(Lat1,Lng1,Lat2,Lng2,radius);
    }

    @Override
    public String corridorGeo(double Lng1, double Lat1, double Lng2, double Lat2, double radius) {
        return chipotleMapper.selectCorridorGeo(Lng1, Lat1, Lng2, Lat2, radius);
    }
}
