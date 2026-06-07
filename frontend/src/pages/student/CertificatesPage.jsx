import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Award } from 'lucide-react';

export default function CertificatesPage() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/certificates').then(({ data }) => { setCerts(data.data); setLoading(false); }).catch(() => setLoading(false)); }, []);

  return (
    <div className="page"><div className="container">
      <h1 className="page-title mb-8">Mis Certificados</h1>
      {certs.length > 0 ? (
        <div className="grid grid-3 stagger-children">
          {certs.map(c => (
            <div key={c.id} className="card text-center" style={{ padding: 'var(--space-8)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <Award size={48} style={{ color: 'var(--accent-purple)', margin: '0 auto var(--space-4)' }} />
              <h3 className="text-lg mb-2">{c.curso_nombre}</h3>
              <p className="text-xs text-muted mb-1">{c.nombre} {c.apellido}</p>
              <p className="text-xs text-muted mb-3">Versión {c.numero_version}</p>
              <span className="badge badge-purple mb-3">{c.codigo_unico}</span>
              <p className="text-xs text-muted">Emitido: {new Date(c.fecha_emision).toLocaleDateString('es-EC')}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center p-8"><Award size={48} style={{ color: 'var(--text-muted)', margin: '0 auto var(--space-4)' }} /><h3>Sin certificados</h3><p className="text-muted">Completa un curso para obtener tu certificado</p></div>
      )}
    </div></div>
  );
}
