import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { payStatus } from '../data/themes.js';

export function Payments({ payments, onExport, onNew, onMarkPaid, C, S }) {
  const cobrado   = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const porCobrar = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const enMora    = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Cobranza</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Pagos</h1>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}><Icon.download /> Exportar</button>
          <button style={S.btnPri} onClick={onNew}>
            <Icon.plus /> Registrar pago
          </button>
        </div>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:14, marginBottom:24}}>
        {[
          { l:'Cobrado este mes', v:fmt(cobrado),   c:C.success },
          { l:'Por cobrar',       v:fmt(porCobrar), c:C.warning },
          { l:'En mora',          v:fmt(enMora),    c:C.danger  },
        ].map(k => (
          <div key={k.l} style={S.card}>
            <div style={{fontSize:12, color:C.text2, marginBottom:8, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>{k.l}</div>
            <div style={{fontSize:24, fontWeight:700, color:k.c, fontFamily:'Georgia, serif', letterSpacing:'-.5px'}}>{k.v}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card, padding:0, overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead>
              <tr style={{background:C.bg3}}>
                {['Propiedad','Inquilino','Monto','Fecha','Método','Estado','Acción'].map(h => (
                  <th key={h} style={{fontSize:11, color:C.text2, fontWeight:600, textAlign:'left', padding:'14px 18px', borderBottom:`1px solid ${C.border}`, textTransform:'uppercase', letterSpacing:'.3px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}
                  style={{borderBottom:`1px solid ${C.border}`, transition:'background .12s'}}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{padding:'14px 18px', fontSize:13, fontWeight:500, color:C.text}}>{p.prop}</td>
                  <td style={{padding:'14px 18px', fontSize:13, color:C.text2}}>{p.tenant}</td>
                  <td style={{padding:'14px 18px', fontFamily:'Georgia, serif', fontWeight:700, fontSize:14, color:C.text}}>{fmt(p.amount)}</td>
                  <td style={{padding:'14px 18px', fontSize:12, color:C.text2}}>{p.date}</td>
                  <td style={{padding:'14px 18px', fontSize:12, color:C.text2}}>{p.method}</td>
                  <td style={{padding:'14px 18px'}}>
                    <span style={{fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:100, background:payStatus[p.status].bg, color:payStatus[p.status].c, textTransform:'uppercase', letterSpacing:'.3px'}}>{payStatus[p.status].l}</span>
                  </td>
                  <td style={{padding:'14px 18px'}}>
                    {p.status !== 'paid' && (
                      <button onClick={() => onMarkPaid(p.id)} style={{background:`${C.success}15`, border:`1px solid ${C.success}40`, color:C.success, borderRadius:100, padding:'6px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                        <Icon.check /> Marcar pagado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
