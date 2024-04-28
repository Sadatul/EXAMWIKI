# Project Description
This is our Level 2/ Term 2 project. It uses NextJs as its both frontend and backend. We used Oracle 19c as our database.

## Features
1. Our platform facilitates student preparation by offering extensive practice exams sourced from a large question database. Teachers can log in to schedule exams resembling Codeforces contests. Students participate in these rated exams and receive scores based on their performance. Additionally, students can contribute questions to our database, which must be verified by our admin team.
2. Our platform includes a blogging feature where both students and teachers can share their insights. Furthermore, users have the ability to upvote, downvote, and comment on blog posts.


## Technical Stuffs
1. So, we have implemented database connection pool using node-oracledb allowing our application to handle more trafic and scale more easily.
2. We employ the Node.js library "crypto" to hash passwords, ensuring security both at the frontend and in the database.
3. We leverage Firebase to store all of our images, enhancing both the safety and performance of our application.
4. Our database includes a procedure that generates daily statistics, such as the count of new user registrations, created exams, user logins and more
5. Database have log tables for teacher approval, question approval that allows system admin to identify malicious actor with ease

# Quick Start
## Database setup
We have setup a oracle docker image to get you up and running quickly. 
```bash
docker pull sadatul/examwikidatabase
docker run --name "examwikidatabase" -p 1521:1521 -p 5500:5500 -v /opt/oracle/oradata -d examwikidatabase
```
The above commands will create a docker container that has our host 1521 mapped to our dockers 1521 port.
## Application setup
1. Now clone our EXAMWIKI repository.
2. create a .env file using our .env.example file. And fillout the following environment variables
```
DB_USER=EXAMWIKI
DB_PASSWORD=password
DB_CONNECT_STRING=localhost:1521/orapdb1
```
3. You need to provide your firebase credentials via NEXT_PUBLIC_FIREBASE_API_KEY. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID and NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
4. Lastly, you need to set up two environment variables: JWT_SECRET and NEXT_PUBLIC_CRYPTO_SECRET. These can be assigned any random values
5. Finally use the following command to start you application.
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
# Notes for Custom Database setup.
If you wish to create the database on your local host machine or create your own Docker image, you can utilize the dump file located in database_dump_file/EXAMWIKI.DMP. However, there are several crucial steps you must ensure:
1. You must create a user named EXAMWIKI within a pluggable database and ensure it has the appropriate permissions.
2. To ensure a clean start, it's advisable to delete all the data in each table within the database since the passwords won't match due to different secret keys.
