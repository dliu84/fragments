POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
# Body of the request goes in ```...``` when it's a string
`# This is a fragment!`

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "text/markdown"

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# If the request is missing the Authorization header, it should be forbidden
GET {{url}}/info

HTTP/1.1 401

GET {{url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhjlkkj3JkMQ==

HTTP/1.1 401

GET {{url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
header "Content-Type" startsWith "text/markdown"

jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
# 21 is the length of our fragment data: '# This is a fragment!'
jsonpath "$.fragment.size" == 21

GET http://localhost:8080/v1/fragments/randomid/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404
