import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function CatalogarItem() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'Metais',
    subcategoria: 'Ferro',
    localizacao: '',
    cep: '',
    referencia: '',
    condicao: 'Bom',
    comoRetirar: '',
    diasDisponiveis: [],
    horarioInicio: '',
    horarioFim: '',
    observacoesRetirada: '',
    fotos: [],
    fotosPreview: []
  })
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const categorias = {
    'Metais': ['Ferro', 'Alumínio', 'Cobre', 'Inox', 'Outros'],
    'Plásticos': ['PET', 'PVC', 'PP', 'PS', 'PEAD', 'Outros'],
    'Papel/Papelão': ['Caixas', 'Branco', 'Jornais e Revistas', 'Revestido'],
    'Eletrônicos': ['Geladeira', 'Máquina Lavar', 'Microondas', 'TV', 'Eletroportátil', 'Celulares', 'Computadores', 'Impressoras'],
    'Vidros': ['Vidros'],
    'Resíduos de Construção': ['Tijolos', 'Telhas', 'Cimento e Argamassa', 'Areia e Pedra', 'Azulejo e Cerâmica'],
    'Madeiras': ['Bruta', 'Processada'],
    'Resíduos Especiais': ['Pneus', 'Óleo', 'Óleo de Cozinha', 'Pilhas', 'Baterias', 'Lâmpadas Fluorescentes', 'Roupas', 'Tecidos e Retalhos']
  }

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      diasDisponiveis: prev.diasDisponiveis.includes(dia)
        ? prev.diasDisponiveis.filter(d => d !== dia)
        : [...prev.diasDisponiveis, dia]
    }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const fotosRestantes = 6 - formData.fotos.length
    
    if (files.length > fotosRestantes) {
      alert(`Você pode adicionar no máximo ${fotosRestantes} foto(s) a mais. Limite: 6 fotos`)
      return
    }

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          fotos: [...prev.fotos, reader.result],
          fotosPreview: [...prev.fotosPreview, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const startCamera = async () => {
    if (formData.fotos.length >= 6) {
      alert('Limite de 6 fotos atingido!')
      return
    }
    
    try {
      // Tenta câmera traseira primeiro, se falhar usa qualquer câmera
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err)
      
      // Fallback: tenta sem especificar câmera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          setShowCamera(true)
        }
      } catch (fallbackErr) {
        alert('Não foi possível acessar a câmera. Use "Escolher Arquivo" ou "Câmera do Celular" para fazer upload de uma foto.')
      }
    }
  }

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (video && canvas) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      const photoData = canvas.toDataURL('image/jpeg')
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, photoData],
        fotosPreview: [...prev.fotosPreview, photoData]
      }))
      
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
      fotosPreview: prev.fotosPreview.filter((_, i) => i !== index)
    }))
  }

  const buscarCEP = async () => {
    const cep = formData.cep.replace(/\D/g, '')
    if (cep.length !== 8) {
      alert('CEP inválido!')
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (data.erro) {
        alert('CEP não encontrado!')
        return
      }

      setFormData(prev => ({
        ...prev,
        localizacao: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
      }))
    } catch (error) {
      alert('Erro ao buscar CEP')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.fotos.length === 0) {
      alert('Por favor, adicione pelo menos uma foto do item!')
      return
    }

    // Criar texto de instruções completo
    let instrucoes = ''
    
    if (formData.comoRetirar) {
      instrucoes += `📦 COMO RETIRAR:\n${formData.comoRetirar}\n\n`
    }
    
    if (formData.diasDisponiveis.length > 0) {
      instrucoes += `📅 DIAS DISPONÍVEIS:\n${formData.diasDisponiveis.join(', ')}\n\n`
    }
    
    if (formData.horarioInicio && formData.horarioFim) {
      instrucoes += `⏰ HORÁRIO:\nDas ${formData.horarioInicio} às ${formData.horarioFim}\n\n`
    }
    
    if (formData.observacoesRetirada) {
      instrucoes += `ℹ️ OBSERVAÇÕES:\n${formData.observacoesRetirada}`
    }

    const itensExistentes = JSON.parse(localStorage.getItem('meus_itens') || '[]')
    
    const novoItem = {
      id: Date.now(),
      titulo: formData.titulo,
      descricao: formData.descricao,
      categoria: formData.categoria,
      subcategoria: formData.subcategoria,
      localizacao: formData.localizacao,
      cep: formData.cep,
      referencia: formData.referencia,
      condicao: formData.condicao,
      instrucoes: instrucoes.trim(),
      fotos: formData.fotos,
      data: new Date().toISOString(),
      status: 'Disponível',
      pontos: 0
    }
    
    localStorage.setItem('meus_itens', JSON.stringify([novoItem, ...itensExistentes]))
    
    alert('Item catalogado com sucesso!')
    navigate('/meus-itens')
  }

  return (
    <div>
      <header>
        <h1>📸 Catalogar Item</h1>
        <p>Adicione um item para doação</p>
      </header>

      <main>
        <section>
          <form onSubmit={handleSubmit}>
            {/* ÁREA DE FOTOS */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '0.5rem'}}>📷 Fotos do Item ({formData.fotos.length}/6)</h3>
              <p style={{fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem'}}>
                Adicione até 6 fotos do item
              </p>
              
              {formData.fotosPreview.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {formData.fotosPreview.map((foto, index) => (
                    <div key={index} style={{position: 'relative'}}>
                      <img 
                        src={foto} 
                        alt={`Foto ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #e5e7eb'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          lineHeight: '1'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!showCamera && formData.fotos.length < 6 && (
                <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <label style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '2rem 1rem',
                    border: '2px dashed #10b981',
                    borderRadius: '8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f0fdf4'
                  }}>
                    <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📁</div>
                    <div style={{fontWeight: 'bold', color: '#10b981', fontSize: '0.9rem'}}>
                      Escolher Arquivo(s)
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{display: 'none'}}
                    />
                  </label>

                  {/* Botão especial para mobile - Câmera Nativa */}
                  <label style={{
                    flex: '1',
                    minWidth: '200px',
                    padding: '2rem 1rem',
                    border: '2px dashed #8b5cf6',
                    borderRadius: '8px',
                    background: '#faf5ff',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}>
                    <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📱</div>
                    <div style={{fontWeight: 'bold', color: '#8b5cf6', fontSize: '0.9rem'}}>
                      Câmera do Celular
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      style={{display: 'none'}}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={startCamera}
                    style={{
                      flex: '1',
                      minWidth: '200px',
                      padding: '2rem 1rem',
                      border: '2px dashed #3b82f6',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold',
                      color: '#3b82f6'
                    }}
                  >
                    <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📸</div>
                    Tirar Foto Agora
                  </button>
                </div>
              )}

              {showCamera && (
                <div style={{textAlign: 'center'}}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    style={{
                      width: '100%',
                      maxWidth: '500px',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  <canvas ref={canvasRef} style={{display: 'none'}} />
                  <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                    <button 
                      type="button"
                      onClick={capturePhoto}
                      style={{
                        padding: '0.75rem 2rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      📸 Capturar
                    </button>
                    <button 
                      type="button"
                      onClick={stopCamera}
                      className="secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* INFORMAÇÕES BÁSICAS */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>ℹ️ Informações Básicas</h3>

              <label htmlFor="titulo">Título do Item *</label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({...prev, titulo: e.target.value}))}
                placeholder="Ex: Telhas de cerâmica"
                required
              />

              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="categoria">Categoria *</label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => {
                      const novaCat = e.target.value
                      setFormData(prev => ({
                        ...prev, 
                        categoria: novaCat,
                        subcategoria: categorias[novaCat][0]
                      }))
                    }}
                    required
                  >
                    {Object.keys(categorias).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="subcategoria">Tipo *</label>
                  <select
                    id="subcategoria"
                    value={formData.subcategoria}
                    onChange={(e) => setFormData(prev => ({...prev, subcategoria: e.target.value}))}
                    required
                  >
                    {categorias[formData.categoria].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label htmlFor="condicao">Condição do Item *</label>
              <select
                id="condicao"
                value={formData.condicao}
                onChange={(e) => setFormData(prev => ({...prev, condicao: e.target.value}))}
                required
              >
                <option value="Novo">Novo / Sem Uso</option>
                <option value="Bom">Bom Estado</option>
                <option value="Regular">Estado Regular</option>
                <option value="Precisa Reparo">Precisa Reparo</option>
              </select>

              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({...prev, descricao: e.target.value}))}
                placeholder="Descreva o item, suas características, dimensões, etc..."
                rows="4"
                required
              />
            </div>

            {/* LOCALIZAÇÃO */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>📍 Localização</h3>

              <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: '1rem'}}>
                <div>
                  <label htmlFor="cep">CEP</label>
                  <input
                    id="cep"
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({...prev, cep: e.target.value}))}
                    placeholder="00000-000"
                    maxLength="9"
                  />
                </div>
                <div style={{display: 'flex', alignItems: 'flex-end'}}>
                  <button type="button" onClick={buscarCEP} style={{width: '100%'}}>
                    🔍 Buscar
                  </button>
                </div>
              </div>

              <label htmlFor="localizacao">Endereço / Localização *</label>
              <input
                id="localizacao"
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({...prev, localizacao: e.target.value}))}
                placeholder="Rua, Bairro, Cidade"
                required
              />

              <label htmlFor="referencia">Ponto de Referência</label>
              <input
                id="referencia"
                type="text"
                value={formData.referencia}
                onChange={(e) => setFormData(prev => ({...prev, referencia: e.target.value}))}
                placeholder="Ex: Próximo ao mercado X, portão verde"
              />
            </div>

            {/* INSTRUÇÕES PARA COLETA */}
            <div className="card" style={{padding: '2rem', marginBottom: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>📋 Instruções para Coleta</h3>

              <label htmlFor="comoRetirar">Como Retirar o Item?</label>
              <textarea
                id="comoRetirar"
                value={formData.comoRetirar}
                onChange={(e) => setFormData(prev => ({...prev, comoRetirar: e.target.value}))}
                placeholder="Ex: Item está na calçada, precisa de veículo grande, ajuda para carregar, etc."
                rows="3"
              />

              <label style={{marginTop: '1rem', display: 'block'}}>
                Dias Disponíveis para Retirada:
              </label>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginTop: '0.5rem'
              }}>
                {diasSemana.map(dia => (
                  <button
                    key={dia}
                    type="button"
                    onClick={() => toggleDia(dia)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: formData.diasDisponiveis.includes(dia) ? '#10b981' : '#f3f4f6',
                      color: formData.diasDisponiveis.includes(dia) ? 'white' : '#374151',
                      border: formData.diasDisponiveis.includes(dia) ? '2px solid #059669' : '2px solid #d1d5db',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: formData.diasDisponiveis.includes(dia) ? 'bold' : 'normal',
                      transition: 'all 0.2s'
                    }}
                  >
                    {dia}
                  </button>
                ))}
              </div>

              <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem'}}>
                <div>
                  <label htmlFor="horarioInicio">Horário de Início</label>
                  <input
                    id="horarioInicio"
                    type="time"
                    value={formData.horarioInicio}
                    onChange={(e) => setFormData(prev => ({...prev, horarioInicio: e.target.value}))}
                  />
                </div>
                <div>
                  <label htmlFor="horarioFim">Horário de Término</label>
                  <input
                    id="horarioFim"
                    type="time"
                    value={formData.horarioFim}
                    onChange={(e) => setFormData(prev => ({...prev, horarioFim: e.target.value}))}
                  />
                </div>
              </div>

              <label htmlFor="observacoesRetirada">Observações Adicionais</label>
              <textarea
                id="observacoesRetirada"
                value={formData.observacoesRetirada}
                onChange={(e) => setFormData(prev => ({...prev, observacoesRetirada: e.target.value}))}
                placeholder="Ex: Tocar campainha do apartamento 12, aguardar na portaria, ligar antes..."
                rows="3"
              />
            </div>

            <button type="submit" style={{width: '100%', padding: '1rem', fontSize: '1rem'}}>
              ✅ Catalogar Item
            </button>
          </form>
        </section>

        {/* GUIA DE CATEGORIAS */}
        <section style={{marginTop: '2rem'}}>
          <details className="card" style={{padding: '1.5rem'}}>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem'}}>
              📋 Guia de Categorias (clique para expandir)
            </summary>
            <div style={{marginTop: '1rem', fontSize: '0.9rem', lineHeight: '1.8'}}>
              <strong>Metais:</strong> Ferro, Alumínio, Cobre, Inox, Outros<br/>
              <strong>Plásticos:</strong> PET, PVC, PP, PS, PEAD, Outros<br/>
              <strong>Papel/Papelão:</strong> Caixas, Branco, Jornais e Revistas, Revestido<br/>
              <strong>Eletrônicos:</strong> Geladeira, Máquina Lavar, Microondas, TV, Eletroportátil, Celulares, Computadores, Impressoras<br/>
              <strong>Vidros:</strong> Vidros em geral<br/>
              <strong>Resíduos de Construção:</strong> Tijolos, Telhas, Cimento e Argamassa, Areia e Pedra, Azulejo e Cerâmica<br/>
              <strong>Madeiras:</strong> Bruta, Processada<br/>
              <strong>Resíduos Especiais:</strong> Pneus, Óleo, Óleo de Cozinha, Pilhas, Baterias, Lâmpadas Fluorescentes, Roupas, Tecidos e Retalhos
            </div>
          </details>
        </section>
      </main>
    </div>
  )
}

export default CatalogarItem