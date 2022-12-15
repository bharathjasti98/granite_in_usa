const { MongoClient } = require('mongodb');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mongourl = "mongodb+srv://Jastibharath:1426@cluster0.9dj9h9i.mongodb.net/?retryWrites=true&w=majority";
const port = process.env.port || 8090;
const request = async function (req, res) {
    if (req.url === '/') {
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
    } else if (req.url === '/granite') {
        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(await dbClient()));
        res.end();
    } else {
        res.end("NOT VALID")
    }
};
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
const server = http.createServer(request);
server.listen(port, () => {
    console.log(`Server on http://${port}`);
});
