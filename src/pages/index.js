import Image from 'next/image'
import { Inter } from 'next/font/google'
import Exam from '@/components/Exam'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

const examData = {
  questionCount: 10
}

export default function Home() {

  return (
    <main>
      <Link
        href={{
          pathname: '/exam/practice',
          query: { examData: 'my-post' },
        }}
      >Go to Exam</Link>
      {/* <Exam examData={examData} /> */}
    </main>
  )
}
