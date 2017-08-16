var express = require('express');
var fs = require('fs');

var main_controller = {};
var controllersPath = process.cwd() + '/app/controllers';

fs.readdirSync(controllersPath).forEach(function (file) {
    if (file.match(/\.js$/)) {
        main_controller[file.split('.')[0].toLowerCase()] =
            require(controllersPath + '/' + file);
    }
});

var eshisehirtrip_controller = {};
var eskisehir_controllersPath = process.cwd() + '/app/controllers';
fs.readdirSync(eskisehir_controllersPath).forEach(function (file) {
    if (file.match(/\.js$/)) {
        eshisehirtrip_controller[file.split('.')[0].toLowerCase()] =
            require(eskisehir_controllersPath + '/' + file);
    }
});

module.exports = function (app) {
    var router = express.Router();
    router.route('/').get(main_controller.main.index);
    router.route('/eskisehirtrip').get(eshisehirtrip_controller.eskisehirtrip.eskisehirtrip);
    router.route('/eskisehirtripdetail').get(eshisehirtrip_controller.eskisehirtripdetail.eskisehirtripdetail);

    app.use(router);
};
