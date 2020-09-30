// Dependencies and stuffs
const nhentai = require('nhentai-js');
const fs = require('fs');
const request = require('request');
const imgToPDF = require('image-to-pdf');

let pages_array = []; // Array of links containing image of each page

// Image Downloading Function
async function download(url, dest) {

    // Create an empty file where we can save data 
    const file = fs.createWriteStream(dest);

    // Using Promises so that we can use the ASYNC AWAIT syntax 
    await new Promise((resolve, reject) => {
      request({
    // Here you should specify the exact link to the file you are trying to download 
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

// Ignore the code below

/*fs.mkdir("./Neko_God_Of_Culture", (damn_error) => {
            if(damn_error){
              console.log(damn_error);
            }else{
              console.log("Created New Directory To Store Images");
            }
          });
*/

// Ignore the code above

// deletion() will delete files after downloading images and converting them into PDF
function deletion(x, y) {
	if(x == y.length) {
		for(let s = 0; s < pages_array.length; s++) {
        	const k = fs.unlinkSync('./image' + s + '.jpg');
    		//console.log("images deleted uwu.");
    	}
	}
}



//Engine

const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF
let download_count = 0; // to count the number of page downloaded 

// Main Function
async function getDoujin(id) {

  try {

    console.log(`Welcome To 『 𝓓𝓸𝓾𝓳𝓲𝓷 𝓒𝓸𝓭𝓮 𝓣𝓸 𝓟𝓓𝓕 』|『 同人コードをPDFに 』
    Processing and Converting your Code, Please Wait, senpai uwu
 Also, make sure to have FAST & STABLE INTERNET CONNECTION`)

    if(nhentai.exists(id)) { // Checks if Doujin exists
        const dojin = await nhentai.getDoujin(id);
        pages_array = dojin.pages;
        //console.log(pages_array);
        //console.log(dojin);

        for(let i = 0; i < dojin["pages"].length; i++) {

      // pages_array directly refers to array of links of the images of the pages.
      // each_pages refers to iteration of the array of links of the images.

        pages_array = dojin.pages;
        each_pages = dojin.pages[i];
      
        let fName = "image" + i + ".jpg";
        PDFpages.push(fName);

      // Asynchronous Function

        (async () => {

      // Code below this line is to download images from URL :)

          	const data = await download(each_pages, 'image' + i + '.jpg');
          	//console.log(`Done uwu, Page - ${i} but yamette kudasai senpai`); 

      // Code below this line is to pack images together in a pdf file :)

      /* I think conversion of image of pdf here, in a loop is a little bit good 
      because it will update images into PDF repeatedly and because of that it will help
      to preserve the updated image into PDF incase of any network or server related error though
      it will be useless but look man, gonna be honest with ya, i'm pointless for this crap right now
      so enjoy and don't simp */

          	const conversion = await imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream('doujinuwu.pdf'));
          	//console.log(`PDF goes brrr, UPDATING/WRITING...`);
          	download_count++;

          	console.log(`Downloaded: ${download_count} out of ${pages_array.length}`);

          	const meow = await deletion(download_count, pages_array);

        })();

        }

    } else {
      console.log("Nuke Code doesn't exists, ughhh bakka shi nee (OwO)")
    }
    
  }
  catch(err) {
    console.log(err);
  }
  finally {
    //console.log("Completed")

  }

}

// Created by Somnath Das :) @samurai3247 [Instagram]
// Enjoy :) my fellow man/woman of culture 

getDoujin('251004'); //Not so uwu thingy, 16 pages = 330751 9 pages = 251004 301 pages = 323651
