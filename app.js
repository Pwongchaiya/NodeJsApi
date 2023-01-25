const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")
const app = express()

app.use(express.static("html"))
app.use(bodyParser.urlencoded({extended:true}))

app.listen(process.env.PORT || "3000", function () { 
    console.log("Listening on port 8080")
 })

 app.get("/", function (req,res) { 
    res.sendFile(__dirname+"/html/signup.html")
  })

app.post("/redirect", function (req,res) { 
    res.redirect("/")
 })

app.post("/", function (req, res) { 
    const qry = req.body

    const data = {
        members: [
            {
                email_address: qry.email,
                status: "subscribed",
                merge_fields:{
                    FNAME: qry.firstname,
                    LNAME: qry.lastname,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data)

    const url = "https://us13.api.mailchimp.com/3.0/lists/idkey"
    const options = {
        method: "POST",
        auth: "pwongchaiya:apikey"

    }
    
    const request = https.request(url, options, function (response) { 
        makeCall(res,response)
     })

     request.write(jsonData)
     request.end()
 })

 function makeCall(res,response) {
        const status = response.statusCode
        if (status == 200) {
            res.sendFile(__dirname+"/html/success.html")
        }else{
            res.sendFile(__dirname+"/html/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data))
          })
 }