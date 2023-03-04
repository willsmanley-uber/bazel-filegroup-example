const https = require('https');

https.get('https://playwright.dev/', (response) => {
    console.log('success');
});