
// Get Password Lists From The Internet

const fs = require('fs');
const URL = 'https://raw.githubusercontent.com/josuamarcelc/common-password-list/main/rockyou.txt/rockyou_1.txt';

(
    async ()=>{
        console.log("Fetching Data Please wait...")
        const Request = await fetch(URL)
        const Response = await Request.text()
        console.log("Writing Data Please wait...")
        fs.writeFileSync('./rockyou_1.txt', Response, 'utf8')
        console.log("Done! enjoy!")
    }
)();