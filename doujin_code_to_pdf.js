// Dependencies and stuffs
const nhentai = require('nhentai-js');
let fs = require('fs');
let request = require('request');
const imgToPDF = require('image-to-pdf');
const path = require('path');

//Engine
const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF
const directory = 'temp_images'; // name of the directory where temp_image files will be stored to make PDF
let pages_array = [];

// Main Function
async function getDoujin(id) {

  try {

    console.log('\x1b[41m%s\x1b[0m', 
      `Welcome To 『 𝓓𝓸𝓾𝓳𝓲𝓷 𝓒𝓸𝓭𝓮 𝓣𝓸 𝓟𝓓𝓕 』|『 同人コードをPDFに 』`);
    console.log('\x1b[41m%s\x1b[0m', 
      `        『 Created By Somnath Das, @samurai3247 [Instagram] 』`);
    console.log('\x1b[44m%s\x1b[0m', 
      `Processing and Converting your Code, Please Wait, senpai uwu`);

    // To Create Directory named "temp_images"
    fs.mkdir("temp_images", (damn_error) => {
            if(damn_error) {
              if(damn_error.hasOwnProperty('errno') && damn_error['errno'] == '-17') {
                console.log("Directory already exists");
              } else {
              console.log(damn_error);
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
          image_name = 'temp_images/image' + i + '.jpg';
          await new Promise((resolve) => request(pages_array[i]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
          PDFpages.push(image_name);
          download_count++;
          console.log(`Downloading: ${download_count} out of ${pages_array.length}`)
        }

    // To convert images into pdf file using an API named "image-to-pdf"
        imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream(title + '.pdf'));

    // To Read the temp_images directory, collect the name of files in there and delete image files after using them
        try {
          fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
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
    console.log("Completed");        
  }

}

// Created by Somnath Das :) @samurai3247 [Instagram]
// Enjoy :) my fellow man/woman of culture 


getDoujin('251004'); //Not so uwu thingy, 
//(dunno, never read) --> 16 pages = 330751 9 pages = 251004 (wholesome) --> 301 pages = 323651
