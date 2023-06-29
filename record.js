const express = require('express')
const mongodb = require('mongodb')
const cors = require('cors')
const dotenv = require('dotenv')

const router = express()
router.use(express.json())
router.use(cors())
dotenv.config()

const mongoClient = mongodb.MongoClient;
const DB_URL = process.env.DBURL || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 3000;


router.post('/createresource', async (req, res) => {
    try {
        const client = await mongoClient.connect(DB_URL, { useUnifiedTopology: true })
        const db = client.db('resource')
        const data = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description
        }
        await db.collection('resource').insertOne(data);
        client.close()
        res.status(200).json({ message: "created" })
    }
    catch (error) {
        console.log(error)
        res.sendStatus(500);
    }

})

router.get('/getresource', async (req, res) => {
    try {
        const client = await mongoClient.connect(DB_URL)
        const db = client.db('resource')
        let data = await db.collection('resource').find().toArray()
        client.close();
        res.status(200).json(data)
    }
    catch (error) {
        console.log(error)
        res.sendStatus(404)
    }
})

router.get("/getoneresource/:id", async (req, res) => {
    try {
        const client = await mongoClient.connect(DB_URL)
        const db = client.db('resource')
        let data = await db.collection("resource").findOne({ id: JSON.parse(req.params.id) })
        client.close()
        res.status(200).json(data)
    }
    catch (error) {
        console.log(error)
    }
})

router.put('/editresource/:id', async (req, res) => {
    try {
        const client = await mongoClient.connect(DB_URL)
        const db = client.db('resource')
        let dat = await db.collection('resource').findOne({ id: JSON.parse(req.params.id) })
        if (dat) {
            const data = {
                id: req.body.id,
                name: req.body.name,
                description: req.body.description
            }
            await db.collection('resource').updateOne({ id: JSON.parse(req.params.id) }, { $set: data })
            client.close();
            res.status(200).json({
                message: "One document updated"
            })
        } else {
            res.status(200).json({
                message: "Id not found!"
            })
        }

    } catch (error) {
        console.log(error)
    }
})

router.delete("/deleteresource/:id", async (req, res) => {
    try {
        const client = await mongoClient.connect(DB_URL)
        const db = client.db('resource')
        var del = req.params.id
        console.log(del)
        await db.collection("resource").findOneAndDelete({ id: JSON.parse(req.params.id) })
        client.close()
        res.status(200).json({
            message: "Delete Success"
        })
    }
    catch (error) {
        console.log(error)
    }
})

router.listen(port, () => console.log("::: Server is UP and running successfully :::"))   
