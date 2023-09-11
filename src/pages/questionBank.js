import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { runQuery } from '@/utils/runQuery';
import QuestionResult from '@/components/QuestionResult';

const questionsPerPage = 20;

export default function QuestionBank({ topics }) {
  const [questions, setQuestions] = useState(null);
  const [hasNext, setHasMext] = useState(true);
  const [hasPrevious, setHasPrevious] = useState(false);

  const [topicId, setTopicId] = useState('any');
  const [difficulty, setDifficulty] = useState('any');
  const [approvedOnly, setApprovedOnly] = useState(true);

  async function fetchQuestions(
    bound,
    greaterThanString,
    topicId,
    difficulty,
    approvedOnlyTruthValue
  ) {
    const response = await fetch(
      `/api/getQuestions?bound=${bound}&greaterThan=${greaterThanString}&amount=${questionsPerPage}${topicId != 'any' ? `&topicId=${topicId}` : ''
      }${difficulty != 'any' ? `&difficulty=${difficulty}` : ''}${approvedOnlyTruthValue ? '&approvedOnly=true' : ''
      }`
    );
    const result = await response.json();

    setQuestions(result.questions);

    if (greaterThanString == 'true') setHasMext(result.hasMore);
    else setHasPrevious(result.hasMore);
  }

  useEffect(() => {
    fetchQuestions(0, 'true', 'any', 'any', approvedOnly);
  }, []);

  return (
    <>
      <Head>
        <title>Question Bank</title>
      </Head>
      <Container style={{ marginBottom: '2em' }}>
        <div
          style={{
            marginTop: '2em',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Form.Select
            style={{ textAlign: 'center' }}
            value={topicId}
            onChange={(e) => {
              setTopicId(e.target.value);
              fetchQuestions(
                0,
                'true',
                e.target.value,
                difficulty,
                approvedOnly
              );
            }}
          >
            <option value="any">Any topic</option>
            {topics.map((t) => (
              <option key={t.topicId} value={t.topicId}>
                {t.topic}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            style={{ textAlign: 'center', width: '40%' }}
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              fetchQuestions(0, 'true', topicId, e.target.value, approvedOnly);
            }}
          >
            <option value="any">Any difficulty</option>
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </Form.Select>
        </div>
        <Form.Group className="flex flex-row justify-center text-red-500 font-bold" style={{ display: 'flex', marginTop: '1em' }}>
          <Form.Check
            style={{ marginRight: '0.5em' }}
            checked={approvedOnly}
            onChange={(e) => {
              setHasPrevious(false);
              setHasMext(true);
              setApprovedOnly(e.target.checked);
              fetchQuestions(0, 'true', topicId, difficulty, e.target.checked);
            }}
          />
          <Form.Label>Show admin-approved questions only</Form.Label>
        </Form.Group>

        {questions &&
          questions.map((q) => (
            <QuestionResult
              key={q.id}
              questionObj={{
                id: q.id,
                body: q.body,
                options: options(
                  q.optionA,
                  q.optionB,
                  q.optionC,
                  q.optionD,
                  q.optionE
                ),
                image: q.image,
              }}
              givenAnswer="N"
              actualAnswer={q.answer}
            />
          ))}

        <div style={{ textAlign: 'center', marginTop: '2em' }}>
          {hasPrevious && (
            <Button
              style={{ marginRight: '1em' }}
              onClick={() => {
                setHasMext(true);
                fetchQuestions(
                  questions[0].id,
                  'false',
                  topicId,
                  difficulty,
                  approvedOnly
                );
              }}
            >
              Previous
            </Button>
          )}
          {hasNext && (
            <Button
              onClick={() => {
                setHasPrevious(true);
                fetchQuestions(
                  questions[questions.length - 1].id,
                  'true',
                  topicId,
                  difficulty,
                  approvedOnly
                );
              }}
            >
              Next
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}

function options(a, b, c, d, e) {
  const arr = [a, b, c, d];
  if (e) arr.push(e);
  return arr;
}

export async function getServerSideProps() {
  const topics = (
    await runQuery(
      `SELECT "topicId", "class" || ': ' || "subject" || ', '  || "chapter" || ', ' || "topic" AS "topic" FROM TOPICINFO`,
      false,
      {}
    )
  ).rows;

  return { props: { topics } };
}
