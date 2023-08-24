import { useRouter } from 'next/router';
import { useUserInfo } from '@/components/useUserInfo';
import Head from 'next/head';
import { Button } from 'react-bootstrap';

export default function Home() {
  const router = useRouter();
  const { userInfo, error, isLoading } = useUserInfo();

  if (isLoading) return <div>loading...</div>;
  if (error) {
    console.log(error);
    return <div>Connection error</div>;
  }
  if (!userInfo) {
    router.replace('/login');
    return;
  }

  async function logout() {
    await fetch('/api/logoutUser');
    router.replace('/login');
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div>
        {userInfo.username} : {userInfo.type}
      </div>
      <Button variant="danger" onClick={async () => await logout()}>
        Logout
      </Button>
    </>
  );
}
