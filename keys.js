module.exports={
    data:{
        "type": process.env.ACCOUNT_TYPE,
        "project_id": process.env.ACCOUNT_PROJECT_ID,
        "private_key_id": process.env.ACCOUNT_PRIVATE_KEY_ID,
        "private_key": process.env.ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n') ,
        "client_email": process.env.ACCOUNT_CLIENT_EMAIL,
        "client_id": process.env.ACCOUNT_CLIENT_ID,
        "auth_uri": process.env.ACCOUNT_AUTH_URI,
        "token_uri": process.env.ACCOUNT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.ACCOUNT_AUTH_PROVIDER,
        "client_x509_cert_url": process.env.ACCOUNT_CLIENT_URL
    }
}