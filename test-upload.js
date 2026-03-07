const http = require('http');
const req = http.request('http://localhost:3000/api/save-detection', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(res.statusCode, data));
});
req.write(JSON.stringify({
  emotion: 'test',
  imageBase64: 'data:image/jpeg;base64,iVBORw0KGgoX='
}));
req.end();
