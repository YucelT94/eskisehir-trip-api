var request = require('request');
var cheerio = require('cheerio');
var phantom = require('phantom');

var url = 'https://www.tripadvisor.com.tr/Attractions-g319806-Activities-Eskisehir_Eskisehir_Province.html';


exports.eskisehirtrip = function (req, res, next) {
    phantom.create().then(function (ph) {
        ph.createPage().then(function (page) {
            page.open(url).then(function (status) {
                console.log(status);
                page.property('content').then(function (content) {
                    $ = cheerio.load(content);

                    var links = $('div#ATTR_ENTRY_.attraction_element')
                        .map(function (i, e) {
                            var tds = $(e).find('div.listing_info');
                            var tdsPic = $(e).find('div.listing_details div.photo_booking.non_generic');
                            return {
                                name: $(tds[0]).find('a').text().trim(),
                                url: $(tds[0]).find('a').attr('href'),
                                picUrl: $(tdsPic[0]).find('img').attr('src'),
                            };
                        })
                        .get() // get basic JSONArray
                        .sort(function (a, b) { // sort by code
                            return a.code - b.code;
                        });
                    if (req.query.skip) {
                        links = links.slice(req.query.skip);
                    }
                    if (req.query.limit) {
                        links = links.slice(0, req.query.limit);
                    }

                    return res.json(links);
                });
            });
        });
    });
};