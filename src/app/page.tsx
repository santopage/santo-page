'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react"; // Ícone do Lucide para o botão

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-center items-center">
          <h1 className="text-2xl font-bold text-primary">SantoPage</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Crie um QR Code com Memórias e Orações da sua Família
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Com o SantoPage, você pode criar páginas personalizadas com fotos da sua família e orações especiais. 
            Gere um QR Code único para compartilhar essas memórias com quem você ama.
          </p>
          <Link href="/create">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg"
            >
              Criar Minha Página
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} FavMemory. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}