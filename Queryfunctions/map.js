const axios=require('axios');

async function getDistance(origin,destination){
    try{  
        const r=await axios.get(`https://router.hereapi.com/v8/routes?destination=${destination.lat},${destination.lon}&origin=${origin.lat},${origin.lon}&return=polyline&transportMode=car&spans=names&apiKey=${process.env.HERE_API_KEY}`)
        .then(res=>{
          let data=res.data.routes[0].sections[0];
          let result=calculateTime(data.arrival.time,data.departure.time);
          return result;
        }).catch(res=>{
          console.log(res);
        })
        return r;
        // console.log(r);
      }catch(err){
        console.log("This is error");
        return "Error getting time";
      }
}

function calculateTime(arrival,departure){
    var time1=arrival.split('T')[1].split('+')[0].split(':');
    var time2=departure.split('T')[1].split('+')[0].split(':');
    let hour=Math.abs(time1[0]-time2[0]);
    let min=Math.abs(time1[1]-time2[1]);
    let sec=Math.abs(time1[2]-time2[2]);
    return `${hour}h ${min}m ${sec}sec`;
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
  
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}

module.exports={
    getDistance,getLocation,showPosition
}