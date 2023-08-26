import { StudentForm } from '@/components/StudentSignupForm';
import { TeacherForm } from '@/components/TeacherSignupForm';
import { useState } from 'react';
import { Pagination, Container } from 'react-bootstrap';

import Head from 'next/head';
import jwt from 'jsonwebtoken';
import nookies from 'nookies';

export default function Register() {
  const [activePaginationIndex, setActivePaginationIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Container style={{ textAlign: 'center', margin: '1em auto' }}>
        <h4>Register</h4>
        <Pagination style={{ justifyContent: 'center' }}>
          <Pagination.Item
            active={activePaginationIndex == 0}
            onClick={() => setActivePaginationIndex(0)}
          >
            Student
          </Pagination.Item>
          <Pagination.Item
            active={activePaginationIndex == 1}
            onClick={() => setActivePaginationIndex(1)}
          >
            Teacher
          </Pagination.Item>
        </Pagination>

        {activePaginationIndex == 0 ? <StudentForm /> : <TeacherForm />}
      </Container>
    </>
  );
}

export function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);

  try {
    const { token } = cookies;
    jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });
    const { res } = ctx;
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
  } catch (e) {}
  return { props: {} };
}
