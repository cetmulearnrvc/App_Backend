import pvr1 from "../models/pvr1_model.js";
import mongoose from "mongoose";

export const savePVR1Data = async(req,res)=>{

    console.log("A post req received");
    console.log(req.body); 
    
    const pvr1Data=req.body;
    pvr1Data.typo="pvr1"
    if(!pvr1Data.valuerName || !pvr1Data.valuationCode || !pvr1Data.fileNo || !pvr1Data.applicantName || !pvr1Data.ownerName || !pvr1Data.propertyLocation )
    {
        
        return res.status(400).json({success:false,message:"please enter all fields"})
    }

    let imagesMeta = [];
        try {
            imagesMeta = JSON.parse(pvr1Data.images);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid images metadata format"
            });
        }


     pvr1Data.images = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const meta = imagesMeta[i] || {};
        

        const imageData = {
          fileName: file.filename,
          filePath: file.path,
          latitude: meta.latitude ? parseFloat(meta.latitude) : null,
          longitude: meta.longitude ? parseFloat(meta.longitude) : null
        };

        console.log(imageData.latitude)
        pvr1Data.images.push(imageData);
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Please add at least one image" 
      });
    }

    const newPVR1Data=new pvr1(pvr1Data);
    try{
        await newPVR1Data.save();
        res.status(201).json({status:true,data:newPVR1Data})
    }
    catch(err)
    {
        res.status(500).json({status:false,message:"Server err in creating"})
    }
}

export const getNearbyPVR1 = async(req,res)=>{

  console.log("A nearby Search received")
  const {latitude,longitude} = req.body
  const lat1=latitude;
  const lon1=longitude;

  console.log(lat1,lon1)
  let dis=100000;
  const responseData=[];

  const cursor=pvr1.find()

  for await(const doc of cursor)
  {   
      doc.images.forEach((img, index) => {

  if (img.latitude && img.longitude) {

    const lat2=parseFloat(img.latitude);
    const lon2=parseFloat(img.longitude);
    
    dis=haversineDistance(lat1,lon1,lat2,lon2)
    

    if (dis <= 1) {
        responseData.push({
          distance:dis,
          latitude:lat2,
          longitude:lon2,
          marketValue:doc.marketValue || 0
        });
      }
    
  }
  }); 
  }

  console.log(responseData)

  return res.status(200).json(responseData)
  
}



function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in km
}
