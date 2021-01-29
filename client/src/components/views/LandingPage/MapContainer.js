import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getAptInfo } from '../../../_actions/user_action';

const { daum } = window;
const { kakao } = window;
const axios = require('axios');



let dong;
const MapContainer = () => {
    let myLocation;
    const sample5_execDaumPostcode = () => {

        new daum.Postcode({


            oncomplete: function (data) {

                const mapC = document.getElementById('mapp');
                const mapOption = {
                    center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
                    level: 5 // 지도의 확대 레벨
                };
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
                geocoder.addressSearch(data.address, function (results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        mapC.style.display = "block";

                        var result = results[0]; //첫번째 결과의 값을 활용
                        console.log(result);
                        // 해당 주소에 대한 좌표를 받아서
                        var coords = new daum.maps.LatLng(result.y, result.x);
                        // 지도를 보여준다.
                        
                        dong = result.address.h_code.substr(0,5);
                        myLocation = result.address.region_1depth_name + " " + result.address.region_2depth_name + " "+ result.address.region_3depth_name;

                        let mapS = document.getElementById('sss');
                        mapS.innerText = myLocation + "의 아파트 실거래가 정보";
                        
                        console.log(dong);
                        
                        map.relayout();
                        // 지도 중심을 변경한다.
                        map.setCenter(coords);
                        // 마커를 결과값으로 받은 위치로 옮긴다.
                        marker.setPosition(coords);

                    }


                        let  body = {
                            myDong:  dong,
                            myPage:  1,
                            myDate: "202012"
                        }
                        
                        axios.post('/api/apt', body)
                            .then(response  => {
                                console.log(response);
                        })
                    
                


                    
                                        
                });
            }
        }).open();
    };

    const tempStyle = {
        display: "none",
        width: "300px",
        height: "300px",
        margin: "10px"
    }

    const iStyle = {
        display: "block",
        width: "300px",
        height: "40px",
        margin: "10px"
    }

    const bStyle = {
        display: "block",
        width: "100px",
        height: "50px",
        margin: "10px"
    }

    const dcStyle = {
        Position: "relative",
        width: "800px",
        height: "1000px"
    }

    const dbStyle = {
        display: "absolute",
        width: "700px",
        top: "70%",
        left: "50%",
        margin: "0 0 0 100px"
    }


    return (
        <div class= "d_container" style={dcStyle}>
            <div class="d_box" style={dbStyle}>
            <br/>
            <h2>&emsp; 아파트 실거래가를 검색하세요 </h2>
            <input id="sample5_address" value="검색하세요" style={iStyle}/>
            <input type="button" onClick={sample5_execDaumPostcode} value="주소 검색" style={bStyle}/>
            <div id="mapp" style={tempStyle}>
            </div>
            <br/>
            <span id="sss"></span>
            </div>
        </div>
    );
}

export default MapContainer; 