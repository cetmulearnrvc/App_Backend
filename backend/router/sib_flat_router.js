import express from "express";
const flat_router=express.Router();
import { saveFlatData } from "../controller/sib_flat_controller.js";
import upload from "../multer/upload.js";
import { getNearbyFlat } from "../controller/sib_flat_controller.js";
// import { searchByDate, searchByFileNo } from "../controller/search.controller.js";

flat_router.post("/flat/savepdf", upload.array("images") ,saveFlatData)

flat_router.post("/flat/getnearby",getNearbyFlat)

// pvr1_router.post("/pvr1/getByDate",searchByDate)

// pvr1_router.post("/pvr1/getByFile",searchByFileNo);

export default flat_router;