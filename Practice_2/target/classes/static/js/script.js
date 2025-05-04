// 初始化地图，默认视角美国
// script.js

// 初始化地图，默认视角美国
// 切换模式：Nearest -> Rectangle -> Corridor
const btnToggle = document.getElementById('toggleModeBtn');
const title     = document.getElementById('title');
const modeNearest   = document.getElementById('modeNearest');
const modeRectangle = document.getElementById('modeRectangle');
const modeCorridor  = document.getElementById('modeCorridor');
let modeIndex = 0; // 0: Nearest, 1: Rectangle, 2: Corridor

btnToggle.addEventListener('click', () => {
    modeIndex = (modeIndex + 1) % 3;
    modeNearest.style.display   = modeIndex === 0 ? 'block' : 'none';
    modeRectangle.style.display = modeIndex === 1 ? 'block' : 'none';
    modeCorridor.style.display  = modeIndex === 2 ? 'block' : 'none';
    if (modeIndex === 0) {
        title.innerHTML =
            '<img src="images/Chipotle-Logo.png" class="logo-icon" alt="Chipotle" /> ' + 'Find Chipotle By Nearest';
        btnToggle.textContent = 'Switch to Rectangle Search';
    } else if (modeIndex === 1) {
        title.innerHTML =
            '<img src="images/Chipotle-Logo.png" class="logo-icon" alt="Rectangle" /> ' + 'Find Chipotle By Rectangle';
        btnToggle.textContent = 'Switch to Corridor Search';
    } else {
        title.innerHTML =
            '<img src="images/Chipotle-Logo.png" class="logo-icon" alt="Corridor" /> ' + 'Find Chipotle Along Route';
        btnToggle.textContent = 'Switch to Nearest Search';
    }
});

// 初始化地图
const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom: 19 }).addTo(map);
let markers = [];

function clearMarkers() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

// 模式 A: 最近 K 家
// 注意接口前缀 /api
async function searchNearest() {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    const k   = parseInt(document.getElementById('k').value);
    if ([lat, lng, k].some(v => isNaN(v))) return alert('请输入合法的经纬度和数量');
    // 增强验证
    if (Math.abs(lat) > 90) return alert("纬度范围必须为 -90 到 90 度");
    if (Math.abs(lng) > 180) return alert("经度范围必须为 -180 到 180 度");
    if (k <= 0) return alert("数量必须大于 0");
    if (k > 50) return alert("最大数量不能超过 50");
    const res = await fetch(`http://localhost:8080/storeInquiry?latitude=${lat}&longitude=${lng}&num=${k}`, { method:'POST' });
    if (!res.ok) return alert('查询失败，请检查接口地址和参数');
    const stores = (await res.json()).data;
    clearMarkers();
    const q = L.circleMarker([lat,lng],{radius:6,color:'#e57027',fill:'#fff',fillOpacity:1})
        .addTo(map).bindPopup(`Your Location<br>${lat.toFixed(4)},${lng.toFixed(4)}`);
    markers.push(q);
    stores.forEach(s=>{
        const m=L.marker([s.latitude,s.longitude]).addTo(map)
            .bindPopup(`<b>${s.address}</b><br>${s.location},${s.state}<br>距离:${(s.distance_m/1000).toFixed(2)} km`);
        markers.push(m);
    });
    if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
}

document.getElementById('searchBtn1').addEventListener('click', searchNearest);

