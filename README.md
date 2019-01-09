# node-rest-server
#### Secure REST API server example with Nodejs, Express, mongoose & JsonWebToken

## Installing on local machine
#### Please make sure you have node.js installed on your machine
If you don't have, [click here...](https://nodejs.org/)


### 1. check if you have it installed or not,

	npm -v

and,

	node -v


you should see some version info in return.


### 2. now go to the directory where you want to place the project files using git bash (terminal for mac)

run the command

	git clone URL

here URL is the http url you get from the repository page, [Click here to clone](https://github.com/tanmoythander/node-rest-server/).
Please note that you need to authenticate to clone this private repository.

### 3. now navigate to the project directory with cmd (terminal for mac)
run the command

	npm install
	
wait for it to be completed. It usually takes a minute or less to complete.
It will download all the dependencies.

### 4. Configure the database
You will need to setup a mongodb database by your own.  
After setting up the database, go to the line 245 of [app.js](https://github.com/tanmoythander/node-rest-server/blob/master/app.js) and replace the **CONNECTION_URI** with your mongodb Connection URI.  
If you dont know your Connection URI please [check here](https://docs.mongodb.com/manual/reference/connection-string/).

### 5. Now run the command

	npm start	
or,

	node app.js
	
It will serve the project on default port (3484).  
The documentation of the default API set can be found [here](https://tanmoythander.info/api/node-rest-server/).


## Developer Hint
It's good to remember that, **./app.js** is the entry point to the app.

### Install nodemon
run on any directory, recommended for development

	npm install -g nodemon

Now navigate to the project directory with cmd (terminal for mac)
run the command

	nodemon app.js

or,

	npm run dev
	
It will serve the project and restart the app on any file change.  

### Build apidoc
If you don't have apidoc installed as a global package,  
run the command

	npm install -g apidoc

Now navigate to the project directory with cmd (terminal for mac)
run the command

	npm run apidoc

It will build the apidoc in the directory **./apidoc**.  

### Lint source
If you don't have eslint installed as a global package,  
run the command

	npm install -g eslint

Now navigate to the project directory with cmd (terminal for mac)
run the command

	npm run eslint

It will show warnings and errors if there is any formatting issue. In case of no formatting issue, it will show nothing.  


#### Please change your editor configuration like below before you start development

#### Indent character: "\t" (tab)

#### Indent size: 2

#### Line endings: LF (unix)
