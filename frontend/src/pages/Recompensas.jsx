import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Recompensas() {
  const { user } = useAuth()
  const [pontosUsuario] = useState(385) // Mock - vir do backend
  
  const recompensas = [
    { id: 1, nome: 'Voucher R$ 10', pontos: 50, imagem: '🎁', descricao: 'Vale-compras em lojas parceiras' },
    { id: 2, nome: 'Voucher R$ 25', pontos: 100, imagem: '🎁', descricao: 'Vale-compras em lojas parceiras' },
    { id: 3, nome: 'Voucher R$ 50', pontos: 200, imagem: '🎁', descricao: 'Vale-compras em lojas parceiras' },
    { id: 4, nome: 'Frete Grátis', pontos: 75, imagem: '🚚', descricao: 'Uma entrega grátis' },
    { id: 5, nome: 'Doação ONG', pontos: 150, imagem: '❤️', descricao: 'Converta em doação' },
    { id: 6, nome: 'Certificado ESG', pontos: 300, imagem: '📜', descricao: 'Certificado de impacto ambiental' }
  ]

  const trocarPontos = (recompensa) => {
    if (pontosUsuario >= recompensa.pontos) {
      alert(`Você trocou ${recompensa.pontos} pontos por: ${recompensa.nome}!`)
      // TODO: Integrar com backend
    } else {
      alert(`Você precisa de ${recompensa.pontos - pontosUsuario} pontos a mais`)
    }
  }

  return (
    <div>
      <header>
        <h1>🎁 Catálogo de Recompensas</h1>
        <p>Troque seus pontos por prêmios incríveis</p>
      </header>

      <main>
        <section>
          <div className="destaque-pontos">
            <h3>Seus Pontos Disponíveis</h3>
            <p className="pontos-grandes">{pontosUsuario} pontos</p>
          </div>
        </section>

        <section>
          <h2>Recompensas Disponíveis</h2>
          <div className="grid">
            {recompensas.map(rec => (
              <div key={rec.id} className="card">
                <div style={{fontSize: '4rem', textAlign: 'center'}}>{rec.imagem}</div>
                <h3>{rec.nome}</h3>
                <p>{rec.descricao}</p>
                <p><strong>{rec.pontos} pontos</strong></p>
                <button 
                  onClick={() => trocarPontos(rec)}
                  disabled={pontosUsuario < rec.pontos}
                  className={pontosUsuario < rec.pontos ? 'secondary' : ''}
                >
                  {pontosUsuario >= rec.pontos ? 'Trocar Agora' : `Faltam ${rec.pontos - pontosUsuario} pts`}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Como Funciona</h2>
          <ol>
            <li>Escolha a recompensa desejada</li>
            <li>Clique em "Trocar Agora"</li>
            <li>Seus pontos serão debitados</li>
            <li>Você receberá o voucher por email</li>
          </ol>
        </section>
      </main>
    </div>
  )
}

export default Recompensas
