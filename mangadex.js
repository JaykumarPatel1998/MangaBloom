const axios = require('axios')

const creds = {
    grant_type: "password",
    username: process.env.MANGADEX_USERNAME,
    password: process.env.MANGADEX_PASSWORD,
    client_id: process.env.MANGADEX_CLIENT,
    client_secret: process.env.MANGADEX_SECRET
};

const execute = async () => {
    const resp = await axios({
        method: 'POST',
        url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
        headers : {
            "Content-Type" : 'application/x-www-form-urlencoded'
        },
        data: creds
    });
    
    const { access_token, refresh_token } = resp.data;
    console.log("access_token", access_token);
    console.log("refresh_token", refresh_token)
}

execute()