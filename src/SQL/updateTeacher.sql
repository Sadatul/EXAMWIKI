BEGIN

UPDATE USERS
SET "firstname"=:firstname, "lastname"=:lastname, "instituition"=:instituition, "email"=:email, "hashPassword"=:hash, "image"=:image
WHERE "username"=:username;

UPDATE TEACHERS
SET "subject"=:subject, "class"=:class
WHERE "username"=:username;

END;