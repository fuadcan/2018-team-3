# 2018-team-3
🃏🤝🃏

## Running the Application

1. Pull the code from this branch `master`
2. In the current directory, run:
```
 rm -rf node_modules; npm i
```
3.  We also need to make sure the database have been updated with the new changes, Using `sequelize` library, we can do this easily
```
export DATABASE_URL=postgres://postgres:dummypassword@localhost:5432/team3dev // making sure your local dev branch is connected
```
4. Whe working locally, sometimes your database will need to be updated to the new schema and changes, we can utilize the `sequelize` library to do so.

```
sequelize db:drop // dropping database
sequelize db:create // creating database
sequelize db:migrate // run database migrations
sequelize db:seed:all // seeding database with dummy data (cardset and cards)
```

4. Because we are working on localhost, we need to build the app, run `npm run heroku-postbuild`
5. run `npm run start` to start the app
6. go to `http://localhost:5000` to see the application.


**The above processes have been all incorpated into a db script found inside the root folder. Therefore if you just run the script, there is no needs to perform steps 3-5.**

To run the bash script in windows or mac:

```
1. Navigate to the root folder of the project directory `/2018-team-3`
2. Run `chmod +x db.sh`
3. make sure you are in the `/2018-team-3` folder and run `./db.sh` 
```

---

## Development

### Before Anything

- Make sure you have [homebrew](https://brew.sh/) installed
- Make sure you have git cli installed (through homebrew or their site)
- Make sure you have Heroku cli installed (through homebrew or their site)
- Install Postgres **Version 10.3** on your local computer. It is **VERY IMPORTANT**
that you install the correct version.
  - If you have homebrew installed run `brew install postgres@10.3`

### Installation

```
$ git clone https://github.com/UWaterlooMSCI342/2018-team-3.git
$ cd 2018-team-3

# install server dependencies
$ npm install

# install client dependencies
$ cd react-ui
$ npm install
```

Now, we will need to set up your local Postgres database.

Check your Postgres version: `postgres -V`

Run the following command to run postgres. You will need to run this command
every time your computer starts up.

`pg_ctl -D /usr/local/var/postgres start && brew services start postgresql`


Run `psql postgres` to start the psql command line. We need to create a new
database locally.

`CREATE DATABASE team3dev;`

You're all set.

In your root direct create an `.env` file and add this:

```
NODE_ENV=development
DATABASE_URL=postgres://postgres:dummypassword@localhost:5432/team3dev
```

Create another `.env` file in your react-ui folder.

```
$ cd `react-ui`
$ touch .env
```

Add the below to .env file.
Add the firebase credentials here as well: The keys should be added below. For values, ask a team-3 developer for the credentials

```
NODE_PATH=src/
REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
```

run ```npm run start``` to inject the env variables

If it's your first time running the app or every time there are new changes
from `master` that have changed your `package.json` (i.e. adding/remove packages):

```
$ npm install
$ cd react-ui/
$ npm install
```

Sometimes, npm is weird and sometimes running the command below will fix things:

`rm-rf node_modules; npm install` in both the root and react-ui folder.


### Adding flow support to a file
- At the top of the file, add `//@flow`

## Deploying

When you are contributing to the codebase, make sure you create a new branch to work off of.
After **2 approvals**, **squash and merge** your branch into master and delete your branch.

Note: Before approving any PR, be sure to pull the remote changes locally and test it out.

Our deployment pipeline consists of two environments: **staging** and **production**.

Once we merge to master, we can deploy our branch to staging. Test all your changes
at https://team-3-staging.herokuapp.com. Once it's good to go, you can promote it to
production.

View the production app at https://team-3-staging.herokuapp.com.

Always remember to run database migrations on both staging and production.


Made with 💜 by Ayat, Danial, Jason, Ishani, Priyanka, and Victoria.
