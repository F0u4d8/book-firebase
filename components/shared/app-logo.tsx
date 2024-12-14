import Link from 'next/link'
import { lusitana } from './fonts'
import Image from 'next/image'

export default function AppLogo() {
  return (
    <Link href="/" className="flex-start">
      <div
        className={`${lusitana.className} flex items-center space-x-2`}
      >
        <Image
          src="/logo.png"
          width={100}
          height={100}
          alt={`Book app logo`}
          priority
        />
        <span className="text-xl">Book App</span>
      </div>
    </Link>
  )
}