var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.tripadvisor.com.tr/Attractions-g319806-Activities-Eskisehir_Eskisehir_Province.html';

exports.eskisehirtrip = function (req, res, next) {
    request(url, function (err, response, body) {
        if (err) {
            return next(err);
        }
        if (response.statusCode !== 200) {
            return next(new Error('Server Error'));
        }
        $ = cheerio.load(body);

        var links = $('div#ATTR_ENTRY_.attraction_element')
            .map(function (i, e) {
                var tds = $(e).find('div.listing_info');
                var tdsPic = $(e).find('div.photo_booking.non_generic');
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
};
function requestDetail(istenenUrl){
    request(istenenUrl, function (err, response, body) {
        if (err) {
            return next(err);
        }
        if (response.statusCode !== 200) {
            return next(new Error('Server Error'));
        }
        $ = cheerio.load(body);

        var links = $('div.prw_rup')
            .map(function (i, e) {
                var tds = $(e).find('div.blRow');
                return {
                    address: $(tds[0]).find('span.street-address').text().trim(),
                    telephone: $(tds[0]).find('span.street-address').text().trim(),
                    picUrl: $(tds[0]).find('span.street-address').text().trim(),
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
}