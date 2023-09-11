import { runQuery } from '@/utils/runQuery';
import { Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';


export default function HistoryPage({ repo }) {
  const router = useRouter();
  let examList = [];
  for (let i = 0; i < repo.rows.length; i++) {
    examList.push(
      <tr key={i}>
        <td>{repo.rows[i].exam}</td>
        <td>{new Date(repo.rows[i].date).toLocaleString()}</td>
        {/* <td>{formatAMPM(new Date(repo.rows[i].date))}</td> */}
        {/* <td className="text-center"><Button
                    onClick={() => {
                        router.push({
                            pathname: '/exam/exam_report',
                            query: {
                                examId: repo.rows[i].exam,
                            }
                        })
                    }}
                >Goto Report</Button></td> */}
        <td className="text-center">
          <Link
            href={{
              pathname: '/exam/exam_report',
              query: {
                username: repo.username,
                examId: repo.rows[i].exam,
              },
            }}
            target="_blank"
            className=" text-white text-sm 
                    no-underline p-1 rounded-xl bg-blue-500 hover:bg-blue-950"
          >
            Go To Report
          </Link>
        </td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>History</title>
      </Head>
      <div>
        <div className="text-center text-3xl font-bold mt-5">
          Exam History of {repo.username}
        </div>
        <div className="w-2/3 mt-5 mx-auto">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Exam Id</th>
                <th>Date</th>
                <th className="text-center">Link</th>
              </tr>
            </thead>
            <tbody>{examList}</tbody>
          </Table>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  console.log(context.query);
  if (!context.query.username) {
    return { redirect: { destination: '/', permanent: false } };
  }

  const existResult = await runQuery(
    'SELECT * FROM USERS WHERE "username"=:username',
    false,
    { username: context.query.username }
  );
  if (existResult.rows.length == 0)
    return {
      notFound: true,
    };

  const exams_data = await runQuery(
    `SELECT "exam", "date"
        FROM STUDENTTAKESEXAM
        WHERE "student"=:username
        ORDER BY "date" DESC`,
    false,
    {
      username: context.query.username,
    }
  );

  for (let i = 0; i < exams_data.rows.length; i++) {
    exams_data.rows[i].date = exams_data.rows[i].date.toISOString();
  }
  console.log(exams_data.rows);
  let repo = {
    username: context.query.username,
    rows: exams_data.rows,
  };
  return {
    props: {
      repo,
    },
  };
};
