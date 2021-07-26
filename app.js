const FormData = require('form-data');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cloudscraper = require('cloudscraper');
const app = express();

const multer = require('multer');
const upload = multer();

app.use(cors());

app.post(`/token`, async (req, res) => {
  try {
    const query = req.query;
    console.log('GOTOKEN!!!!', query);
    const response = await axios.post(`https://sm.ms/api/v2/token?username=${query.username}&password=${query.password}`);
    console.log(response.data);
    res.send(response.body);
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      error,
    });
  }
});

app.post(`/upload`, upload.single('smfile'), async (req, res) => {
  try {
    const data = req.body;
    const formData = new FormData();
    formData.append('smfile', req.file.buffer, { filename: req.file.filename });
    formData.append('format', data.format);
    const headers = formData.getHeaders();
    headers.Authorization = req.headers.authorization;
    headers.boundary = '__X_PAW_BOUNDARY__';
    headers['User-Agent'] = 'paw/1.0';

    const response = await cloudscraper.post({
      url: 'https://sm.ms/api/v2/upload',
      formData: {
        smfile: req.file.buffer,
        format: req.body.format,
      },
      headers,
    });
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      error,
    });
  }
});

app.get('/404', (req, res) => {
  res.status(404).send('Not found');
});

app.get('/500', (req, res) => {
  res.status(500).send('Server Error');
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send('Internal Serverless Error');
});

// Web 类型云函数，只能监听 9000 端口
app.listen(9000, () => {
  console.log(`Cors enabled server start on http://localhost:9000`);
});
