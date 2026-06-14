import { fmt } from '../utils/format.js';
import { statusInfo } from '../data/themes.js';

export function Reports({ props, monthlyTotal, pendingAmount, activeProps, overdueProps, C, S }) {
  const totalDeposits = props.reduce((s, p) => s + p.deposit, 0);
  const maxRent       = Math.max(...props.map(p => p.rent), 1);
  return (
    <div className="fade-in">
      <div style={{marginBottom:24}}>
        <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Análisis</div>
        <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Reportes</h1>
        <div style={{fontSize:14, color:C.text2, marginTop:6}}>Análisis financiero del portafolio</div>
      </div>
      <div className="rt-cols-half" style={{display:'grid', gap:16}}>
        <div style={S.card}>
          <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Ingresos por propiedad</h2>
          {props.filter(p => p.status !== 'vacant').sort((a, b) => b.rent - a.rent).map(p => (
            <div key={p.id} style={{marginBottom:16}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:6, gap:10}}>
                <span style={{fontSize:13, color:C.text, maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500}}>{p.name}</span>
                <span style={{fontSize:13, fontFamily:'Georgia, serif', fontWeight:700, color:C.accent}}>{fmt(p.rent)}</span>
              </div>
              <div style={{height:5, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${(p.rent / maxRent) * 100}%`, height:'100%', background:statusInfo[p.status].dot, borderRadius:3, transition:'width .5s'}} />
              </div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Resumen financiero</h2>
          {[
            { l:'Ingreso mensual bruto',    v:fmt(monthlyTotal),       c:C.success },
            { l:'Total depósitos',          v:fmt(totalDeposits),      c:C.accent  },
            { l:'Pagos pendientes',         v:fmt(pendingAmount),      c:C.warning },
            { l:'Ingreso anual proyectado', v:fmt(monthlyTotal * 12),  c:C.text    },
          ].map(r => (
            <div key={r.l} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13, color:C.text2}}>{r.l}</span>
              <span style={{fontFamily:'Georgia, serif', fontWeight:700, color:r.c, fontSize:15, letterSpacing:'-.3px'}}>{r.v}</span>
            </div>
          ))}
          <div style={{marginTop:20, padding:18, background:`${C.success}10`, borderRadius:14, textAlign:'center', border:`1px solid ${C.success}25`}}>
            <div style={{fontSize:11, color:C.success, marginBottom:6, fontWeight:700, letterSpacing:'.4px', textTransform:'uppercase'}}>Tasa de ocupación</div>
            <div style={{fontSize:42, fontWeight:700, color:C.success, fontFamily:'Georgia, serif', letterSpacing:'-1.5px', lineHeight:1}}>
              {Math.round(((activeProps + overdueProps) / props.length) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
