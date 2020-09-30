const nhentai = require('nhentai-js')
const fs = require('fs-extra')
const request = require('request')
const imgToPDF = require('image-to-pdf')
const prompt = require('prompt-sync')()

//doujincode = '330751'

async function getDoujin(id) {
  let download_count = 0
  let PDFpages = []
  try {
    const dojin = await nhentai.getDoujin(id)
    pages_array = dojin.pages
    title = dojin.title
    //  console.log(pages_array.length)

    //download the pages
    console.log('Downloading: ' + title)
    for (let index = 0; index < pages_array.length; index++) {
      image_name = 'images/tempimage' + index + '.jpg'
      await new Promise((resolve) => request(pages_array[index]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
      PDFpages.push(image_name)
      download_count++
      console.log(`Downloading: ${download_count} out of ${pages_array.length}`)
    }
    //converts them to pdf
    imgToPDF(PDFpages, 'A4').pipe(fs.createWriteStream(title + '.pdf'))

    //delets Them
    try {
      await fs.emptyDir('images')
      console.log('success!')
    } catch (err) {
      console.error(err)
    }
  } catch (error) {
    console.log(error)
  }
}

console.log(`Welcome To 『 𝓓𝓸𝓾𝓳𝓲𝓷 𝓒𝓸𝓭𝓮 𝓣𝓸 𝓟𝓓𝓕 』|『 同人コードをPDFに 』
Processing and Converting your Code, Please Wait, senpai uwu
Also, make sure to have FAST & STABLE INTERNET CONNECTION`)

//this bit of code is so if you wanna get a promt to insert the code
doujincode = prompt('Pls insert your Code Senpai *^* ')

getDoujin(doujincode)

// Created by Somnath Das :) @samurai3247 [Instagram]
// With help from Fredwuz :D
// Enjoy :) my fellow man/woman of culture
