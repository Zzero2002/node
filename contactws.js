const express = require("express");
const bodyParser=require("body-parser");
const fs = require("fs");
const app = express();
const formparser = bodyParser.urlencoded();

var contact = [];
var empindex = 0;
loadcontact()
function loadcontact(){
    fs.readFile("db.txt",function(err,data){
        contact = JSON.parse(data);
        let maxid = 0;
        for(let conts of contact){
            if(conts && conts.id > maxid){
                maxid=conts.id;
            }
            maxid++
            empindex =maxid
        }
    })
}
function savecontfile() {

    fs.writeFile("db.txt",JSON.stringify(contact),function () {  })
  }

let contactindex = contact.length;


app.post("/addcontact",formparser,function(req,res){
    req.body.id = contactindex++;
    contact.push(req.body);
    savecontfile();
    res.send({msg: "contact added"})
})

app.get("/contacts",function(req,res){
    if(req.query.name==undefined)req.query.name ="";

    let filtercont = contact.filter(conty=>conty && conty.name.indexOf(req.query.name)>-1)
    res.send(filtercont);
})


app.get("/deletecontact",function(req,res){

    let contactindex = contact.findIndex(cont=>cont && cont.id==req.query.id);

    // contact.splice(contactindex,1);
    savecontfile();
    delete contact[contactindex];

    res.send({msg:"contact deleted"})
})


app.post("/editcontact",formparser,function(req,res){
    savecontfile();
   let cont =  contact.find(conty=>conty && conty.id==req.body.id);

   cont.name = req.body.name;
   cont.email = req.body.email;
   cont.tel = req.body.tel;

    res.send({msg:"emp edited"})
})


app.get("/getcontacts",function(req,res){
    let cont = contact.find(cons=>cons && cons.id==req.query.id);
    res.send(cont)
})




app.listen(9090);