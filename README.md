This application is a completely severless web application which is a small clone of netflix.



Process Outline and Key Steps
Step 1: Set up Cognito for User Authentication
1.	Created a Cognito User Pool:
o	Defined user attributes such as username, email, and sub (Cognito’s unique user identifier).
o	Set up email verification for users.
2.	Post Confirmation Lambda Trigger:
o	Configured a Lambda function as a post-confirmation trigger in Cognito.
o	Purpose: To save user metadata in DynamoDB once the user is confirmed.
Step 2: Configure API Gateway
1.	Set Up API Gateway:
o	Created routes for user signup, verification, and login.
o	Enabled CORS to allow access from the frontend (localhost:3000).
2.	Integration with Lambda:
o	Integrated each route in API Gateway with a corresponding Lambda function.
o	Configured appropriate HTTP methods (POST for signup, login, etc.).
Step 3: Set up DynamoDB for User Metadata Storage
1.	Created a DynamoDB Table:
o	Defined UserID as the partition key to store unique user data.
o	Stored username, email, and other relevant user attributes.
2.	Configured Lambda Permissions:
o	Added dynamodb:PutItem permissions to Lambda’s IAM role to allow it to write to the DynamoDB table.
Step 4: Store Media Files in S3
1.	Configured S3 Buckets:
o	Created S3 buckets for storing movies, posters, and trailers.
o	Set bucket policies to allow controlled access to media files.
2.	Media Fetch Lambda Functions:
o	Created Lambda functions to interact with S3 and retrieve media data as needed by the frontend.
Step 5: Frontend Implementation
1.	Developed React Components:
o	Created signup, login, and verification components.
o	Configured Axios requests to interact with the API Gateway endpoints.
2.	Store JWT for User Sessions:
o	Configured the login flow to store JWT tokens in local storage to manage sessions.


________________________________________
Flowchart Representation
Here’s a description of the flowchart that can be used to visualize this process:
1.	User Signup on Frontend:
o	User enters signup details ➔ API Gateway ➔ Lambda (signup function) ➔ Cognito ➔ Sends confirmation code to user email.
2.	User Confirmation and Metadata Storage:
o	User confirms code ➔ API Gateway ➔ Lambda (verification function) ➔ Cognito triggers Post Confirmation Lambda ➔ Lambda stores user metadata in DynamoDB.
3.	User Login:
o	User logs in ➔ API Gateway ➔ Lambda (login function) ➔ Cognito authenticates ➔ Returns JWT ➔ Frontend stores JWT for session.
4.	Media Retrieval:
o	User requests media ➔ API Gateway ➔ Lambda fetches media from S3 ➔ Returns data to frontend.



________________________________________
Problems and Errors Encountered
Cognito Errors
1.	Username Cannot Be in Email Format:
o	This error occurred because Cognito was configured to not accept email formats as usernames.
2.	Preferred Username Error:
o	Error message about Preferred username configuration; fixed by adjusting Cognito settings to allow usernames as preferred identifiers.
Lambda Errors
1.	require Not Defined Error:
o	The Lambda function was using require syntax, which caused errors due to ES module settings. Switched to import syntax.
2.	DynamoDB Permission Denied:
o	Encountered AccessDeniedException when Lambda tried to access DynamoDB due to insufficient permissions. Resolved by adding dynamodb:PutItem to Lambda’s IAM role.
API Gateway Errors
1.	CORS Policy Error:
o	Initial CORS setup issues prevented API Gateway from accepting requests from localhost:3000. Resolved by configuring CORS settings in API Gateway.
2.	Invalid Lambda Response:
o	Error messages like Unrecognizable Lambda output appeared due to incorrect return structure in the Lambda functions. Fixed by adjusting the JSON structure in Lambda responses.
S3 Errors
1.	Access Denied:
o	Configuring access permissions for the S3 bucket was challenging, especially for allowing the correct policies to permit frontend access to media files.
General Debugging Issues
1.	Axios Network Errors:
o	Encountered Network Error issues in Axios due to API Gateway settings and CORS misconfigurations. Resolved by correctly configuring API Gateway endpoints and enabling CORS.
2.	Lambda Console Testing Issues:
o	Faced challenges with simulating real events in the Lambda console. This required creating custom test events with attributes similar to actual requests from API Gateway and Cognito.


Serverless Application Flowchart Outline
________________________________________
1. Client Interaction
•	Step 1: Start
•	Arrow: User initiates an action from the web browser.
________________________________________
2. API Gateway Routes
•	Step 2: API Gateway
o	Routes requests based on the endpoint.
•	Arrows:
o	/login (POST): API Gateway → Auth Lambda for login.
o	/signup (POST): API Gateway → Auth Lambda for signup.
o	/movies/getMovies (GET): API Gateway → Get Movies Lambda
o	/movies/getMovieDetails/{id} (GET): API Gateway → Get Movie Details Lambda with Movie ID parameter.
o	/movies/getMovieTrailers/{id} (GET): API Gateway → Get Movie Trailers Lambda with Movie ID parameter.
o	/search/history (GET): API Gateway → Search History Lambda.
o	/search/history/{id} (DELETE): API Gateway → Delete History Lambda with Item ID.

________________________________________
3. Lambda Functions
•	Step 3: Authentication Lambda (Login, Signup)
o	Actions: Handles user authentication using Cognito for login and signup.
o	Arrow: Auth Lambda → Cognito for token validation and user management.
o	Response: Returns JWT token and success message back to the client through API Gateway.
•	Step 4: Get Movies Lambda
o	Actions: Retrieves a list of movies.
o	Arrow: Get Movies Lambda → DynamoDB to query movie data.
o	Response: Sends movie list back to the client through API Gateway.
•	Step 5: Get Movie Details Lambda
o	Actions: Retrieves detailed information about a specific movie.
o	Parameter: Accepts Movie ID from the API Gateway request.
o	Arrow: Get Movie Details Lambda → DynamoDB to retrieve specific movie details.
o	Response: Returns movie details to the client through API Gateway.
•	Step 6: Get Movie Trailers Lambda
o	Actions: Retrieves trailers for a specific movie.
o	Parameter: Accepts Movie ID.
o	Arrow: Get Movie Trailers Lambda → DynamoDB to fetch trailer links.
o	Response: Sends trailer URLs back to the client.
•	Step 7: Search History Lambda
o	Actions: Retrieves or deletes user search history.
o	Arrows:
	Retrieve History → DynamoDB → Client
	Delete Item (with ID) → DynamoDB for deletion → Client
________________________________________
4. Database (DynamoDB)
•	Actions: Stores user data, search history, movies, trailers, and playback position.
•	Arrows: Lambda Functions interact with DynamoDB for storing and retrieving data.
________________________________________
5. Cognito (For Authentication)
•	Description: Authenticates users for login and signup.
•	Arrows:
o	Login Request → Cognito (Auth token returned).
o	Signup Request → Cognito (Account created and verified).
________________________________________
6. Return Path
•	Step 9: API Gateway → Client
o	After each Lambda function finishes, the response goes back through API Gateway.
o	Final Arrows: Each Lambda Function → API Gateway → Client
________________________________________
With this structure, you can draw boxes for each service (e.g., Client, API Gateway, Lambda Functions, DynamoDB, Cognito) and connect them with arrows labelled according to the actions and parameters described above. This flowchart will illustrate both the data flow and the function of each service within your server less application.
