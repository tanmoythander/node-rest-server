# node-rest-server
Secure REST API server example with Nodejs, Express, mongoose & JsonWebToken
<h2>Installing on local machine</h2>
<h4>Please make sure you have node.js installed on your machine</h4>
If you don't have, <a href="https://nodejs.org/" >click here...</a>
<br><br>
<b>1. check if you have it installed or not</b>,

	npm -v

and,

	node -v

you should see some version info in return.<br><br>


<b>2. now go to the directory where you want to place the project files using git bash (terminal for mac)</b><br>
run the command

	git clone URL

here URL is the http url you get from the repository page, <a href="https://github.com/tanmoythander/node-rest-server">Click here to clone</a><br><br>

<b>3. now navigate to the project directory with cmd (terminal for mac)</b><br>
run the command

	npm install
	
wait for it to be completed. It usually takes a minute or less to complete.<br>
It will download all the dependencies.<br><br>

<b>4. Now run the command</b>

	npm start	
or,

	node ./bin/www
	
It will serve the project on default port (3484). <br><br>



<h2>API Documentation</h2>

Find the API documentation <a href="https://api.tanmoythander.info/node-rest-server">here</a>.<br>
To create your own API documentation, <a href="http://apidocjs.com/">follow this link</a>.
<br><br>

<h2>Developer Hint</h2>

<b>Install nodemon</b>(run on any directory, recommended for development)

	npm install -g nodemon

in case of mac, you might need to mention "sudo"<br><br>
<b>Now navigate to the project directory with cmd (terminal for mac)</b><br>
run the command

	nodemon ./bin/www
	
It will serve the project and restart on any file change<br>
It's good to remember that, <b>./bin/www</b> is the entry point to the app.<br><br>


<b>Please change your editor configuration like below before you start development</b>

<b>Indent character</b>: "\t" (tab)

<b>Indent size</b>: 2

<b>Line endings</b>: LF (unix)


