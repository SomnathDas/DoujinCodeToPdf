// Dependencies and stuffs
const nhentai = require('nhentai-js')
const imgToPDF = require('image-to-pdf');
let fs = require('fs'),
    request = require('request');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Image Downloading Function
let download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(url).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const PDFpages = []; //name of pages will be stored here, later to smash it all together to make PDF


// Main Function
async function getDoujin(id){

    try{ 
        const val = await nhentai.getDoujin(id)

        //Ignore the below shit 
        /*options = {
		  url: '',
		  dest: '/Desktop/Whatsapp-Botto-Re/GODneko/photo.jpg'   
		}*/
		//Ignore the above shit


        let pages_array = val.pages;
        let each_pages;
        let namae = val.title;

        for(let i = 0; i < val["pages"].length; i++) {
        	pages_array = val.pages;
        	each_pages = val.pages[i];
     
        	//options.url = each_pages;
        	//options.dest = '/Desktop/Whatsapp-Botto-Re/GODneko/photo' + i + '.jpg';

        	let fName = "image" + i;
        	PDFpages.push(fName);

        	//console.log(options.url);
        	//console.log(options.dest);
        	//console.log(each_pages);

        	// Code below this line is to download images from URL :)

        	download(each_pages, fName, function(){
  				console.log('Downloaded, Page' + i);
			});

        }
        await sleep(40000);
        imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream('doujinuwu.pdf'));


       
    }catch(err){
        console.error(err);

    }
        
}

// Created by Somnath Das :) @samurai3247 [Instagram]


getDoujin('251004'); //Not so uwu thingy

