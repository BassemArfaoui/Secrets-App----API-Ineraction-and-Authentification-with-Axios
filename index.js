import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));



//get request to the home page
app.get("/", (req, res) => {
  res.render("index.ejs");
});



//get request to the register page
app.get("/register", (req,res)=>
{
  res.render("register.ejs");
})



//posting the data of registration
app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.username && req.body.password) {
      const user = req.body.username;
      const password= req.body.password;
      const response = await axios.post(
        API_URL+'register', 
        {
          username:user,
          password:password
        }
      );
      const result= response.data;
      console.log(result);
      res.render("register.ejs", { data: "Successfully registred" });
    }

    else {
      res.render("register.ejs", { data_error: "Please fill all the fields" });
    }

  } catch (error) {
    console.error("Failed to make request:", error.message);
    let err = "";
    if (error.message.includes("404")) {
      err = "Result not found";
    } else if (error.message.includes("429")) {
      err = "Too many requests, please retry after some time"; 
    }else if (error.message.includes("401")) {
      err = "Username unavailable";
    }
     else {
      err = error.message;
    }
    res.render("register.ejs", {
      data_error: err,
    });
  }
});



//get request to the generate key page
app.get("/generate", (req, res)=>
{
  res.render("generate-key.ejs");
})



//posting the generate request to get a key
app.post("/generate",async (req,res)=>{
  try{
    const response = await axios.get(API_URL+'generate-api-key');
    const result= response.data;
    console.log(result);
    res.render("generate-key.ejs", { message:'Your API Key is : ' + result.apiKey});
  }catch(error){
    let err="";
    if (error.message.includes("401")) {
      err = "Unauthorized";
    }
    else if (error.message.includes("404")) {
      err = "Result not found";
    }
    else if (error.message.includes("429")) {
      err = "Too many requests , Try again later";
    }
    else{
      err=error.message;
    }
    res.render("generate-key.ejs", { message:'Error: ' + err });
  }
})



//get request to the generate token page
app.get("/token", (req, res)=>
{
  res.render("generate-token.ejs");
})



//posting the generate info to get a key
app.post("/token" , async (req , res)=>{
  console.log(req.body);
  try{
    if(req.body.password && req.body.username){
      const password= req.body.password;
      const user = req.body.username;
      const response = await axios.post(
        API_URL+'get-auth-token',
        {
          username:user,
          password:password
        }
      );
      const result= response.data;
      console.log(result);
      res.render("generate-token.ejs", { result:'Your token is : '+ result.token});
    }
    else{
      res.render("generate-token.ejs", { result_error:'Please fill all the fields' });
    }

  }catch(error){
    let err="";
    if (error.message.includes("401")) {
      err = "Wrong password";
    }
    else if (error.message.includes("404")) {
      err = "Account doesn't exist";
    }
    else{
      err=error.message;
    }
    res.render("generate-token.ejs", { result_error:err});
  }
})

const response = await axios.get(API_URL+'random');
const result= response.data;


app.get("/noAuth",async (req, res) => {
  try{
    const response = await axios.get(API_URL+'random');
    const result= response.data;
    console.log(result);
    res.render("index.ejs", { content: result });
  }catch(error){
    let err="";
    if (error.message.includes("401")) {
      err = "Unauthorized";
    }
    else if (error.message.includes("404")) {
      err = "Result not found";
    }
    else if (error.message.includes("429")) {
      err = "Too many requests , Try again later";
    }
    else{
      err=error.message;
    }
    res.render("index.ejs", { error:err});
  }

  

});


//get request to the basic auth service
app.get("/basicAuth",(req, res) => {
    res.render("index.ejs", { condition:true });
});

//post request for selecting page service 
app.post("/basicAuth",async (req, res) => {
  console.log(req.body);
  try{
    if(req.body.username && req.body.password && req.body.page){
      const user = req.body.username;
      const password= req.body.password;
      let page =(req.body.page);
      console.log(page);
      const response = await axios.get(API_URL+`all?page=${page}`,{
        auth: {
          username: user,
          password: password,
        },
      });
      const result= response.data;
      console.log(result);
      res.render("index.ejs", { secrets: result , page:page});
    }
    else{
      res.render("index.ejs", { notif: "Please fill all the fields" ,condition:true});
    }

  }catch(error){
    let err="";
    if (error.message.includes("401")) {
      err = "Wrong password or username";
    }
    else if (error.message.includes("404")) {
      err = "Result not found";
    }
    else if (error.message.includes("429")) {
      err = "Too many requests , Try again later";
    }
    else{
      err=error.message;
    }
    res.render("index.ejs", { condition:true ,notif:err });
  }
})


//get request to the filtering service (with api)  
app.get("/apikey",(req, res) => {
  res.render("index.ejs", { show:true });
});



