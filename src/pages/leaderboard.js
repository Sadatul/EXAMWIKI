import { runQuery } from '@/utils/runQuery';
import Head from 'next/head';
import { Container, Pagination, Table } from 'react-bootstrap';
import { useState } from 'react';
import Link from 'next/link';

export default function Leaderboard({ ratingRanking, contributionRanking }) {
  const [showRankByRating, setShowRankByRating] = useState(true);

  return (
    <>
      <Head>
        <title>Leaderboard</title>
      </Head>

      <Container style={{ margin: '2em auto' }}>
        <Pagination style={{ justifyContent: 'center' }}>
          <Pagination.Item
            active={showRankByRating}
            onClick={() => setShowRankByRating(true)}
          >
            Rating
          </Pagination.Item>
          <Pagination.Item
            active={!showRankByRating}
            onClick={() => setShowRankByRating(false)}
          >
            Contribution
          </Pagination.Item>
        </Pagination>

        <h3 style={{ textAlign: 'center', margin: '1em' }}>
          Top{' '}
          {showRankByRating ? ratingRanking.length : contributionRanking.length}{' '}
          {showRankByRating ? 'rated students' : 'contributors'}
        </h3>

        <Table striped bordered hover style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Username</th>
              <th>Name</th>
              <th>{showRankByRating ? 'rating' : 'contribution'}</th>
            </tr>
          </thead>
          <tbody>
            {(showRankByRating ? ratingRanking : contributionRanking).map(
              (info) => (
                <tr key={info.username}>
                  <td>{info.ranking}</td>
                  <td>
                    <Link href={`/profile/${info.username}`}>
                      {info.username}
                    </Link>
                  </td>
                  <td>{info.name}</td>
                  <td>{showRankByRating ? info.rating : info.contribution}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const ratingRankingQuery = `SELECT * FROM
    (SELECT "username", TRIM("firstname" || ' ' || NVL("lastname", '')) "name", "ranking", "rating"
    FROM USERS NATURAL JOIN
      (SELECT 
        "username", "rating", (SELECT COUNT(*) + 1 FROM STUDENTS S2 WHERE S2."rating" > S1."rating") "ranking"
      FROM
        STUDENTS S1
      )
    ORDER BY "ranking")
    WHERE ROWNUM <= 100`;

  const contributionRankingQuery = `SELECT * FROM 
  (SELECT 
  (SELECT COUNT(*) + 1 FROM USERS U2 WHERE U2."contribution" > U1."contribution") "ranking",
  "username", 
  TRIM("firstname" || ' ' || NVL("lastname", '')) "name", 
  "contribution"
  FROM USERS U1
  ORDER BY "ranking")
  WHERE ROWNUM <= 100`;

  const ratingRanking = (await runQuery(ratingRankingQuery, false, {})).rows;
  const contributionRanking = (
    await runQuery(contributionRankingQuery, false, {})
  ).rows;

  return { props: { ratingRanking, contributionRanking } };
}
