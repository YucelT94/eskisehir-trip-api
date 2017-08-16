var request = require('request');
var request = require('request');
var cheerio = require('cheerio');
var url = 'https://www.tripadvisor.com.tr/';


exports.eskisehirtripdetail = function (req, res, next) {
    if (typeof req.query.url === 'undefined') {
        return res.json({'status': false, 'msg': 'Hedef url url parametresiyle gelmelidir.'})
    }
    var istenenUrl = "https://www.tripadvisor.com.tr" + req.query.url;
    if (req.query.url[0] != "/") {
        var istenenUrl = "https://www.tripadvisor.com.tr/" + req.query.url;
    }

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
                    address: $(tds[0]).find('span.street-address').text().trim() + ',Eskişehir, Türkiye',
                    telephone: $(tds[0]).find('div.blEntry.phone').find('span').text().trim(),
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