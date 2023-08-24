import { StudentForm } from '@/components/StudentSignupForm';
import { TeacherForm } from '@/components/TeacherSignupForm';
import { useState } from 'react';
import { Pagination, Container } from 'react-bootstrap';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUserInfo } from '@/components/useUserInfo';

export default function Register() {
  const router = useRouter();
  const { userInfo, error, isLoading } = useUserInfo();

  const [activePaginationIndex, setActivePaginationIndex] = useState(0);

  if (isLoading) return <div>Loading...</div>;
  if (!error && userInfo) {
    router.replace('/');
    return;
  }

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
