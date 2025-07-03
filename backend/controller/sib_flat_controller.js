import SIBValuationFlat from "../models/flat_sib_model";

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