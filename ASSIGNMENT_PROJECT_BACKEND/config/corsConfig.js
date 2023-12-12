const allowedUrls = ['http://localhost:3000', 'http://127.0.0.1:5173'];

const corsOptions = {
    origin: (originUrl, cb)=>{
        if(allowedUrls.indexOf(originUrl) !== -1 || !originUrl){
            cb(null, true);
        } else {
            cb( new Error("BLOCKED BY CORS"), false);
        }
    }
}

module.exports = {corsOptions};
