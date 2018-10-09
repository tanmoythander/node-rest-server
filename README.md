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

### 4. Now run the command

	npm start	
or,

	node app.js
	
It will serve the project on default port (3484).


## Developer Hint

### Install nodemon
run on any directory, recommended for development

	sudo npm install -g nodemon


### Now navigate to the project directory with cmd (terminal for mac)
run the command

	nodemon app.js
	
It will serve the project and restart on any file change
It's good to remember that, "./app.js" is the entry point to the app.


#### Please change your editor configuration like below before you start development

#### Indent character: "\t" (tab)

#### Indent size: 2

#### Line endings: LF (unix)
