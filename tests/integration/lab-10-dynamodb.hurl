# 1. POST a new JSON fragment to http://localhost:8080 as an authorized user. 
#    The fragment's body should be the JSON value, { "service": "DynamoDB" }.
POST http://localhost:8080/v1/fragments

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a JSON fragment
Content-Type: application/json
# Body of the request
{ "service": "DynamoDB" }

# 2. Confirm that the server returns a 201, and capture the Location header value and the fragment's id in variables 
#    named fragment1_url and fragment1_id.
HTTP/1.1 201

[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# Capture the Location URL into a variable named `url`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. GET the fragment info (i.e., metadata) for the fragment you just created using the Location URL/info  
#    as an authorized user and confirm that the server returns a 200 and that all of the metadata properties match what you expect.
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]

jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.

jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# 4. POST a second Markdown fragment to http://localhost:8080 as the same authorized user. 
#    The fragment's body should be the Markdown value, DynamoDB is **great**..
POST http://localhost:8080/v1/fragments

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a markdown fragment
Content-Type: text/markdown
# Body of the request
`DynamoDB is **great**.`

# 5. Confirm that the server returns a 201, and once again capture the Location header value and the second id 
#    in variables named fragment2_url and fragment2_id.
HTTP/1.1 201

[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. GET the fragment info (i.e., metadata) you just created using the url/info as an authorized user 
#    and confirm that the server returns a 200 and that all of the metadata properties match what you expect.
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 22

# 7. GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) 
#    and confirm that the list of fragments includes the two id values you captured above
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" count == 2
jsonpath "$.fragments.[0]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments.[0]" == {{fragment1_id}}
jsonpath "$.fragments.[1]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments.[1]" == {{fragment2_id}}

# 8. DELETE the first fragment you created above
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# 9. Confirm that the server returns a 200
HTTP/1.1 200

# 10. Try to GET the first fragment again using the url you captured above as the authorized user.
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

# 11. Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404

# 12. GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) a second time, 
#     and confirm that the first id is NOT included but that the second id is (i.e., that the second was not deleted).
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
