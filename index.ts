import express from "express";
import mongoose from "mongoose";
import { mongoURL, privateKey } from "./config.json";
import keyModel from "./schemas/key";
var auth = express();
var port = 8080;

mongoose.connect(mongoURL)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Error: ', err));

auth.listen(port, () => {
    console.log(`API is now ready`);
});

auth.get("/", (req: any, res: any) => {
    res.json({ msg: "Auth System made by SexyPotato. All rights reserved" });
});

auth.get("/api/v1/license", (req: any, res: any) => {
    var key = req.query.key;
    var hwid = req.query.hwid;

    if(!key) return res.json({ msg: "No key provided", success: false });
    if(!hwid) return res.json({ msg: "No hwid provided", success: false });

    keyModel.findOne({ key: key }, async(err: any, data: any) => {
        if(err) throw err;
        if(!data) return res.json({ msg: "Key not found", success: false });
        if(hwid !== data.hwid) return res.json({ msg: "HWID not matching", success: false });
        res.json({ msg: "Logged in", success: true });
    })
})

auth.get("/api/v1/create", (req: any, res: any) => {
    var prvkey = req.query.privatekey;
    var key = req.query.key;
    var hwid = req.query.hwid;

    if(!prvkey) return res.json({ msg: "No private key provided", success: false });
    if(!key) return res.json({ msg: "No key provided", success: false });
    if(!hwid) return res.json({ msg: "No hwid provided", success: false });

    if(prvkey !== privateKey) return res.json({ msg: "Invalid private key provided", success: false });
    var check = keyModel.findOne({ key: key })
    if(check) return res.json({ msg: "Key already exist", success: false });
    new keyModel({
        key: key,
        hwid: hwid
    }).save()
    .then(() => {
        res.json({ msg: "Key created", success: true, key: key, hwid: hwid })
    })
})

auth.get("/api/v1/delete", (req: any, res: any) => {
    var prvkey = req.query.privatekey;
    var key = req.query.key;
    var hwid = req.query.hwid;

    if(!prvkey) return res.json({ msg: "No private key provided", success: false });
    if(!key) return res.json({ msg: "No key provided", success: false });

    if(prvkey !== privateKey) return res.json({ msg: "Invalid private key provided", success: false });
    keyModel.findOne({ key: key }, async(err: any, data: any) => {
        if(err) throw err;
        if(!data) return res.json({ msg: "Key not found", success: false });
        data.delete()
        res.json({ msg: "Key deleted", success: true });
    })
})

/*
 @ Auth System
 @ By: Sexy Potato
*/
