const express = require('express');
const app = express();

app.use(express.static("dist/lms"));

const PORT = 7000;

app.set('port', process.env.PORT || PORT);

app.listen(app.get('port'), () => {
    console.log('Web app is running on port', app.get('port'));
});