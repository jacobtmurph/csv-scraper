const fs = require("fs");
const Papa = require("papaparse");
const scrapeIt = require("scrape-it");


//Function to generate name for the file.
function createFileName() {
    //Get the date
    today = new Date();

    //convert date to string in YYY-MM-DD format.
    today = today.toISOString().substring(0, 10);

    //return the name.
    return today
}

//Function to get an array of shirt URLS from the main shirts page.
function getShirtURLs() {
    //Scrape the hrefs.
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
                //then return a formatted array of links.
                return data.shirts.map(url => `http://shirts4mike.com/${url.url}`);
            }
    )
};


//Function to get the data of individual shirts.
async function getShirtData(url) {
    //Assign scraped data object to variable.
    const shirtScrape = await scrapeIt(`${url}`, {
        title: ".shirt-details h1",
        price: ".price",
        imageURL: {
            selector: ".shirt-picture img",
            attr: "src"
        }
    }).then(({ data }) => {
        //Create properly formatted return object.
        rObject = {
            Title: data.title.slice(4),
            Price: data.price,
            ImageURL: data.imageURL,
            Url: `${url}/`,
            Time: new Date(),};
        //Assign the Return object to the variable.
        return rObject;
    });

    //Return object variable.
    return shirtScrape;
}


async function logShirtData() {
    //Let the user know that the file is being generated.
    console.log("Generating file...");
    //Create the filename, url list, and data array.
    const fileName = createFileName();
    const shirtURLS = await getShirtURLs();
    const shirtData = [];

    //For each url in the url list.
    for (let i=0; i < shirtURLS.length; i ++) {
        //set the scraped data object to shirt variable.
        shirt = await getShirtData(shirtURLS[i]);
        //Add shirt varialbe to the data array.
        shirtData.push(shirt);
    };

    //If the data folder doesn't exist.
    if (!fs.existsSync("data")) {
        //Create data folder or return errors.
        fs.mkdir("data", (err) => {return console.log(err.message)});

        //Create the csv file with the fileName variable.
        fs.writeFile(`data/${fileName}`, Papa.unparse(shirtData), (err) => {
            //If an error occurs.
            if (err) {
                //Output the error mesage.
                console.log(err);
            }
            
            //Let the user know the file has been created.
            console.log("File created!")
        })

    //Else if the data folder exists.
    } else {
            //Create the csv file with the fileName variable.
            fs.writeFile(`data/${fileName}`, Papa.unparse(shirtData), (err) => {
            //If an error occurs.
            if (err) {
                //Output the error message.
                console.log(err);
            };

            //Let the user know the file has been created.
            console.log("File created!")
        })
    }
}


//Call to create file.
logShirtData();