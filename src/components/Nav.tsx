import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-gray-800 text-gray-200">
      <div className="font-bold text-secondary">Log Z Quiz</div>
      <ul className="flex space-x-4 text-sm">
        <li>
          <Link href="/" className="hover:underline">Home</Link>
        </li>
        <li>
          <Link href="/quizes" className="hover:underline">Quizes</Link>
        </li>
        <li>
          <Link href="/como-funciona" className="hover:underline">Como Funciona</Link>
        </li>
        <li>
          <Link href="/depoimentos" className="hover:underline">Depoimentos</Link>
        </li>
        <li>
          <Link href="/login" className="hover:underline">Entrar</Link>
        </li>
        <li>
          <Link href="/register" className="hover:underline">Registrar</Link>
        </li>
      </ul>
    </nav>
  )
}