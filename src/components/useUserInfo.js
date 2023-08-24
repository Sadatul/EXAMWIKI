import useSWR from 'swr';

export function useUserInfo() {
  const { data, error, isLoading } = useSWR('/api/getUsername', async (url) => {
    const res = await fetch(url);
    const userInfo = await res.json();
    return userInfo;
  });

  return {
    userInfo: data,
    error,
    isLoading,
  };
}
