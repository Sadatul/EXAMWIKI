SELECT "id", "startDate", "organizer", "duration", "class", COUNT("question") QUESTION_COUNT
FROM SCHEDULEDEXAM NATURAL JOIN EXAM
JOIN EXAMUSESQUESTIONS EQ ON "id" = EQ."exam"
WHERE ("startDate" + interval '1' minute * "duration") >= SYSDATE
GROUP BY "id", "startDate", "organizer", "duration", "class"
ORDER BY "startDate"