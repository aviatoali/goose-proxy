var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '50MB';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        // const targetURL = req.header('Target-Endpoint');
        // // console.log('@@@@@@@@@@@@@@@ server.js reqUrl: ', targetURL + req.url);
        // // console.log('@@@@@@@@@@@@@@@ server.js incoming headers: ', req.headers);

        // if (!targetURL) {
        //     res.send(500, { error: 'There is no Target-Endpoint header in the request' });
        //     return;
        // }
        // const headers = { 'Content-Type': 'application/json' };
        // if (req.header('Api-Token')) {
        //     headers['Api-Token'] = req.header('Api-Token');
        // }
        // // console.log('@@@@@@@@@@@@@@@ server.js headers: ', headers);

        // try {
        //     request({ url: targetURL + req.url, method: req.method, json: req.body, headers },
        //         function (error, response, body) {
        //             console.log('@@@@@@@@@@@@@@@ server.js error: ', error);
        //             console.log('@@@@@@@@@@@@@@@ server.js response: ', response);
        //             console.log('@@@@@@@@@@@@@@@ server.js body: ', body);
        //             if (error) {
        //                 console.error('@@@@@@@@@@@@ request error: ' + response.statusCode)
        //             }
        //         }).pipe(res);
        // } catch (error) {
        //     console.log('@@@@@@@@@@@@@@@ server.js catch error: ', error);
        // }

        const targetURL = req.header('Target-Endpoint');
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        const url = targetURL + req.url;
        const headers = { 'Content-Type': 'application/json' };
        if (req.header('Api-Token')) {
            headers['Api-Token'] = req.header('Api-Token');
        }
        const method = req.method;
        const body = req.body;
        const options = { method, url, headers, body };
        request(options, function (error, response) {
            console.log('@@@@@@@@@@@@@@@ server.js error: ', error);
            console.log('@@@@@@@@@@@@@@@ server.js response: ', response);
            if (error) throw new Error(error);
            // console.log(response.body);
        }).pipe(res);

        // var request = require('request');
        // var options = {
        //     'method': 'GET',
        //     'url': 'https://alishah.api-us1.com/api/3/contacts?email=ashah9265@gmail.com&include=plusAppend',
        //     'headers': {
        //         'accept': 'application/json, text/plain, */*',
        //         'api-token': '097448258dbac2b847efba7fb7cdcfb18446ec82bd9f4dc985f9c5b1079b64ed4147185e'
        //     }
        // };
        // request(options, function (error, response) {
        //     console.log('@@@@@@@@@@@@@@@ server.js error: ', error);
        //     console.log('@@@@@@@@@@@@@@@ server.js response: ', response);
        //     if (error) throw new Error(error);
        //     // console.log(response.body);
        // }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});