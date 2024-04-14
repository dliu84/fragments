PUT http://localhost:8080/v1/fragments/randomid
Content-Type: text/plain
"hello"

HTTP/1.1 401

PUT http://localhost:8080/v1/fragments/randomid
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhjlkkj3JkMQ==
Content-Type: text/plain
"hello"

HTTP/1.1 401

POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
`This is a fragment!`

# Server returns 201
HTTP/1.1 201
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"
id: jsonpath "$.fragment.id"

# GET the fragment
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Length: 19
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is a fragment!"

# Update (PUT) fragment data we just posted
PUT {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
`This is an updated fragment!`

HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragment.size" == 28

# GET the fragment we just updated
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Length: 28
[Asserts]
header "Content-Type" startsWith "text/plain"
body == "This is an updated fragment!"

PUT http://localhost:8080/v1/fragments/whatever
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/plain
`This is an updated fragment!`

HTTP/1.1 404
