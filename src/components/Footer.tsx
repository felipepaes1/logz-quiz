import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-800 p-6 text-sm text-gray-400">
      <div className="flex flex-wrap justify-between gap-8">
        <div>
          <h4 className="font-semibold mb-2 text-gray-300">Links rápidos</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/como-funciona" className="hover:underline">
                Como Funciona
              </Link>
            </li>
            <li>
              <Link href="/depoimentos" className="hover:underline">
                Depoimentos
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-gray-300">Suporte</h4>
          <ul className="space-y-1">
            <li>
              <Link href="/central-de-ajuda" className="hover:underline">
                Central de Ajuda
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:underline">Contato</Link>
            </li>
            <li>
              <Link href="/termos" className="hover:underline">Termos de Uso</Link>
            </li>
            <li>
              <Link href="/privacidade" className="hover:underline">Privacidade</Link>
            </li>
          </ul>
        </div>
        <div>
          <p>© 2025 Log Z Tech LTDA.</p>
          <p className="text-xs mt-1 text-gray-500">
            Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}