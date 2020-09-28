// Dependencies and stuffs
const nhentai = require('nhentai-js')
const imgToPDF = require('image-to-pdf');
let fs = require('fs'),
    request = require('request');

// Sleep Function [It gives me anxiety xD]
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


// Image Downloading Function
async function download(url, dest) {

    /* Create an empty file where we can save data */
    const file = fs.createWriteStream(dest);

    /* Using Promises so that we can use the ASYNC AWAIT syntax */
    await new Promise((resolve, reject) => {
      request({
        /* Here you should specify the exact link to the file you are trying to download */
        uri: url,
        gzip: true,
      })
          .pipe(file)
          .on('finish', async () => {
            //console.log(`Downloading Finished!.`);
            resolve();
          })
          .on('error', (error) => {
            reject(error);
          });
    })
        .catch((error) => {
          console.log(`Something happened: ${error}`);
        });
}

const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF


// Main Function
async function getDoujin(id){

    try{

      const val = await nhentai.getDoujin(id)

      let pages_array = val.pages;
      let each_pages;
      let namae = val.title;

      for(let i = 0; i < val["pages"].length; i++) {

        pages_array = val.pages;
        each_pages = val.pages[i];
    
        let fName = "image" + i + ".jpg";
        PDFpages.push(fName);

      // Code below this line is to download images from URL :)

        (async () => {
          const data = await download(each_pages, './image' + i + '.jpg');
          console.log(`Done uwu, Page - ${i} but yamette kudasai senpai`); 

        })();

      }

        await sleep(80000); //[ms], Please Adjust this according to your internet speed xox

      // Code below this line is to pack images together in a pdf file :)
       (async () => {
                const data = await imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream('doujinuwu.pdf'));
                console.log(`PDF goes brrr`); 

                // Code below will delete the images after making PDF
                for(let m = 0; m < pages_array.length; m++){
                  fs.unlink('./image' + m + '.jpg', (err) => {
                  if (err) {
                  throw err;
                  }
                  console.log("images deleted uwu.");
                  });
                  //fs.unlinkSync('./image' + m + '.jpg'); // Synchronous Way Of Deleting Files 
                }
            })();


        //imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream('doujinuwu.pdf'));
       
       
    }catch(err){
        console.error(err);

    }
        
}

// Created by Somnath Das :) @samurai3247 [Instagram]
// Enjoy

getDoujin('251004'); //Not so uwu thingy

