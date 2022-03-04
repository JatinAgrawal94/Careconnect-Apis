const express=require('express');
const mapRouter=express();
const {getLocation}=require('../Queryfunctions/map');

mapRouter.get('/distance',async(req,res)=>{
    getLocation()
    var origin={
      lat:"22.307685199442744",
      lon:"73.17754902422645"
    };

    var destination={
      lat:"22.30078276005401",
      lon:"73.16911778189652"
  };
    var time=await getDistance(origin,destination);
    res.send(time);
});

module.exports=mapRouter;
