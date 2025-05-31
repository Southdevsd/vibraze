import { Mail, Phone, MapPin } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo size="lg" className="text-white" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Celebre cada momento especial do seu relacionamento com contadores personalizados que capturam a magia do
              amor verdadeiro.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                  Criar Site
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-400 hover:text-white transition-colors">
                  Ver Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                support@vibraze.fun
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                (55+) 11 93761-9869
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Vibraze. Todos os direitos reservados. Feito com ❤️ para casais apaixonados.</p>
        </div>
      </div>
    </footer>
  )
}
