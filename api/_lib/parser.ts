import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname = '/', query = {} } = parse(req.url || '', true);
    const { bgColor, images, widths, heights, theme, md } = query;

    if (Array.isArray(bgColor)) {
        throw new Error('Expected a single bgColor');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    const arr = pathname.slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
       theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        bgColor: bgColor || '96px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
    return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    if (images.length > 0 && images[0] && images[0].startsWith('https://earthackney.co.uk/wp-content/themes/earthackney/_/img/')) {
        return images;
    }
    return theme === 'light'
    ? ['https://earthackney.co.uk/wp-content/themes/earthackney/_/img/logo.svg'] // black
    : ['https://earthackney.co.uk/wp-content/themes/earthackney/_/img/logo.svg']; // white
}
