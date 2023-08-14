import Image from 'next/image'
import { Inter } from 'next/font/google'
import Exam from '@/components/Exam'

const inter = Inter({ subsets: ['latin'] })

const examData = {
  questionCount: 10
}

export default function Home() {

  return (
    <main>
      <Exam examData={examData} />
    </main>
  )
}
