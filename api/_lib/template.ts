
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

function getCss(theme: string, fontSize: string) {
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
        background: #FFF;
        height: 100vh;
        width:100%;
        position:relative;
        margin:60px;
        display:flex;
        justify-content: flex-start;
        align-items: flex-end;
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
    height: 400px;
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
        /* font-size: ${sanitizeHtml(fontSize)}; */
        font-size: 90px;
        font-style: normal;
        color: ${foreground};
        line-height: 120%;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Earth OG Image Generator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>




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
