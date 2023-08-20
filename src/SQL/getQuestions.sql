-- SELECT *
-- FROM   (
--     SELECT "body"
--     FROM QUESTIONS
-- 		WHERE "topicId" = 'hscBan0101'
-- 		AND "approved" = 'Y'
--     ORDER BY DBMS_RANDOM.RANDOM)
-- WHERE  rownum < 21

BEGIN
    TEST(:s, :p_cur);
END