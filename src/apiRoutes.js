const express = require('express');
const puppeteer = require('puppeteer');
const { URL } = require('url');
const Insight = require("./insights.model")

const router = express.Router();


router.post('/analyze', async (req, res) => {
    const url = req.body.url;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const data = await page.goto(url, { waitUntil: 'networkidle2' });

        const wordCount = await page.evaluate(() => {
            const text = document.querySelector('body').innerText;
            const words = text.split(/\s+/).filter((word) => word !== '');
            return words.length;
        });

        const links = await page.evaluate(() => {
            const linkElements = document.querySelectorAll('a');
            const links = Array.from(linkElements)
                .map((element) => element.getAttribute('href'))
                .filter((link) => link && link.startsWith('https'));
            return links;
        });

        const media = await page.evaluate(() => {
            const imageElements = document.querySelectorAll('img');
            const videoElements = document.querySelectorAll('video');

            const mediaElements = Array.from(imageElements).concat(Array.from(videoElements));

            const media = mediaElements.map((element) => element.src);

            return media;
        });


        const domain = new URL(url).hostname;

        await browser.close();
        const result = await Insight.create({
            domain, wordCount, links, media
        })

        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to analyze the webpage' });
    }
});

router.get('/insights', async (req, res) => {
    const result = await Insight.find()
    res.json({ result });
})

router.delete('/insights/:id', async (req, res) => {
    const result = await Insight.findByIdAndDelete(req.params.id)
    res.json({ result });
})

router.put('/insights/:id', async (req, res) => {
    const result = await Insight.findById(req.params.id)
    result.favourite = true
    await result.save()
    console.log("......", result);

    res.json({ result });
})

module.exports = router;
