import SIBValuationFlat from "../models/flat_sib_model.js";

import mongoose from "mongoose";

export const saveFlatData = async(req,res)=>{

    console.log('A post req recieved');
    console.log(req.body);

    const flatData=req.body;
    flatData.typo='sibFlat';

    let imagesMeta = [];
        try {
            imagesMeta = JSON.parse(flatData.images);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Invalid images metadata format"
            });
        }
    
    flatData.images=[];
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
        flatData.images.push(imageData);
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Please add at least one image" 
      });
    }

    const newFlatData=new SIBValuationFlat(flatData);
    try{
        await newFlatData.save();
        res.status(201).json({status:true,data:newFlatData})
    }
    catch(err)
    {
        res.status(500).json({status:false,message:"Server err in creating"})
    }

}

export const getNearbyFlat = async(req,res)=>{

  console.log("A nearby Search received")
  const {latitude,longitude} = req.body
  const lat1=latitude;
  const lon1=longitude;

  console.log(lat1,lon1)
  let dis=100000;
  const responseData=[];

  const cursor=SIBValuationFlat.find()

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
