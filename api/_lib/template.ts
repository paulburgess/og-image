
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, bgColor: string) {
    let background = 'white';
    let foreground = 'black';
  //  let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
  //      radial = 'dimgray';
    }
    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }



    body {

        /* background: ${background}; */
        background-color: #FFF;
        height: 100vh;
        width:100%;
        position:relative;
        margin:60px;
        display:flex;
        justify-content: flex-start;
        align-items: flex-end;
        overflow:hidden;
    }

    code {
        color: #D400FF;
        font-family: 'Arial', sans-serif;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }


    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .earth-logo {
      width: 70px;
      height:70px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 50px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }


  .image-wrapper img  {
  position:absolute;

  }


  /* Earth logo */
  .image-wrapper img:nth-child(1) {
    top:0;
    left:-40px;
    width: 400px;
    height: auto;
  }

.image-wrapper img[src*="kitchen"]:nth-child(1) {
  width: 550px;
}

.image-wrapper img[src*="hall"]:nth-child(1),
.image-wrapper img[src*="theatre"]:nth-child(1) {
  width: 590px;
}



  .bg-blob {
    position: absolute;
    right:80px;
    bottom:-100px;
    width: auto;
    height: 90vh;
    opacity:0.3;
  }

  .bg-blob * {
    fill: ${sanitizeHtml(bgColor)};
  }

  /* Event/artist logo */
  .image-wrapper img:nth-child(2) {
    border-radius: 50%;
    width: 1000px;
    height: 1000px;
    top:-140px;
    right:-100px;
  }


    .heading {

        font-family: 'Arial', sans-serif;
        /* font-size: ${sanitizeHtml(bgColor)}; */
        font-size: 90px;
        font-style: normal;
        color: ${foreground};
        line-height: 120%;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, bgColor, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Earth OG Image Generator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, bgColor)}
    </style>
    <body>



            <svg class="bg-blob" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 403 418">
                  <path fill="#EB144C" d="M285 95.1c19.1 9.7 40.3 18.6 59.1 35.7 18.7 17.1 35 42.4 46.5 77.7 11.5 35.2 18.3 80.4 2.2 114.6-16 34.1-54.9 57.2-98.7 75.6-43.8 18.4-92.5 32.2-115.5 4.4-23.1-27.8-20.3-97.2-47.7-136.3-27.4-39.1-84.9-47.9-111.4-75.7C-7 163.3-2.6 116.6 15.8 76.3 34.2 36 66.6 2 105 1c38.3-1 82.7 31 113.3 52.3 30.6 21.3 47.6 32 66.7 41.8z" />
            </svg>



            <div class="image-wrapper">

                ${images.map((img, i) =>
                    //getPlusSign(i) + getImage(img, widths[i], heights[i])
                    getImage(img, widths[i], heights[i])
                ).join('')}

            </div>


            <div class="heading">
            ${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>

    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

// function getPlusSign(i: number) {
//     return i === 0 ? '' : '<div class="plus">+</div>';
// }
