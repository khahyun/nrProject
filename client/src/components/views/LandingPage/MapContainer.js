import React, { useEffect } from 'react';
const { useState } = require('react');

const { daum } = window;



const MapContainer = () => {

    const [value, setValue] = useState('');
    const mapC = document.getElementById('map');
    const mapOption = {
        center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };


    const sample5_execDaumPostcode = () => {

        new daum.Postcode({
            oncomplete: function(data) {
                const addr = data.address; // 최종 주소 변수
            //지도를 미리 생성
            const map = new daum.maps.Map(mapC, mapOption);
            //주소-좌표 변환 객체를 생성
            const geocoder = new daum.maps.services.Geocoder();
            const marker = new daum.maps.Marker({
                position: new daum.maps.LatLng(37.537187, 127.005476),
                map: map
            });
                // 주소 정보를 해당 필드에 넣는다.
                document.getElementById("sample5_address").value = addr;
                // 주소로 상세 정보를 검색
                geocoder.addressSearch(data.address, function(results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {
    
                        var result = results[0]; //첫번째 결과의 값을 활용
    
                        // 해당 주소에 대한 좌표를 받아서
                        var coords = new daum.maps.LatLng(result.y, result.x);
                        // 지도를 보여준다.
                        mapC.style.display = "block";
                        map.relayout();
                        // 지도 중심을 변경한다.
                        map.setCenter(coords);
                        // 마커를 결과값으로 받은 위치로 옮긴다.
                        marker.setPosition(coords)
                    }
                });
            }
        }).open();
      };
      
      const tempStyle={
        display:"none",
        width:"300px",
        height:"300px",
        margin: "10px"
        }


    return (
    <>
        <input id="sample5_address" value={value} onChange={(e) => setValue(e.currentTarget.value)}/>
        <input type="button" onClick={sample5_execDaumPostcode}  value="주소 검색"/>
        <div id="map" style={tempStyle}></div>

    </>    
    );
}


export default MapContainer; 