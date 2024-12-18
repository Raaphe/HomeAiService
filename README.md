# HomeAiService
Home Ai Service Platform.

This is an express backend service that is deployed using render. It is currently (as of December 2024) live over at this link : [https://homeaiservice.onrender.com/api/v1/docs/](https://homeaiservice.onrender.com/api/v1/docs/).

#### Node Environments

There are two node environment variables set up on this project ; `test`, `production`

---

**Test** is used for local deployment and testing. It will deploy the app on your machine at `http://localhost:10000/`. There isn't any SSL certification when running things locally. To run things locally you can follow these steps:

1. Clone :
```bash
git clone https://github.com/Raaphe/HomeAiService.git
```
2. Change Directory
```bash
cd HomeAiService
```
3. Install Dependencies
```bash
npm i
```
4. Build and Run
```bash
npm build
npm run dev
```

---

**Production**

To run our deployed app securely with SSL, we rely on render to provide a wrapper for our app that **is** `https`. When our app is deployed, render exposes a machine that can be accessed via `https` that hosts our app, so we don't have to set up `SSL` ourselves. To run the app in production in render like we did you'd follow a few simple steps.

1. Create Render Account and Project
Head over to render and create a `Service` project. Set up the project with this GitHub URL
2. Build and run Stages
To ensure that the app doesn't use up the limited RAM on our render machine, deploying in production ends up being slightly different.

**Build**: In the settings of your app under `Build Command` enter this : `npm ci --include=dev && npm run build`. This will first install only the necessary dependencies and then run a build. We use `tsc` to compile our typescript code to javascript under a `/dist/` directory since javascript is more lightweight. A more comprehensive look at the build scripts can be found in the `package.json`.

**Run**: Again in the settings, under `Start Command`, enter this : `npm run dev`. This simply runs the app.

---

> [!NOTE]
> We do use environment variables that follow this structure :

```env
NODE_ENV=test | production
TEST_DB_NAME=home_test
DB_NAME=home
CLUSTER_URI=mongodb+srv://<YOUR_USER>:<YOUR_PASSWORD>@cluster0.sdueo.mongodb.net/home?retryWrites=true&w=majority 
DB_URI_TEST=mongodb+srv://<YOUR_USER>:<YOUR_PASSWORD>@cluster0.sdueo.mongodb.net/home_test?retryWrites=true&w=majority 
JWT_SECRET=<SUPER_SECRET_SECRET>
SESSION_SECRET=<SUPER_SECRET_SECRET>
DATASET_PATH=dist/data/datasets/realtor-data.zip.csv
MODEL_NAME=median-model
KAGGLE_USERNAME=<YOUR_KAGGLE_USERNAME>
KAGGLE_KEY=<YOUR_KAGGLE_KEY>
```
