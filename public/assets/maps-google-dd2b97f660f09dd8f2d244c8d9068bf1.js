var MapsGoogle=function(){var o=function(){new GMaps({div:"#gmap_basic",lat:-12.043333,lng:-77.028333})},t=function(){var o=new GMaps({div:"#gmap_marker",lat:-51.38739,lng:-6.187181});o.addMarker({lat:-51.38739,lng:-6.187181,title:"Lima",details:{database_id:42,author:"HPNeo"},click:function(o){console.log&&console.log(o),alert("You clicked in this marker")}}),o.addMarker({lat:-12.042,lng:-77.028333,title:"Marker with InfoWindow",infoWindow:{content:'<span style="color:#000">HTML Content!</span>'}}),o.setZoom(5)},n=function(){var o=new GMaps({div:"#gmap_polylines",lat:-12.043333,lng:-77.028333,click:function(o){console.log(o)}});path=[[-12.044012922866312,-77.02470665341184],[-12.05449279282314,-77.03024273281858],[-12.055122327623378,-77.03039293652341],[-12.075917129727586,-77.02764635449216],[-12.07635776902266,-77.02792530422971],[-12.076819390363665,-77.02893381481931],[-12.088527520066453,-77.0241058385925],[-12.090814532191756,-77.02271108990476]],o.drawPolyline({path:path,strokeColor:"#131540",strokeOpacity:.6,strokeWeight:6})},e=function(){var o=new GMaps({div:"#gmap_geo",lat:-12.043333,lng:-77.028333});GMaps.geolocate({success:function(t){o.setCenter(t.coords.latitude,t.coords.longitude)},error:function(o){alert("Geolocation failed: "+o.message)},not_supported:function(){alert("Your browser does not support geolocation")},always:function(){}})},a=function(){var o=new GMaps({div:"#gmap_geocoding",lat:-12.043333,lng:-77.028333}),t=function(){var t=$.trim($("#gmap_geocoding_address").val());GMaps.geocode({address:t,callback:function(t,n){if("OK"==n){var e=t[0].geometry.location;o.setCenter(e.lat(),e.lng()),o.addMarker({lat:e.lat(),lng:e.lng()}),Metronic.scrollTo($("#gmap_geocoding"))}}})};$("#gmap_geocoding_btn").click(function(o){o.preventDefault(),t()}),$("#gmap_geocoding_address").keypress(function(o){var n=o.keyCode?o.keyCode:o.which;"13"==n&&(o.preventDefault(),t())})},i=function(){{var o=new GMaps({div:"#gmap_polygons",lat:-12.043333,lng:-77.028333}),t=[[-12.040397656836609,-77.03373871559225],[-12.040248585302038,-77.03993927003302],[-12.050047116528843,-77.02448169303511],[-12.044804866577001,-77.02154422636042]];o.drawPolygon({paths:t,strokeColor:"#BBD8E9",strokeOpacity:1,strokeWeight:3,fillColor:"#BBD8E9",fillOpacity:.6})}},l=function(){var o=new GMaps({div:"#gmap_routes",lat:-12.043333,lng:-77.028333});$("#gmap_routes_start").click(function(t){t.preventDefault(),Metronic.scrollTo($(this),400),o.travelRoute({origin:[-12.044012922866312,-77.02470665341184],destination:[-12.090814532191756,-77.02271108990476],travelMode:"driving",step:function(t){$("#gmap_routes_instructions").append("<li>"+t.instructions+"</li>"),$("#gmap_routes_instructions li:eq("+t.step_number+")").delay(800*t.step_number).fadeIn(500,function(){o.setCenter(t.end_location.lat(),t.end_location.lng()),o.drawPolyline({path:t.path,strokeColor:"#131540",strokeOpacity:.6,strokeWeight:6})})}})})};return{init:function(){o(),t(),e(),a(),n(),i(),l()}}}();