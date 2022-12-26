# Facebook-Clone
Hello, This is my version of facebook.<br/>
I built this backend api for the last project of the [TOP Curriculum](https://www.theodinproject.com/).
To see the frontend repository visit [this](https://github.com/Cherifi-Houdaifa/Facebook-Clone-Client).
And here is the [live](https://facebook-clone-client.onrender.com) website. Enjoy 😁.
## Developement Stack
- ExpressJS
- MongoDB with mongoose
- PassportJS
## How to run
- You need google credentials if you want to use google auth.
- You also need a MongoDB cluster url.<br/>
Environment variables in the .env file are:<br/>
`DB_URI=<Your mongo db connection uri>`<br/>
`GOOGLE_CLIENT_ID=<Your google client id>`<br/>
`GOOGLE_CLIENT_SECRET=<Your google client secret>`<br/>
`GOOGLE_CALLBACK_URL=<The callback url that you set on google cloud console>`<br/>
`JWT_SECRET=<You can make this anything eg: Yo mama>`<br/>
`ALLOWED_ORIGINS=<Urls of websites allowed to connect to the api (can't be "*")>`<br/><br/>
`npm run devstart`: Runs the app in development mode<br/>
`npm start`: Runs the app<br/>

## License
- MIT License
