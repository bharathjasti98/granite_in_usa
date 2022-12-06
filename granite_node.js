const { MongoClient } = require('mongodb');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mongourl = "mongodb+srv://Jastibharath:1426@cluster0.9dj9h9i.mongodb.net/?retryWrites=true&w=majority";
//mongodb+srv://Jastibharath:<password>@cluster0.9dj9h9i.mongodb.net/?retryWrites=true&w=majority

const port = process.env.port || 8090;
const requestListener = async function (req, res) {
    if (req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'content-Type': 'text/html' });
            res.end(data);
        })
    } else if (req.url === '/api') {
        fs.readFile(path.join(__dirname, '', 'granite.json'), (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'content-Type': 'application/json' });
            res.end(data);
        })
    } else {

        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(await dbClient()));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(port,() => {
    console.log(`Server is running on http://${port}`);
});

async function dbClient() {
    const client = new MongoClient(mongourl);
    const list = await Granite_Usa(client);
    return list;
}


async function Granite_Usa(client) {
    var Granite_Details = null;
    try {
        client.connect();

        Granite_Details = await client.db("Granite").collection("Granite_details").find().toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }

    return Granite_Details;
}