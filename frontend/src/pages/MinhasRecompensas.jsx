import { useState } from 'react'

function MinhasRecompensas() {
  const trocas = [
    {
      id: 1,
      recompensa: 'Voucher R$ 10',
      pontos: 50,
      data: '13/12/2024',
      status: 'entregue',
      codigo: 'VCH-2024-1234'
    },
    {
      id: 2,
      recompensa: 'Frete Grátis',
      pontos: 75,
      data: '10/12/2024',
      status: 'usado',
      codigo: 'FRT-2024-5678'
    },
    {
      id: 3,
      recompensa: 'Voucher R$ 25',
      pontos: 100,
      data: '16/12/2024',
      status: 'pendente',
      codigo: '-'
    }
  ]

  return (
    <div>
      <header>
        <h1>🎁 Minhas Recompensas</h1>
        <p>Histórico de trocas realizadas</p>
      </header>

      <main>
        <section>
          <h2>Recompensas Trocadas</h2>
          
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Recompensa</th>
                <th>Pontos</th>
                <th>Código</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trocas.map(troca => (
                <tr key={troca.id}>
                  <td>{troca.data}</td>
                  <td><strong>{troca.recompensa}</strong></td>
                  <td className="pontos-negativo">-{troca.pontos}</td>
                  <td><code>{troca.codigo}</code></td>
                  <td>
                    <span className={`status-badge ${
                      troca.status === 'entregue' ? 'resolvida' : 
                      troca.status === 'usado' ? 'em-analise' : 
                      'pendente'
                    }`}>
                      {troca.status === 'entregue' ? '✅ Entregue' :
                       troca.status === 'usado' ? '✔️ Usado' :
                       '⏳ Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Resumo</h2>
          <div className="grid">
            <div className="card">
              <h4>Total de Trocas</h4>
              <p className="numero-grande">{trocas.length}</p>
            </div>
            <div className="card">
              <h4>Pontos Gastos</h4>
              <p className="numero-grande">{trocas.reduce((sum, t) => sum + t.pontos, 0)}</p>
            </div>
            <div className="card">
              <h4>Pendentes</h4>
              <p className="numero-grande">{trocas.filter(t => t.status === 'pendente').length}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MinhasRecompensas
