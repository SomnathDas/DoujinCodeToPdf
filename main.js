const nhentai = require('nhentai-js');
let fs = require('fs');
let request = require('request');
const imgToPDF = require('image-to-pdf');
const path = require('path');
const prompt = require('prompt-sync')();
// const doujin_id = prompt('Write your Nuke code UwU : ') //         '251004';
const express = require('express');
// const { title } = require('process');
// const { title } = require('process');
// const doujin_id = Code
const app = express();
const port = process.env.PORT || 443


app.get('/download',async (req,res)=>{
// let dirr = path.join(__dirname)
const id = req.query.code
    const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF
    const directory = 'temp_images'; // name of the directory where temp_image files will be stored to make PDF
    let pages_array = [];
  
    try {
  
      console.log('\x1b[41m%s\x1b[0m', 
        `Welcome To 『 𝓓𝓸𝓾𝓳𝓲𝓷 𝓒𝓸𝓭𝓮 𝓣𝓸 𝓟𝓓𝓕 』|『 同人コードをPDFに 』`);
      console.log('\x1b[41m%s\x1b[0m', 
        `        『 Created By Somnath Das, @samurai3247 [Instagram] 』`);
      console.log('\x1b[44m%s\x1b[0m', 
        `Processing and Converting your Code, Please Wait, senpai uwu`);
  
      // To Create Directory na"temp_images"ges"
      fs.mkdir(`${id}`, (damn_error) => {
              if(damn_error) {
                if(damn_error.hasOwnProperty('errno') && damn_error['errno'] == '-17') {
                  console.log("Directory already exists");
                } else {
                console.log("Directory Exists overwriting.....");
                }
              } else if(!damn_error){
                console.log("Created New Directory To Store Images");
              }
            });
  
      if(nhentai.exists(id)) { // Checks if Doujin exists
  
          const dojin = await nhentai.getDoujin(id);
          pages_array = dojin.pages;
          let title = dojin.title;
          let download_count = 0;
  
        // pages_array directly refers to an array of links of the images of the pages.
          pages_array = dojin.pages;
  
        // To download images from the direct url present in pages_array
          console.log(`Doujin title: ${title}`);
          console.log("Downloading...")
          for (let i = 0; i < pages_array.length; i++) {
            image_name = `${id}/image` + i + '.jpg';
            await new Promise((resolve) => request(pages_array[i]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
            PDFpages.push(image_name);
            download_count++;
            console.log(`Downloading: ${download_count} out of ${pages_array.length}`)
          }
  
      // To convert images into pdf file using an API named "image-to-pdf"
          imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream(id + '.pdf'));
  
      // To Read the temp_images directory, collect the name of files in there and delete image files after using them
          try {
            fs.readdir(directory, (err, files) => {
            if (err) throw err;
  
            for (const file of files) {
              fs.unlink(path.join(directory, file), err => {
              if (err) throw err;


              // const data = __dirname+ `/${title}.pdf`
              // res.sendFile(data)375569
                
            });
            }
            });
  
          }catch(eRR) {
            console.log(eRR);
          }
  
      } else { // Responds if doujin doesn't exists
        console.log("Nuke Code doesn't exists, bakka shi nee *^*")
      }
      
    }catch(err) {
      console.log(err);
  
    }finally {
      res.send(`<h1> finised</h1><br><br><form action="/pdf">
    <input type="text" id="/pdf?id" name="id"><br><br>
    <button type="submit">Download</button>`)

      console.log("Completed");        
    }
})
app.get('/pdf',(req,res)=>{

let id = req.query.id
    const data = __dirname+ `/${id}.pdf`
            
    // res.setHeader('application/pdf')


res.sendFile(data)
})

app.get('/',(req,res)=>{
  res.send('<h1>welcome to the darkness enter your code to download it on server </h1><br><h4>wait until it says finised okie umu </h4><form action="/download"> <input type="text" id="text" name="code"><br><br> <button type="submit">Submit</button></form>')
})



app.listen(port,()=>{console.log(`listening to port : ${port}`)})
