TeaDistribution
===============

P2P video conferencing


Authors
-------

[Gregory Gan](https://github.com/gtgan)  
[Ashwin Ramaswamy](https://github.com/arcpu-net786)  
[Karanbir Bains](https://github.com/ksbains)  


Resources
---------

[tutorial](https://www.youtube.com/watch?v=DvlyzDZDEq4&ab_channel=WebDevSimplified)


How to Run Locally
------------------

0) Highly recommend watching the tutorial. It explains literally every single line of code and many possible errors.

Personalize Xoom
1) First Download the 'Xoom' File

2) Inside 'Public/Script.js', change the IP address to your local IP address (192.168 ... etc.)

Install Dependencies
3) cd into Xoom folder

4) run 'npm i express ejs socket.io' to install ejs and socket.io

5) run 'npm i uuid' to install UUID4

6) run 'npm i --save-dev nodemon' to install nodemon

7) run 'npm i -g peer' to install peerjs

Start the Server
8) To start the server: 'npm run devStart'. You should see this sample output:

        username@MacBook-Pro Xoom % npm run devStart
        > zoom-clone@1.0.0 devStart /Users/username/Xoom
        > nodemon server.js

        [nodemon] 2.0.6
        [nodemon] to restart at any time, enter `rs`
        [nodemon] watching path(s): *.*
        [nodemon] watching extensions: js,mjs,json
        [nodemon] starting `node server.js`
        [nodemon] restarting due to changes...
        [nodemon] starting `node server.js`
        [nodemon] restarting due to changes...
        [nodemon] starting `node server.js`
        [nodemon] restarting due to changes...

9) open another separate Terminal window and cd into Xoom like before

10) in the second Terminal window run 'peerjs --port 3001' to start peerjs. You should see this sample output initially:

        Started PeerServer on ::, port: 3001, path: / (v. 0.5.3)
        
11) Now you can go to 'http://[your local IP address (the 192.168...thing)]:3000'. The server should automatically fill a Universally Unique ID (UUID) at the end of the url. You can add other browser sessions to the same url and should be able to see each other.

12) Everytime someone connects, you should see this sample output appended to the peerjs output:
        
        Client connected: f0c256fc-a99f-45d1-97d6-7ef8d92c3f69
        Client disconnected: f0c256fc-a99f-45d1-97d6-7ef8d92c3f69
        Client connected: b92bb6b5-1600-438d-a8bd-38dff4ea1aff
