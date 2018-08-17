var windytyInit = {
    key: 'PsL-At-XpsPTZexBwUkO7Mx5I',
    lat: 20.997944,
    lon: 105.926056,
    zoom: 6
};

const APPIPKEY = "f4376fda11edebeffae27aa600359df7"; //Key opentheweathermap



function windytyMain(map) {

    var changeWeather = $("#menu-weather li ").click(function () {
        var thisWeather = $(this).data('weather');
        if (thisWeather) {
            $("#menu-weather li ").removeClass('active');
            $(this).addClass('active');
            W.setOverlay(thisWeather);
        }
    });

    let markerIcon = L.icon({
        iconUrl: 'img/icons8-region-48.png',
        iconSize: [30, 30]
    });

    map.addEventListener('click', function (eventMap) {
        var latitude = eventMap.latlng.lat;
        var longitude = eventMap.latlng.lng;

        console.log(eventMap.latlng);

        // $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', function (address) {
        //     console.log(address.results[0].formatted_address);

        //Use getJSon to bath OpenWeatherApp Current API on my JS
        $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&APPID=' + APPIPKEY + '&format=js', function (foreCast) {
            console.log(latitude + " " + longitude); //Show current coordinate on console
            console.log(foreCast); //Show current weather on console
            L.popup()
                .setLatLng(eventMap.latlng)
                .setContent(
                    // "<strong>Address : " + address.results[0].formatted_address + "</strong><br>" +
                    "<strong>Address :</strong> " + foreCast.name + "<br>"
                    + "<strong>Location :</strong> " + foreCast.coord.lon + ", " + foreCast.coord.lat + "<br>"
                    + "<strong>Temperature :</strong> " + (foreCast.main.temp - 273.15).toPrecision(2) + "&deg;C <br>"
                    + "<strong>Humidity :</strong> " + foreCast.main.humidity + "% <br>"
                    + "<strong>Pressure :</strong> " + foreCast.main.pressure + " hPa<br>"
                    + "<strong>Wind speed :</strong> " + foreCast.wind.speed + " m/s <br>"
                    + "<strong>Clouds :</strong> " + foreCast.clouds.all + "% <br>"
                    + "<a class='show-more' href='#' onclick='onShowMoreListener() ' title='Show more weather'><b>Show more</b></a>" + "<span><a class='show-less' href='#' onclick='onShowLessListener()' title='Show less weather'><b>Show less</b></a></span>"
                )
                .openOn(map)
        });
        // });

            showMore(latitude, longitude);
        if ($(".foreCast").hide()) {
            $(".show-more").show();
            $(".show-less").hide();
        } else{

            $(".show-more").hide();
            $(".show-less").show();
        }

    });

    let mapMarkers = [];
    let x = document.getElementById("btnlocal");
    let myLocation = function getLocation(map) {

        function success(position) {

            // use geolocation getting latitude and longitude

            if (navigator.geolocation) {
                // navigator.geolocation.getCurrentPosition(showPosition);
                let latitude = position.coords.latitude; // vi do
                let longitude = position.coords.longitude; // kinh do
                console.log("Latitude: " + position.coords.latitude +
                    " Longitude: " + position.coords.longitude);
                map.panTo(new L.LatLng(latitude, longitude));

                //Use getJSon to bath OpenWeatherApp Current API on my JS

                // $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true', function (address) {
                //     console.log(address.results[0].formatted_address);
                $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + APPIPKEY, function (result) {
                    console.log(result);
                    let content = "";
                    // content += "<strong>Address : " + address.results[0].formatted_address + "</strong><br>";
                    content += "<strong>Address :</strong> " + result.name + "<br>";
                    content += "<strong>Location :</strong> " + result.coord.lon + ", " + result.coord.lat + "<br>";
                    content += "<strong>Temperature :</strong> " + (result.main.temp - 273.15).toPrecision(2) + "&deg;C <br>";
                    content += "<strong>Humidity :</strong> " + result.main.humidity + "% <br>";
                    content += "<strong>Pressure :</strong> " + result.main.pressure + " hPa<br>";
                    content += "<strong>Wind speed :</strong> " + result.wind.speed + " m/s <br>";
                    content += "<strong>Clouds :</strong> " + result.clouds.all + "% <br>";
                    content += "<a class='show-more' href='#' onclick='onShowMoreListener() ' title='Show more weather'><b>Show more</b></a>" + "<span><a class='show-less' href='#' onclick='onShowLessListener()' title='Show less weather'><b>Show less</b></a></span>";

                    // use marker to mark the location on the map

                    let marker = L.marker([latitude, longitude], {icon: markerIcon}).addTo(map)
                        .bindPopup(content).openPopup(); // Popup display at mark position
                    mapMarkers.push(marker);

                });
                // });

                    showMore(latitude, longitude);

            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        navigator.geolocation.getCurrentPosition(success);//take out the current location

    };
    document.getElementById("btnlocal").onclick = function () {
        myLocation(map);
        map.setZoom(10);

    };
    //all Search
    var searchBox = new L.Control.Search({
        url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat', 'lon'],
        autoCollapse: true,
        autoType: false,
        minLength: 2
    });

    map.addControl(searchBox);

    searchBox.on('search:locationfound', function (e) {
        var locLat = e.latlng.lat;
        var locLng = e.latlng.lng;
        //console.log(locLat + ', ' + locLng);
        //var mark = L.marker([locLat, locLng], {icon: markerIcon}).addTo(map);

        // load current weather from openweathermap api
        var rss;
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + locLat + ',' + locLng + '&sensor=true', function (da) {
            rss = da.results[0].formatted_address;
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + locLat + "&lon=" + locLng + "&appid=" + APPIPKEY, function (data) {
                let content = "";
                content += "<strong>Address :</strong> " + rss + "<br>";
                content += "<strong>Location :</strong> " + data.coord.lon + ", " + data.coord.lat + "<br>";
                content += "<strong>Temperature :</strong> " + (data.main.temp - 273.15).toPrecision(2) + "&deg;C <br>";
                content   += "<strong>Humidity :</strong> " + data.main.humidity + "% <br>";
                content   += "<strong>Pressure :</strong> " + data.main.pressure + " hPa<br>";
                content   += "<strong>Wind speed :</strong> " + data.wind.speed + " m/s <br>";
                content   += "<strong>Clouds :</strong> " + data.clouds.all + "% <br>";
                content   += "<a id='show-more' onclick='onShowMoreListener()'>Show more</a>";

                // var contentMarker = '';
                // contentMarker += "<b>" + rss + "</b>" + "<br>";
                // contentMarker += "Tốc độ gió : " + data.wind.speed + " m/s<br>";
                // contentMarker += " Nhiệt độ : " + (data.main.temp - 273.15 ).toPrecision(2) + " °C<br>";
                // contentMarker += " Độ ẩm : " + data.main.humidity + " %<br>";
                // contentMarker += " Áp suất : " + data.main.pressure + " hpa<br>";
                // contentMarker += " Mây : " + data.clouds.all + " %<br>";
                // contentMarker += "Sóng : " + data.clouds.all + " %<br>";
                // contentMarker += "<a href='#' class='showmore' lat='" + locLat + "' lon='" + locLng + "'>Show more</a>";

                // clearMarker(mapMarkers);/
                // var marker = L.marker([locLat, locLng], {icon: markerIcon}).addTo(map)
                //     .bindPopup(contentMarker).openPopup();
                // mapMarkers.push(marker);

                let marker =L.marker([locLat, locLng],{icon: markerIcon}).addTo(map)
                    .bindPopup(content).openPopup(); // Popup display at mark position
                mapMarkers.push(marker);
            });
            $.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=" + locLat + "&lon=" + locLng + "&appid=" + APPIPKEY, function (forestcast) {
                console.log(forestcast.list);
                let lengthThis = $(forestcast.list).length;
                function getDate(currentDate) {
                    let date = new Date(currentDate * 1000); // Change currentDate from milliseconds to seconds
                    let local = date.toString(); // Get day and full time, example: Fri Aug 10 2018 10:01:32 GMT+0700 (Indochina Time)
                    let lastColonIndex = local.lastIndexOf(':'); //Find the last index of colon
                    local = local.substring(0, lastColonIndex + 3); // Get day and time, example: Fri Aug 10 2018 10:01:32
                    let newDay = new Date(local);
                    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    return weekdays[newDay.getDay()]; // Get day of week
                }
                function getTime(currentDate) {
                    let date = new Date(currentDate * 1000); // Change currentDate from milliseconds to seconds
                    let local = date.toString();
                    let lastColonIndex = local.lastIndexOf(':');
                    local = local.substring(0, lastColonIndex + 3);
                    let newDay = new Date(local);
                    return newDay.getHours(); //Get time
                }
                $('.afterdel').remove(); //Sure that have none class "afterdel"
                let colstart = 1;
                let classtd = '';
                let j;
                let firstDay;
                let secondDay;
                for (i = 0; i < lengthThis; i++) {
                    // if (i == lengthThis -1) {
                    //     j = i;
                    // } else{
                    //     j = i + 1;
                    // }
                    j = (i == lengthThis - 1) ? i : (i + 1);
                    firstDay = getDate(forestcast.list[i].dt); //Time of data calculation, unix, UTC: forestcast.list[i].dt
                    secondDay = getDate(forestcast.list[j].dt);
                    if (firstDay != secondDay || i == (lengthThis - 1)) {
                        $('#day').append("<td class='afterdel' colspan='" + colstart + "'>" + getDate(forestcast.list[i].dt) + "</td>");
                        colstart = 1;
                    } else {
                        colstart++;
                    }
                    if (firstDay == secondDay) {
                        classtd = '';
                    } else {
                        classtd = 'endday';
                    }
                    $('#iconweather').append("<td class='afterdel " + classtd + "'><img  src='http://openweathermap.org/img/w/" + forestcast.list[i].weather[0].icon + ".png'  width='25px' height='25px'>" + "</td>");
                    $('#time').append("<td class='afterdel " + classtd + "'>" + getTime(forestcast.list[i].dt) + "</td>");
                    $('#temp').append("<td class='afterdel " + classtd + "'>" + (forestcast.list[i].main.temp - 273.15).toPrecision(2) + "&deg;" + "</td>");
                    $('#wind').append("<td class='afterdel " + classtd + "'>" + Math.round(forestcast.list[i].wind.speed) + "</td>");
                    $('#humidity').append("<td class='afterdel " + classtd + "'>" + Math.round(forestcast.list[i].main.humidity) + "</td>");
                }
            });
        });

    });


}

