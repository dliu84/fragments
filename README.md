# fragments
CCP555 course works - Lab 1

GitHub repo and local machine:
- create a private GitHub repo, add README file and .gitignore for node file
- in local machine, run:
  - git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY

check staging tree, run:
- git status

add modified files to the staging tree, run
- git add file_1 file_2 file_3 file_4

commit the changes, run:
- git commit -m "message content"

create a folder called src, run:
- mkdir src

open VScode folder in terminal, run:
- code .

run eslint: 
- npm run lint

start the server using any of three methods, run: 
- npm start
- npm run dev
- npm run debug

test the server can be started manually, run:
- 1. node src/server.js
- 2. browse to http://localhost:8080 to check, or run the following step instead:
- 2. in another terminal, run:
     - curl localhost:8080
	
use jq to format, query and transform JSON data:
- curl -s localhost:8080 | jq

run debugger
- 1. set a break point in VScode
- 2. in VScode, run -> start debugging
- 3. in another terminal, run:
     - curl localhost:8080, and the break point will be hit

