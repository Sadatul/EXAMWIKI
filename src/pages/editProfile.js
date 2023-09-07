import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import Head from 'next/head';
import { Container } from 'react-bootstrap';
import { StudentEditProfileForm } from '@/components/StudentEditProfileForm';
import { TeacherEditProfileForm } from '@/components/TeacherEditProfileForm';
import { runQueryFromFile } from '@/utils/runQuery';

export default function EditProfile({ type, info }) {
  return (
    <>
      <Head>
        <title>Edit Profile</title>
      </Head>
      <Container style={{ margin: '2em auto' }}>
        {type == 'student' ? (
          <StudentEditProfileForm info={info} />
        ) : (
          <TeacherEditProfileForm info={info} />
        )}
      </Container>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  try {
    const { token } = cookies;
    const { username, type } = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const { rows } = await runQueryFromFile(
      type == 'student' ? 'getStudentInfo' : 'getTeacherInfo',
      false,
      { username }
    );
    return { props: { type, info: rows[0] } };
  } catch (e) {
    const { res } = context;
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
}
