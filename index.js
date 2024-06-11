// 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' -u root -p 
//=> ye commond hai jisse terminal me hm database se intract kr sakte hain




const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:'Mysql@5304',
  });
  

 //inereting new data 

// 1. single data insert
 /*
let q = "INSERT INTO user(id, username, email, password) VALUES (?,?,?,?)";
let user = ["123","123_newuser","abc@gmail.com","abc"]*/


// 2. multiple data insert

/*let q = "INSERT INTO user(id, username, email, password) VALUES ?";
let users = [["123b","123_newuserb","abc@gmail.comb","abcb"],
             ["123c","123_newuserc","abc@gmail.comc","abcc"]]*/

let getRandomUser = ()=> {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };             

/*let q = "INSERT INTO user(id, username, email, password) VALUES ?";

let data =[];
for(let i=1; i<=100; i++){
    data.push(getRandomUser());
}


// connection.query("SHOW TABLES", (err, result) => {    =>is line ko dusre tarika se bhi likh sakte hain
//connection.query(q,user, (err, result) => {            =>jab   single data insert krna ho tab
//connection.query(q,[users], (err, result) => {       //=> multiple data insert krna ho tab 


try{
    connection.query(q,[data], (err, result) => {         
    if(err) throw err;
    console.log(result);
});
}catch(err){
    console.log(err);
}

connection.end();*/


app.get("/",(req,res)=>{
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q, (err, result) => {         
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
});


//show route

app.get("/user",(req,res)=>{
    let q = `SELECT * FROM user`;

    try{
        connection.query(q, (err, users) => {         
        if(err) throw err;
        res.render("showusers.ejs",{users});
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
});


app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result) => {         
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs",{user});
        
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
});

//UPDATE ROUTE

app.patch("/user/:id",(req,res)=>{
    let {id} = req.params; 
    let {password: formPass, username:newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result) => {         
        if(err) throw err;
        let user = result[0];
        if(formPass!= user.password)
        {
        res.send("wrong password");
        }
        else{
            let q2 = `UPDATE user SET username = '${newUsername}' WHERE id ='${id}'`;
            connection.query(q2,(err, result)=>{
                if(err) throw err;
                res.redirect("/user");
            });
        }
       // res.send(user);
        
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
});
  
//create new user

app.get("/user/newUser",(req,res)=>{
    res.render("newUser.ejs");
});

app.post("/user",(req,res)=>{
    let { id, username, email, password } = req.body;
    let q = `INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)`;
    try{
        connection.query(q, [id, username, email, password], (err, result) => {         
        if(err) throw err;
        res.redirect("/user");
        
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
})


//delete user

app.get("/user/:id/delete",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try{
        connection.query(q, (err, result) => {         
        if(err) throw err;
        let user = result[0];
        res.render("delete.ejs",{user});
        
    });
    }catch(err){
        console.log(err);
        console.log("some error in database");
    }
});


app.delete("/user/:id",(req,res)=>{
    let {id} = req.params;
    let {email:formEmail, password:FormPassword} = req.body;
    let q = `SELECT * FROM user WHERE id= '${id}'`;

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(formEmail != user.email && FormPassword != user.password){
                res.send("wrong email or password");
            }
            else{
                let q2 = `DELETE FROM user WHERE id = '${id}'`;
                connection.query(q2,(err, result)=>{
                    if(err) throw err;
                    res.redirect("/user");
                });
            }

        })
    }catch(err){
        console.log(err);
        console.log("someerror on database");
    }
});

app.listen(port,()=>{
    console.log(`server is listening to port ${port}`);
});


  