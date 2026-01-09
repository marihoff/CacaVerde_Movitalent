import { useState } from 'react'

function PontosGanhos() {
  const [filtro, setFiltro] = useState('semana')
  
  // Dados mockados
  const pontos = {
    total: 385,
    mes: 95,
    semana: 35
  }

  const historico = [
    {
      id: 1,
      data: '16/12/2024 14:30',
      descricao: 'Item Coletado: Sofá 3 lugares',
      detalhes: 'Coletado por João Silva',
      pontos: 10,
      tipo: 'ganho'
    },
    {
      id: 2,
      data: '16/12/2024 14:30',
      descricao: 'Bônus Rápido: Item coletado em menos de 24h',
      detalhes: 'Sofá 3 lugares',
      pontos: 5,
      tipo: 'bonus'
    },
    {
      id: 3,
      data: '15/12/2024 09:15',
      descricao: 'Item Coletado: Cadeira de Escritório',
      detalhes: 'Coletado por Maria Santos',
      pontos: 10,
      tipo: 'ganho'
    },
    {
      id: 4,
      data: '13/12/2024 11:20',
      descricao: 'Troca de Recompensa: Voucher Desconto 10%',
      detalhes: 'Loja Sustentável ABC',
      pontos: -50,
      tipo: 'gasto'
    }
  ]

  const estatisticas = {
    itensCatalogados: 42,
    itensColetados: 35,
    taxaSucesso: 83,
    impactoKg: 127,
    pessoasAjudadas: 28
  }

  return (
    <div>
      <header>
        <h1>🏆 Meus Pontos</h1>
        <p>Acompanhe seu impacto e suas conquistas</p>
      </header>

      <main>
        {/* Resumo Geral */}
        <section>
          <h2>Resumo</h2>
          
          <div className="destaque-pontos">
            <h3>Total de Pontos</h3>
            <p className="pontos-grandes">{pontos.total} pontos</p>
            <p>🔥 Você está no Top 5% da sua região!</p>
          </div>

          <div className="grid">
            <div className="card">
              <h4>Pontos Este Mês</h4>
              <p className="numero-grande">{pontos.mes}</p>
              <p><small>↑ 23% em relação ao mês passado</small></p>
            </div>

            <div className="card">
              <h4>Pontos Esta Semana</h4>
              <p className="numero-grande">{pontos.semana}</p>
              <p><small>3 itens coletados</small></p>
            </div>

            <div className="card">
              <h4>Próxima Recompensa</h4>
              <p className="numero-grande">15</p>
              <p><small>pontos faltam para Voucher R$ 25</small></p>
            </div>
          </div>
        </section>

        {/* Histórico */}
        <section>
          <h2>Histórico de Pontos</h2>
          
          <div className="mb-2">
            <label>
              Período:
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="semana">Última Semana</option>
                <option value="mes">Último Mês</option>
                <option value="ano">Último Ano</option>
              </select>
            </label>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {historico.map(item => (
                <tr key={item.id}>
                  <td>{item.data}</td>
                  <td>
                    <strong>{item.descricao}</strong><br />
                    <small>{item.detalhes}</small>
                  </td>
                  <td className={item.pontos > 0 ? 'pontos-positivo' : 'pontos-negativo'}>
                    {item.pontos > 0 ? '+' : ''}{item.pontos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Estatísticas */}
        <section>
          <h2>Suas Estatísticas</h2>
          
          <div className="grid">
            <div className="card">
              <h4>Total de Itens Catalogados</h4>
              <p className="numero-grande">{estatisticas.itensCatalogados}</p>
            </div>

            <div className="card">
              <h4>Itens Coletados</h4>
              <p className="numero-grande">{estatisticas.itensColetados}</p>
              <p><small>Taxa de sucesso: {estatisticas.taxaSucesso}%</small></p>
            </div>

            <div className="card">
              <h4>Impacto Ambiental</h4>
              <p className="numero-grande">{estatisticas.impactoKg} kg</p>
              <p><small>de resíduos evitados</small></p>
            </div>

            <div className="card">
              <h4>Pessoas Ajudadas</h4>
              <p className="numero-grande">{estatisticas.pessoasAjudadas}</p>
              <p><small>usuários coletaram seus itens</small></p>
            </div>
          </div>
        </section>

        {/* Conquistas */}
        <section>
          <h2>🎖️ Suas Conquistas</h2>
          
          <div className="grid">
            <div className="card">
              <span style={{fontSize: '3rem'}}>🌱</span>
              <h4>Primeiro Passo</h4>
              <p>Catalogou seu primeiro item</p>
              <small>✅ Desbloqueado em 10/12/2024</small>
            </div>

            <div className="card">
              <span style={{fontSize: '3rem'}}>🥉</span>
              <h4>Catalogador Bronze</h4>
              <p>10 itens catalogados</p>
              <small>✅ Desbloqueado em 14/12/2024</small>
            </div>

            <div className="card">
              <span style={{fontSize: '3rem'}}>⚡</span>
              <h4>Raio</h4>
              <p>Item coletado em menos de 6h</p>
              <small>✅ Desbloqueado em 16/12/2024</small>
            </div>

            <div className="card" style={{opacity: 0.5}}>
              <span style={{fontSize: '3rem'}}>🥈</span>
              <h4>Catalogador Prata</h4>
              <p>25 itens catalogados</p>
              <small>🔒 Faltam 8 itens</small>
            </div>
          </div>
        </section>

        {/* Ações */}
        <section className="text-center">
          <button>🎁 Ver Recompensas Disponíveis</button>
          <button className="secondary" style={{marginLeft: '1rem'}}>📊 Baixar Relatório</button>
        </section>
      </main>
    </div>
  )
}

export default PontosGanhos
