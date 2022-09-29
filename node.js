const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("index.html","utf-8");
const replaceVal = (tempVal,orgVal)=>{

    var temprature = tempVal.replace("{%tempval%}",orgVal.main.temp);
        temprature = temprature.replace("{%tempmin%}",orgVal.main.temp_min);
        temprature = temprature.replace("{%tempmax%}",orgVal.main.temp_max);
        temprature = temprature.replace("{%location%}",orgVal.name);
        temprature = temprature.replace("{%country%}",orgVal.sys.country); 
        temprature = temprature.replace("{%tempstatus%}",orgVal.weather[0].main);
        return temprature;
        
}

const server = http.createServer((req,res)=>{
    if(req.url=='/'){
        requests ("https://api.openweathermap.org/data/2.5/weather?q=Pratapgarh&appid=4f3afa9ce442eec5d65f45b1a300e39f").on("data",(chunk) => {
            const objdata = JSON.parse(chunk);
            const arrdata = [objdata];
            // console.log(arrdata[0].main.temp);
         const realTimeData = arrdata.map((val)=>  replaceVal(homeFile,val)).join("");
                res.write(realTimeData);
                res.end();
                // console.log(realTimeData);

        })
        .on("end", (err) =>{ return console.log("connection closed due to errors",err),
        res.end();
    }); 
    }
});

server.listen(8000,"127.0.0.1",()=>{
    console.log("listening to port 8000")
});