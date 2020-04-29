
<a  href="https://www.quarantineaid.in">

<img  src="https://www.quarantineaid.in/img/qa-logo.0d5f20b4.png"  alt="Quarantine Aid"  width="200"  />

</a>

# Quarantine Aid - ExpressJS Backend
  

## About

Quarantine Aid connects those who need help with organisations and volunteers who can help during Covid-19. This is particularly important during this period of quarantine and self-isolation due to COVID-19.

Implementations in other languages:

| GO  | Rust  |
| ------------ | ------------ |
| TBD  |TBD   |


### How it works

This application is a REST backend for [Quarantine Aid Frontend](https://github.com/solancer/qaid-2020-client "Quarantine Aid Frontend"), built using Express.JS. However, the API server can be used to build a client app in any web or mobile client.

## Features

  

- Node.js web server using [Express.js](https://npm.im/express)

- **OAuth 2.0 Authentication** via Facebook, Google, GitHub

- MVC Project Structure

-  [Automated CI builds GitHub Actions](/.github/workflows/nodejs.yml)

- Linting and formatting using [ESLint](https://npm.im/eslint) and [Prettier](https://npm.im/prettier)

- Project specific environment variables using `.env` files and [`dotenv-safe`](https://npm.im/dotenv-safe) by comparing `.env.example` and `.env`.

  

## How to use it

  

1. Create a copy using [GitHub's repository template](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) functionality

2. Copy [`.env.example`](.env.example) as `.env` and update with the respective values.

3. Start your app with npm run dev

  

## Set up

  

### Requirements

  

-  [Node.js](https://nodejs.org/)

- A Twilio account - [sign up](https://www.twilio.com/try-twilio)

- MongoDB

Obtaining API Keys
------------------

To use any of the included APIs or OAuth authentication methods, you will need
to obtain appropriate credentials: Client ID, Client Secret, API Key, or
Username & Password. You will need to go through each provider to generate new
credentials.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1000px-Google_2015_logo.svg.png" width="200">

- Visit <a href="https://cloud.google.com/console/project" target="_blank">Google Cloud Console</a>
- Click on the **Create Project** button
- Enter *Project Name*, then click on **Create** button
- Next, under *APIs & auth* in the sidebar click on *Credentials* tab
- Click on **Create new Client ID** button
- Select *Web Application* and click on **Configure Consent Screen**
- Fill out the required fields then click on **Save**
- In the *Create Client ID* modal dialog:
- **Application Type**: Web Application
- Click on **Create Client ID** button
- Copy and paste *Client ID* and *Client secret* keys into `.env`

<hr>

<img src="https://en.facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png" width="90">

- Visit <a href="https://developers.facebook.com/" target="_blank">Facebook Developers</a>
- Click **My Apps**, then select **Add a New App* from the dropdown menu
- Enter a new name for your app
- Click on the **Create App ID** button
- Find the Facebook Login Product and click on **Facebook Login**
- Instead of going through their Quickstart, click on **Settings** for your app in the top left corner
- Copy and paste *App ID* and *App Secret* keys into `.env`
- **Note:** *App ID* is **FACEBOOK_ID**, *App Secret* is **FACEBOOK_SECRET** in `.env`
- Enter *Site URL* under *App Domains*
- Choose a **Category** that best describes your app
- Click on **+ Add Platform** and select **Website**
- Enter *Site URL*
- Click on the *Settings* tab in the left nav under Facebook Login

### Local development


After the above requirements have been met:

  

1. Clone this repository and `cd` into it

  

```bash

git clone https://github.com/solancer/quarantineaid-backend.git

cd quarantineaid-backend

```

  

2. Install dependencies

  

```bash

npm install

```

  

3. Set your environment variables

  

See [Twilio Account Settings](#twilio-account-settings) to locate the necessary environment variables.

  

4. Run the application

  

```bash

npm run start

```

  

Alternatively, you can use this command to start the server in development mode. It will reload whenever you change any files.

  

```bash

npm run dev

```

  

5. Navigate to [http://localhost:3000](http://localhost:3000)

That's it!

### Production

  

You can use `npm run start` to start the app in production mode with pm2:

  
  

### Cloud deployment

  

Additionally to trying out this application locally, you can deploy it to a variety of host services. Here is a small selection of them.

  
|  [Zeit](https://zeit.co/) |  [![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/new/project?template=https://github.com/solancer/quarantineaid-backend/tree/master) |
| ------------ | ------------ |
|  [Digital Ocean](https://m.do.co/c/9cf88f4c38f7)  | [![Install on DigitalOcean](https://github.com/cdr/code-server/raw/master/doc/assets/droplet.svg?sanitize=true)](https://m.do.co/c/9cf88f4c38f7) |



## Contributing

  

This project is open source and welcomes contributions. All contributions are subject to our [Code of Conduct](.github/blob/master/CODE_OF_CONDUCT.md).

  

[Visit the project on GitHub](https://github.com/solancer/quarantineaid-backend)

 
[![Say Thanks!](https://img.shields.io/badge/Say%20Thanks-!-1EAEDB.svg)](https://saythanks.io/to/srinivas%40solancer.com)

## License

  

[MIT](http://www.opensource.org/licenses/mit-license.html)

  

## Disclaimer

  

No warranty expressed or implied. Software is as is.

  

[Quarantine Aid]: https://www.quarantineaid.in

