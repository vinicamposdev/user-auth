# API requirements 
 - Basic signup API
 - Login API
 - Validate token API
## Signup API
1. This API must accept the following FORM params in the POST method: email (required and unique)
 - password (required)
 - name (required, not unique)
 - dob (optional)
 - role (required)
2. This API must return HTTP status 200 only if sign up is successful.
## Login API
1. This API must accept the following FORM params in the POST method:
   1. email (required and should be registered in signup)
   2. password (required)
2. You can successfully login only if email ID and the password matches. The following are your tasks: Generate a jwt token.
   1. Generate a jwt token.
   2. Add the token in the response with the Token key.
   3. If login is successful, then return HTTP status 200.
3. This API must force customers to reset their password after "X" unsuccessful login attempts.
## Validate token API
1. This API must accept tokens with the Token key from the header in the POST method.
2. If the token is valid, then:
   1. Get the email ID belonging to the token.
   2. Make a JSON body with the token and user ID { token, userId }.
   3. Return HTTP status 200 with the JSON body.
## Bonus
Write at least one test case for the login API endpoint (requirement #3) using Jest testing framework.