//post request for the filtering service (with api) 
app.post("/apikey",async (req, res) => {
  console.log(req.body);
  try{
    if(req.body.apikey && req.body.level){
      let apiKey =(req.body.apikey);
      let level =(req.body.level);
      console.log(level);
      const response = await axios.get(API_URL+`filter?score=${level}&apiKey=${apiKey}`);
      const result= response.data;
      console.log(result);
      res.render("index.ejs", { output: result, score:level});
    }
    else{
      res.render("index.ejs", { notif: "Please fill all the fields", show:true});
    }

  }catch(error){
    let err="";
    if (error.message.includes("401")) {
      err = "Unvalid or expired API Key";
    }
    else if (error.message.includes("404")) {
      err = "No match for your filter";
    }
    else if (error.message.includes("429")) {
      err = "Too many requests , Try again later";
    }
    else{
      err=error.message;
    }
    res.render("index.ejs", { show:true, notif:err });
  }
})



app.get("/bearerToken", (req, res) => {

  res.render("index.ejs",{show_buttons:true});
});

app.post("/bearerToken", async (req, res) => {
  console.log(req.body);
  try {
    if(req.body.btns==="ID")
    {
      res.render("index.ejs", { show_id: true });
    }

    else if(req.body.btns==="add")
    {
      
      res.render("index.ejs", { show_add: true });
    }

    else if(req.body.btns==="put")
    {
      
      res.render("index.ejs", { show_put: true });
    }


    else if(req.body.btns==="delete")
    {
      
      res.render("index.ejs", { show_delete: true });
    }

    else if(req.body.secret && req.body.token2 &&req.body.score) {
      const secret=req.body.secret;
      const token=req.body.token2;
      const score=req.body.score;
      const response = await axios.post(API_URL+'secrets',
      { 
        secret:secret,
        score:score
      } 
      ,
      {
        headers: 
        {
          Authorization: `Bearer ${token}`
        }
      }
      );

      const result= response.data;
      console.log(result);
      res.render("index.ejs", { added_secret:result, add_message:'Secret added successfully' });
    }

    else if(req.body.id && req.body.token) {
      const id= req.body.id;
      const token=req.body.token;
      const response = await axios.get(API_URL+`secrets/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result= response.data;
      res.render("index.ejs", { result_id: result, id:id });
    }


    else if(req.body.put_secret && req.body.put_token &&req.body.put_score && req.body.put_id) {
      const secret=req.body.put_secret;
      const token=req.body.put_token;
      const score=req.body.put_score;
      const id=req.body.put_id;
      const response = await axios.put(API_URL+`secrets/${id}`,
      { 
        secret:secret,
        score:score
      } 
      ,
      {
        headers:
        {
          Authorization: `Bearer ${token}`
        }
      }
      );
      const result= response.data;
      console.log(result);
      res.render("index.ejs", { puted_secret:result, put_message:'Secret Edited successfully' });
    }


    else if(req.body.delete_id && req.body.delete_token) {
      const id= req.body.delete_id;
      const token=req.body.delete_token;
      const response = await axios.delete(API_URL+`secrets/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result= response.data;
      res.render("index.ejs", { show_delete: true ,delete_message: result.message });
    }









    else if(req.body.id==='' || !req.body.token==='') {
      res.render("index.ejs", { show_id:true , id_error:"Please fill all the fields" });
    }

    else if(req.body.secret==='' || req.body.token2==='' || req.body.score==='') {
      res.render("index.ejs", { show_add:true , add_error:"Please fill all the fields" });

    }

    else if(req.body.put_secret==='' || req.body.put_token==='' || req.body.put_score===''  || req.body.put_put_id==='' ) {
      res.render("index.ejs", { show_put:true , put_error:"Please fill all the fields" });

    }

    else if(req.body.delete_id==='' || req.body.delete_token==='') {
      res.render("index.ejs", { show_delete:true , put_error:"Please fill all the fields" });

    }

   
    else 
    {
      res.render("index.ejs");
    }

    


  } catch (error) {
    let err="";
    if (error.message.includes("401")) {
      err = "Unvalid or expired Bearer Token";
    }
    else if (error.message.includes("404")) {
      err = "No Secret with the given ID";
    }
    else if (error.message.includes("429")) {
      err = "Too many requests , Try again later";
    }
    else{
      err=error.message;
    }
    

    if(req.body.secret && req.body.token2 &&req.body.score)  res.render("index.ejs", { show_add:true, add_error:err });
    else if(req.body.id && req.body.token) res.render("index.ejs", { show_id:true, id_error:err });
    else if(req.body.put_secret && req.body.put_token &&req.body.put_score && req.body.put_id) res.render("index.ejs", { show_put:true, put_error:err });
    else if(req.body.delete_id && req.body.delete_token) res.render("index.ejs", { show_delete:true, delete_error:err });
    else res.render("index.ejs");
    

  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
