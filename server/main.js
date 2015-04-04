var fibers = Npm.require("fibers");
var fs = Npm.require("fs");
var path = Npm.require("path");

var cheerio = Meteor.npmRequire("cheerio");

var BASE_PATH = path.relative(process.cwd(), process.env.PWD);
var JSON_PATH = path.join(BASE_PATH, "public/useragents.json");

var url = "http://useragentstring.com/pages/Browserlist/";

var httpResponse = HTTP.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36"
    },
    timeout: 1000 * 60 * 5
});

if (httpResponse.statusCode === 200) {
    $ = cheerio.load(httpResponse.content);

    var useragents = [];

    $("#liste ul").each(function(index, element) {
        var A = $(this).find("li a").first().text();

        if (1 < (A.match(/;/g) || []).length)
            useragents.push(A);
    });

    console.log("random pick test => " + useragents[Math.floor(Math.random() * useragents.length)]);

    fs.writeFileSync(JSON_PATH, JSON.stringify(useragents));
}
