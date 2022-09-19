export interface Meme {
    "success": boolean,
    "data": {
        "memes": [{
            "id": string,
            "name": string,
            "url": string,
            "width": number,
            "height": number,
            "box_count": number
        }]
    }
}

export interface FavMeme{
    "id": string,
    "name": string,
    "url": string,
    "width": number,
    "height": number,
    "box_count": number
}