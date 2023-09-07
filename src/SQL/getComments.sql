SELECT "user", "id", "blog", "body", TO_CHAR("date") AS "dateString", USER_HAS_ACCESS_IN_COMMENT(:username, "id") AS "hasAccess"
FROM COMMENTS
WHERE "blog"=:blogId AND EQUAL_NULLABLE("parent", :parent)='Y'
ORDER BY "date" ASC