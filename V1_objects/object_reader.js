const fs = require ('fs');

fs.open('object.txt', 'r', (err, fd) => {
 if (err) throw err;
 fs.close(fd, (err) => {
   if (err) throw err;
 });

 fs.readFile('object.txt', (err, data) => {
   if (err) throw err;
   console.log(data);
 });
});
