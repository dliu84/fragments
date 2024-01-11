# fragments
CCP555 course works - Lab 1

create a folder called src:
- mkdir src

git status
- git add file_1 file_2 file_3 file_4
- git commit -m "message content"

run eslint: 
- npm run lint
start the server using any of three methods: 
- npm start
- npm run dev
- npm run debug

test the server can be started manually:
	- node src/server.js
	- browse to http://localhost:8080 to check
	- OR: in another terminal, run: curl localhost:8080
	
use jq to format, query and transform JSON data:
	- curl -s localhost:8080 | jq

