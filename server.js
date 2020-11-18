const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

const jsonLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '50mb';

app.use(bodyParser.json({limit: jsonLimit}));

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
        try {
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
            const options = { method, url, headers };
            console.log('@@@@@@@@@@@ req.body: ', req.body);
            const body = req.body;
            if (Object.keys(body).length > 0) {
                options.body = JSON.stringify(body);
            }
            console.log('@@@@@@@@@@@ options: ', options);
            request(options, function (error, response) {
                if (error) throw new Error(error);
            }).pipe(res);
        } catch (error) {
            res.send(500, { error: `Proxy failed due to: ${error.message}` });
        }
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});