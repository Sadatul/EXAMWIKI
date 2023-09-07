SELECT * FROM
(SELECT "id", "body", TO_CHAR("date") AS "dateString", "postedBy", "title", GET_UPVOTE_COUNT("id") AS "upvotes", GET_DOWNVOTE_COUNT("id") AS "downvotes", GET_VOTE_IN_BLOG(:username, "id") AS "myVote", USER_HAS_ACCESS_IN_BLOG(:username, "id") AS "hasAccess"
FROM
BLOGS
ORDER BY "date" DESC)
WHERE ROWNUM <= :blogCount