function showMore(latitude, longitude) {
    //Use getJSon to bath OpenWeatherApp 5 day weather forecast API on my JS
    $.getJSON("https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APPIPKEY, function (forecastResult) {
        console.log('5 day weather forecast: ');
        console.log(forecastResult.list);
        let lengthThis = $(forecastResult.list).length;

        function getDate(currentDate) {
            let date = new Date(currentDate * 1000); // Change currentDate from milliseconds to seconds
            let local = date.toString(); // Get day and full time, example: Fri Aug 10 2018 10:01:32 GMT+0700 (Indochina Time)
            let lastColonIndex = local.lastIndexOf(':'); //Find the last index of colon
            local = local.substring(0, lastColonIndex + 3); // Get day and time, example: Fri Aug 10 2018 10:01:32
            let newDay = new Date(local);
            let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            return weekdays[newDay.getDay()]; // Get day of week
        }

        function getTime(currentDate) {
            let date = new Date(currentDate * 1000); // Change currentDate from milliseconds to seconds
            let local = date.toString();
            let lastColonIndex = local.lastIndexOf(':');
            local = local.substring(0, lastColonIndex + 3);
            let newDay = new Date(local);
            return newDay.getHours(); //Get time
        }


        $('.afterdel').remove(); //Sure that have none class "afterdel"
        let colstart = 1;
        let classtd = '';
        let j;
        let firstDay;
        let secondDay;
        for (i = 0; i < lengthThis; i++) {

            // if (i == lengthThis -1) {
            //     j = i;
            // } else{
            //     j = i + 1;
            // }

            j = (i == lengthThis - 1) ? i : (i + 1);
            firstDay = getDate(forecastResult.list[i].dt); //Time of data calculation, unix, UTC: forestcast.list[i].dt
            secondDay = getDate(forecastResult.list[j].dt);
            if (firstDay != secondDay || i == (lengthThis - 1)) {
                $('#day').append("<td class='afterdel' colspan='" + colstart + "'>" + getDate(forecastResult.list[i].dt) + "</td>");
                colstart = 1;
            } else {
                colstart++;
            }
            if (firstDay == secondDay) {
                classtd = '';
            } else {
                classtd = 'endday';
            }
            $('#iconweather').append("<td class='afterdel " + classtd + "'><img  src='http://openweathermap.org/img/w/" + forecastResult.list[i].weather[0].icon + ".png'  width='25px' height='25px'>" + "</td>");
            $('#time').append("<td class='afterdel " + classtd + "'>" + getTime(forecastResult.list[i].dt) + "</td>");
            $('#temp').append("<td class='afterdel " + classtd + "'>" + (forecastResult.list[i].main.temp - 273.15).toPrecision(2) + "&deg;" + "</td>");
            $('#wind').append("<td class='afterdel " + classtd + "'>" + Math.round(forecastResult.list[i].wind.speed) + "</td>");
            $('#humidity').append("<td class='afterdel " + classtd + "'>" + Math.round(forecastResult.list[i].main.humidity) + "</td>");

        }

    });


}

function onShowMoreListener() {
        $(".foreCast").show();
        $(".show-more").hide();
        $(".show-less").show();

}
function onShowLessListener() {
        $(".foreCast").hide();
        $(".show-more").show();
        $(".show-less").hide();
}