// 模式 B: 矩形框选
async function searchRectangle() {
    const minLat = parseFloat(document.getElementById('minLat').value);
    const minLng = parseFloat(document.getElementById('minLng').value);
    const maxLat = parseFloat(document.getElementById('maxLat').value);
    const maxLng = parseFloat(document.getElementById('maxLng').value);
    if ([minLat, minLng, maxLat, maxLng].some(v => isNaN(v))) return alert('请输入合法的矩形四个值');
    // 增强验证
    if (Math.abs(minLat) > 90 || Math.abs(maxLat) > 90) return alert("纬度范围必须为 -90 到 90 度");
    if (Math.abs(minLng) > 180 || Math.abs(maxLng) > 180) return alert("经度范围必须为 -180 到 180 度");
    if (minLat >= maxLat) return alert("最小纬度必须小于最大纬度");
    if (minLng >= maxLng) return alert("最小经度必须小于最大经度");
    if ((maxLat - minLat) < 0.01 || (maxLng - minLng) < 0.01) return alert("矩形范围过小（经纬度差值需大于0.01）");
    const res = await fetch(`http://localhost:8080/storeInquiryByRectangle?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,{ method:'POST'});
    if (!res.ok) return alert('查询失败，请检查接口地址和参数');
    const stores = (await res.json()).data;
    clearMarkers();
    const rectPoints = [
        [minLat, minLng], // 左下
        [minLat, maxLng], // 左上
        [maxLat, maxLng], // 右上
        [maxLat, minLng]  // 右下
    ];
    rectPoints.forEach((pt, i) => {
        const m = L.circleMarker(pt, {
            radius: 6,
            color: '#e57027',
            fillColor: '#fff',
            fillOpacity: 1
        }).addTo(map).bindPopup(`顶点 ${i+1}<br>${pt[0].toFixed(4)}, ${pt[1].toFixed(4)}`);
        markers.push(m);
    });
    // 添加矩形边线
    const rectLine = L.polygon(rectPoints, {color: '#e57027', weight: 1}).addTo(map);
    markers.push(rectLine);
    stores.forEach(s=>{
        const m=L.marker([s.latitude,s.longitude]).addTo(map)
            .bindPopup(`${s.address}`);
        markers.push(m);
    });
    if(markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
}

document.getElementById('searchBtn2').addEventListener('click', searchRectangle);

// 模式 C: 沿线路廊搜索
async function searchCorridor() {
    const Lat1    = parseFloat(document.getElementById('Lat1').value);
    const Lng1    = parseFloat(document.getElementById('Lng1').value);
    const Lat2    = parseFloat(document.getElementById('Lat2').value);
    const Lng2    = parseFloat(document.getElementById('Lng2').value);
    const radius  = parseFloat(document.getElementById('radius').value);
    if ([Lat1, Lng1, Lat2, Lng2, radius].some(v => isNaN(v))) return alert('请输入合法的路线和半径');

    // 增强验证
    if (Math.abs(Lat1) > 90 || Math.abs(Lat2) > 90) return alert("纬度范围必须为 -90 到 90 度");
    if (Math.abs(Lng1) > 180 || Math.abs(Lng2) > 180) return alert("经度范围必须为 -180 到 180 度");
    if (radius <= 0) return alert("缓冲半径必须大于 0");
    if (radius > 200) return alert("缓冲半径不能超过 200 公里");
    if (Lat1 === Lat2 && Lng1 === Lng2) return alert("起点和终点不能相同");
    const res    = await fetch(`http://localhost:8080/storeInquiryByCorridor?Lat1=${Lat1}&Lng1=${Lng1}&Lat2=${Lat2}&Lng2=${Lng2}&radius=${radius}`,{ method:'POST'});
    const stores = (await res.json()).data;
    clearMarkers();
    const startMarker = L.circleMarker([Lat1, Lng1], {
        radius: 6,
        color: '#e57027',
        fill: '#fff',
        fillOpacity: 1
    }).addTo(map).bindPopup(`起点<br>${Lat1.toFixed(4)},${Lng1.toFixed(4)}`);

    const endMarker = L.circleMarker([Lat2, Lng2], {
        radius: 6,
        color: '#e57027',
        fill: '#fff',
        fillOpacity: 1
    }).addTo(map).bindPopup(`终点<br>${Lat2.toFixed(4)},${Lng2.toFixed(4)}`);

    markers.push(startMarker, endMarker);
    // 画路线
    const line = L.polyline([[Lat1,Lng1],[Lat2,Lng2]]).addTo(map);
    markers.push(line);
    // 获取廊区 GeoJSON 并绘制，需要后端提供 /api/corridorGeo
    const bufRes = await fetch(`http://localhost:8080/corridorGeo?Lat1=${Lat1}&Lng1=${Lng1}&Lat2=${Lat2}&Lng2=${Lng2}&radius=${radius}`);
    if (bufRes.ok) {
        const bufGeo = (await bufRes.json()).data;
        const buf    = L.geoJSON(bufGeo).addTo(map);
        markers.push(buf);
    }
    // 标注门店
    stores.forEach(s=>{
        const m=L.marker([s.latitude,s.longitude]).addTo(map)
            .bindPopup(`<b>${s.address}</b><br>距路线:${(s.dist_to_route_m/1000).toFixed(2)} km`);
        markers.push(m);
    });
    if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
}

document.getElementById('searchBtn3').addEventListener('click', searchCorridor);


