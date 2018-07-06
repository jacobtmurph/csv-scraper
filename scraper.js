const scrapeIt = require("scrape-it");

const shirtData= [];

function getShirtURLs() {
     return scrapeIt("http://shirts4mike.com/shirts.php", {
        shirts: {
            listItem: ".products li",
            data: {
                url: {
                    selector: "a",
                    attr: "href",
                }
            }
        }
    })
    .then( ({data}) => {
                return data.shirts.map(url => `http://shirts4mike.com/${url.url}`);
            }
    )
};


async function getShirtData() {
    const shirtURLs = await getShirtURLs();
    shirtURLs.forEach(shirtURL => {
            scrapeIt(shirtURL, {
                price: ".price",
                title: ".shirt-details h1",
                imageURL: {
                    selector: ".shirt-picture img",
                    attr: "src"
                }
            }).then( ({data}) => { 
                shirtData.push({
                        price: data.price,
                        title: data.title.slice(4),
                        imageURL: data.imageURL,
                        url: shirtURL
                    })
                }).then(() => console.log(shirtData));
            }
    )
}

getShirtData();