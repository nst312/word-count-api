const express = require('express');
const { URL } = require('url');
const Insight = require('./insights.model');
const { chromium } = require('playwright');

const router = express.Router();

router.post('/analyze', async (req, res) => {
    const url = req.body.url;
  
    try {
      const browser = await chromium.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
  
      const text = await page.textContent('body');
      const words = text.split(/\s+/).filter((word) => word !== '');
      const wordCount = words.length;
  
      const links = await page.$$eval('a[href^="https"]', (elements) =>
        elements.map((element) => element.href)
      );
  
      const media = await page.$$eval('img, video', (elements) =>
        elements.map((element) => element.src)
      );
  
      const domain = new URL(url).hostname;
  
      await browser.close();
  
      const result = await Insight.create({
        domain,
        wordCount,
        links,
        media,
      });
  
      res.json({ result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  });

router.get('/insights', async (req, res) => {
  try {
    const result = await Insight.find();
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve insights' });
  }
});

router.delete('/insights/:id', async (req, res) => {
  try {
    const result = await Insight.findByIdAndDelete(req.params.id);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete insight' });
  }
});

router.put('/insights/:id', async (req, res) => {
  try {
    const result = await Insight.findById(req.params.id);
    result.favourite = true;
    await result.save();
    console.log('......', result);

    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update insight' });
  }
});

module.exports = router;
