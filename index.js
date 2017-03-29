const express = require('express');
const app = express();
const path = require('path');
let port = 3090

app.get('/:page',(req,res,next)=>{
  let page = req.params.page;
  res.sendFile(path.join(__dirname+`/public/${page}.html`));
});

app.use(express.static(__dirname+'/public'));

app.listen(port);
console.log(`Listening on port ${port}`);
