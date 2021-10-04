'use strict'

const app = require('./app');
const port = 3700;

app.set('port', process.env.PORT || port);

// THIS LINE TO CONNECT WITHOUT DB
app.listen(app.get('port'), () => {
		console.log("Servidor Corriendo Correctamente En Puerto: "+app.get('port'));
});