import { useState } from 'react'

function ResponderReclamacoes() {
  const [respostas, setRespostas] = useState({})
  
  const reclamacoes = [
    {
      id: 1247,
      status: 'pendente',
      item: 'Mesa de Jantar de Madeira',
      reclamante: 'Carlos Mendes',
      data: '15/12/2024 às 14:30',
      prazoHoras: 18,
      categoria: 'Item não encontrado',
      motivo: 'Fui até o endereço informado hoje pela manhã (15/12 às 10h) mas não encontrei a mesa em nenhum lugar. Toquei a campainha e ninguém atendeu. O portão estava fechado e não havia nada visível na calçada.',
      localOriginal: 'Rua das Flores, 123 - Centro',
      disponibilidade: 'Item está na garagem, campainha funciona'
    },
    {
      id: 1198,
      status: 'em-analise',
      item: 'Sofá 3 Lugares',
      reclamante: 'Ana Paula',
      data: '12/12/2024',
      dataResposta: '12/12/2024 às 18:00',
      categoria: 'Descrição incorreta',
      motivo: 'O sofá tem muito mais desgaste do que foi mostrado nas fotos. Há manchas e rasgos que não eram visíveis.',
      minhaResposta: 'Olá Ana, realmente as fotos foram tiradas de um ângulo que não mostrava os defeitos. Peço desculpas pela falta de clareza.'
    },
    {
      id: 1089,
      status: 'resolvida',
      item: 'Cadeira de Escritório',
      reclamante: 'João Santos',
      data: '08/12/2024',
      dataResolucao: '09/12/2024',
      categoria: 'Horário incompatível',
      motivo: 'Tentei buscar no horário informado mas não tinha ninguém.',
      resolucao: 'Vocês entraram em acordo e o item foi coletado com sucesso.',
      feedback: 'Problema resolvido! Combinamos outro horário e deu tudo certo. Obrigado pela compreensão.'
    }
  ]

  const handleRespostaChange = (id, texto) => {
    setRespostas({
      ...respostas,
      [id]: texto
    })
  }

  const enviarResposta = (id) => {
    console.log(`Enviando resposta para reclamação ${id}:`, respostas[id])
    alert('Resposta enviada com sucesso!')
  }

  const filtrarPorStatus = (status) => {
    return reclamacoes.filter(r => r.status === status)
  }

  return (
    <div>
      <header>
        <h1>💬 Minhas Reclamações</h1>
        <p>Mantenha sua reputação respondendo rapidamente</p>
      </header>

      <main>
        <section>
          <h2>Status das Reclamações</h2>
          
          <div className="grid">
            <div className="card" style={{borderLeftColor: '#f59e0b'}}>
              <h3>{filtrarPorStatus('pendente').length}</h3>
              <p><strong>Pendente</strong></p>
              <small>Aguardando sua resposta</small>
            </div>

            <div className="card" style={{borderLeftColor: '#3b82f6'}}>
              <h3>{filtrarPorStatus('em-analise').length}</h3>
              <p><strong>Em Análise</strong></p>
              <small>Já respondidas</small>
            </div>

            <div className="card" style={{borderLeftColor: '#10b981'}}>
              <h3>{filtrarPorStatus('resolvida').length}</h3>
              <p><strong>Resolvidas</strong></p>
              <small>Fechadas com sucesso</small>
            </div>
          </div>

          <div className="card mt-2" style={{background: '#d1fae5', borderLeftColor: '#10b981'}}>
            <p>⭐ Sua Taxa de Resolução: <strong>91%</strong></p>
            <p><small>Acima da média! Continue assim para manter sua boa reputação.</small></p>
          </div>
        </section>

        {/* Reclamações Pendentes */}
        <section>
          <h2>Reclamações Pendentes</h2>

          {filtrarPorStatus('pendente').map(rec => (
            <div key={rec.id} className="card" style={{borderLeftColor: '#f59e0b'}}>
              <div className="flex" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>⚠️ Reclamação #{rec.id}</h3>
                <span className="status-badge pendente">Pendente</span>
              </div>

              <div className="mt-2">
                <p><strong>Item:</strong> {rec.item}</p>
                <p><strong>Reclamante:</strong> {rec.reclamante}</p>
                <p><strong>Data:</strong> {rec.data}</p>
                <p><strong>Prazo:</strong> ⏰ <span style={{color: '#ef4444', fontWeight: 'bold'}}>
                  Expira em {rec.prazoHoras} horas
                </span></p>
              </div>

              <div className="mt-2">
                <h4>Motivo da Reclamação:</h4>
                <p><strong>Categoria:</strong> {rec.categoria}</p>
                <blockquote style={{
                  borderLeft: '3px solid #d1d5db',
                  paddingLeft: '1rem',
                  margin: '1rem 0',
                  fontStyle: 'italic',
                  color: '#4b5563'
                }}>
                  "{rec.motivo}"
                </blockquote>
              </div>

              <div className="mt-2">
                <h4>Sua Resposta:</h4>
                <textarea
                  rows="5"
                  placeholder="Explique a situação e forneça informações adicionais..."
                  value={respostas[rec.id] || ''}
                  onChange={(e) => handleRespostaChange(rec.id, e.target.value)}
                />
                
                <div className="mt-2">
                  <label>
                    <input type="checkbox" /> Item foi removido/coletado por outra pessoa
                  </label><br/>
                  <label>
                    <input type="checkbox" /> Informações precisam ser atualizadas
                  </label><br/>
                  <label>
                    <input type="checkbox" /> Houve um mal-entendido
                  </label>
                </div>

                <div className="flex mt-2">
                  <button onClick={() => enviarResposta(rec.id)}>
                    Enviar Resposta
                  </button>
                  <button className="secondary">
                    Atualizar Item
                  </button>
                  <button className="danger">
                    Remover Item
                  </button>
                </div>
              </div>

              <details style={{marginTop: '1rem'}}>
                <summary style={{cursor: 'pointer', color: '#10b981'}}>
                  💡 Ver exemplo de boa resposta
                </summary>
                <p style={{
                  marginTop: '0.5rem',
                  padding: '1rem',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  "Olá Carlos, peço desculpas pelo transtorno! A mesa foi movida para dentro 
                  da garagem devido ao mau tempo ontem. Estou anexando uma foto atualizada. 
                  Estarei em casa amanhã das 14h às 18h para facilitar a coleta."
                </p>
              </details>
            </div>
          ))}
        </section>

        {/* Dicas */}
        <section>
          <h2>💡 Dicas para Manter Sua Boa Reputação</h2>
          <ul>
            <li>✅ Responda reclamações em até 24 horas</li>
            <li>✅ Seja educado e compreensivo</li>
            <li>✅ Reconheça erros quando houver</li>
            <li>✅ Forneça informações claras e atualizadas</li>
            <li>✅ Ofereça soluções práticas</li>
            <li>✅ Mantenha seus itens atualizados</li>
          </ul>
        </section>

        {/* Estatísticas */}
        <section>
          <h2>📊 Sua Reputação</h2>
          
          <div className="grid">
            <div className="card">
              <h4>Taxa de Resolução</h4>
              <p className="numero-grande">91%</p>
              <p><small>11 resolvidas de 12 reclamações</small></p>
            </div>

            <div className="card">
              <h4>Tempo Médio de Resposta</h4>
              <p className="numero-grande">4h</p>
              <p><small>Bem abaixo da média de 12h</small></p>
            </div>

            <div className="card">
              <h4>Avaliação Geral</h4>
              <p className="numero-grande">⭐⭐⭐⭐⭐</p>
              <p><small>4.8 de 5.0</small></p>
            </div>

            <div className="card">
              <h4>Badge Atual</h4>
              <p className="numero-grande">🏅</p>
              <p><small>"Catalogador Confiável"</small></p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ResponderReclamacoes
