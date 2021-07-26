const FormData = require('form-data');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const streamBuffers = require('stream-buffers');
const { Readable } = require('stream');
const app = express();

const multer = require('multer');
const upload = multer();

app.use(cors());

app.post(`/token`, async (req, res) => {
  try {
    const query = req.query;
    const response = await axios.post(`https://sm.ms/api/v2/token?username=${query.username}&password=${query.password}`);
    res.send(response.body);
  } catch (error) {
    console.error(error);
    res.send({
      success: false,
      error,
    });
  }
});

app.post(`/upload`, upload.any(), cors(), async (req, res) => {
  try {
    const formData = new FormData();
    console.log(Buffer.from(req.files[0].buffer));
    formData.append('smfile', Buffer.from(req.files[0].buffer), req.files[0].originalname);
    formData.append('format', 'json');
    const headers = formData.getHeaders();
    headers['Authorization'] = req.headers.authorization;
    headers['Cookie'] = 'PHPSESSID=2fl4qf6irr7a91epogjerjh1bv';
    // headers["Content-Type"] = "multipart/form-data; charset=utf-8; boundary=__X_PAW_BOUNDARY__";
    const response = await axios.post('https://sm.ms/api/v2/upload', formData, {
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
