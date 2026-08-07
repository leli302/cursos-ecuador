import { useState } from 'react';
import { Check, X, Award, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

export default function QuizViewer({ quiz, onQuizCompleted }) {
  const toast = useToast();
  const [respuestas, setRespuestas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // quiz = { id, titulo, instrucciones, porcentaje_aprobacion, preguntas: [...] }

  const handleOptionSelect = (preguntaId, opcionId) => {
    if (resultado) return; // No permitir cambios después de enviar
    setRespuestas(prev => ({ ...prev, [preguntaId]: opcionId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(respuestas).length < quiz.preguntas.length) {
      toast.error('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    setEnviando(true);
    try {
      const respuestasArray = Object.entries(respuestas).map(([pregunta_id, opcion_id]) => ({
        pregunta_id: parseInt(pregunta_id),
        opcion_id
      }));

      const { data } = await api.post(`/quizzes/${quiz.id}/submit`, { respuestas: respuestasArray });
      setResultado(data);
      if (data.aprobado) {
        toast.success(data.mensaje);
        onQuizCompleted(quiz.id, data.calificacion);
      } else {
        toast.error(data.mensaje);
      }
    } catch (error) {
      toast.error('Error al calificar la evaluación');
      console.error(error);
    } finally {
      setEnviando(false);
    }
  };

  const handleRetry = () => {
    setResultado(null);
    setRespuestas({});
  };

  if (!quiz || !quiz.preguntas || quiz.preguntas.length === 0) {
    return (
      <div className="card text-center p-8">
        <h3 className="mb-2">Evaluación no disponible</h3>
        <p className="text-muted">Esta evaluación aún no tiene preguntas configuradas.</p>
      </div>
    );
  }

  return (
    <div className="quiz-viewer">
      <div className="card mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-teal)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--accent-teal)', marginBottom: '8px' }}>
          {quiz.titulo}
        </h2>
        <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>
          {quiz.instrucciones || 'Selecciona la opción correcta para cada pregunta.'}
        </p>
        <div className="mt-4 flex gap-4">
          <span className="badge badge-teal">Aprobación: {quiz.porcentaje_aprobacion}%</span>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>{quiz.preguntas.length} Preguntas</span>
        </div>
      </div>

      {resultado && (
        <div className="card mb-6 text-center animate-fade-in" style={{
          background: resultado.aprobado ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          border: resultado.aprobado ? '1px solid #10B981' : '1px solid #EF4444'
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: resultado.aprobado ? '#10B981' : '#EF4444', color: 'white'
          }}>
            {resultado.aprobado ? <Award size={32} /> : <X size={32} />}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: resultado.aprobado ? '#10B981' : '#EF4444' }}>
            {resultado.aprobado ? '¡Evaluación Aprobada!' : 'Evaluación Reprobada'}
          </h3>
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>Tu calificación: <strong>{resultado.calificacion}%</strong></p>
          <p className="text-sm text-secondary mb-6">{resultado.mensaje}</p>
          
          {!resultado.aprobado && (
            <button className="btn btn-outline" onClick={handleRetry}>
              Intentar de nuevo
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {quiz.preguntas.map((pregunta, idx) => (
          <div key={pregunta.id} className="card">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>
              <span style={{ color: 'var(--accent-teal)', marginRight: '8px' }}>{idx + 1}.</span> 
              {pregunta.texto_pregunta}
            </h4>
            
            <div className="flex flex-col gap-3">
              {pregunta.opciones.map((opcion) => {
                const isSelected = respuestas[pregunta.id] === opcion.id;
                
                // Lógica de colores si ya hay resultado
                let optionStyle = {
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  border: isSelected ? '1px solid var(--accent-teal)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(78,205,196,0.1)' : 'var(--bg-body)',
                  cursor: resultado ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', gap: '12px'
                };

                if (resultado) {
                  if (opcion.es_correcta) {
                    optionStyle.border = '1px solid #10B981';
                    optionStyle.background = 'rgba(16,185,129,0.1)';
                  } else if (isSelected && !opcion.es_correcta) {
                    optionStyle.border = '1px solid #EF4444';
                    optionStyle.background = 'rgba(239,68,68,0.1)';
                  }
                }

                return (
                  <div 
                    key={opcion.id} 
                    style={optionStyle}
                    onClick={() => handleOptionSelect(pregunta.id, opcion.id)}
                    className={!resultado ? "hover-card" : ""}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', border: isSelected ? '5px solid var(--accent-teal)' : '1px solid var(--text-muted)',
                      background: 'transparent', flexShrink: 0
                    }} />
                    <span style={{ flex: 1 }}>{opcion.texto_opcion}</span>
                    
                    {resultado && opcion.es_correcta && <Check size={18} color="#10B981" />}
                    {resultado && isSelected && !opcion.es_correcta && <X size={18} color="#EF4444" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!resultado && (
        <div className="mt-8 flex justify-end">
          <button 
            className="btn btn-primary btn-lg flex items-center gap-2" 
            onClick={handleSubmit} 
            disabled={enviando || Object.keys(respuestas).length < quiz.preguntas.length}
          >
            {enviando ? 'Enviando...' : 'Enviar Respuestas'} <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
