import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { payStatus, maintPriority, maintStatus } from '../data/themes.js';
import { MONTHLY_INCOME } from '../data/seed.js';

export function Dashboard({ props, payments, maint, activeProps, overdueProps, vacantProps, monthlyTotal, pendingAmount, C, S }) {
  const max = Math.max(...MONTHLY_INCOME.map(x => x.total));
  return (
    <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:24}}>
      {/* HEADER */}
      <div>
        <div style={{fontSize:13, color:C.text3, fontWeight:500, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>RentTrack · Mayo 2026</div>
        <h1 style={{fontSize:40, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.5px', lineHeight:1.05, fontFamily:'Georgia, "Times New Roman", serif'}}>
          Tu portafolio de hoy
        </h1>
        <div style={{fontSize:16, color:C.text2, marginTop:8}}>
          {props.length} propiedades · {fmt(monthlyTotal)} en ingresos mensuales
        </div>
      </div>

      {/* KPIs grandes con border-radius enorme */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:16}}>
        {[
          { l:'Propiedades',   v:props.length,        sub:`${activeProps} arrendadas`,                                   c:C.text     },
          { l:'Ingreso/mes',   v:fmt(monthlyTotal),   sub:`${activeProps + overdueProps} contratos activos`,             c:C.accent   },
          { l:'Pendiente',     v:fmt(pendingAmount),  sub:`${payments.filter(p => p.status !== 'paid').length} propiedades`, c:C.warning  },
          { l:'Disponibles',   v:vacantProps,         sub:'Para arrendar',                                                c:C.accent2  },
        ].map(k => (
          <div key={k.l} style={S.card}>
            <div style={{fontSize:12, color:C.text2, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase', marginBottom:10}}>{k.l}</div>
            <div style={{fontSize:32, fontWeight:700, color:k.c, fontFamily:'Georgia, serif', letterSpacing:'-1px', lineHeight:1, marginBottom:6}}>{k.v}</div>
            <div style={{fontSize:13, color:C.text3}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* GRAPH + DONUT layout */}
      <div className="rt-cols-main" style={{display:'grid', gap:16}}>
        <div style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:10}}>
            <div>
              <h2 style={{fontSize:18, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>Ingresos mensuales</h2>
              <div style={{fontSize:13, color:C.text2, marginTop:3}}>Últimos 8 meses · proyección de cierre {fmt(178800000)}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:28, fontWeight:700, color:C.accent, fontFamily:'Georgia, serif'}}>{fmt(14900000)}</div>
              <div style={{fontSize:11, color:C.text3, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>Mayo 2026</div>
            </div>
          </div>
          <div style={{display:'flex', gap:8, alignItems:'flex-end', height:160, paddingBottom:24, position:'relative'}}>
            {MONTHLY_INCOME.map((m, i) => {
              const pct = (m.total / max) * 100;
              const isLast = i === MONTHLY_INCOME.length - 1;
              return (
                <div key={m.mes} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8, position:'relative'}}>
                  <div style={{
                    width:'100%', height:`${pct}%`,
                    background: isLast ? `linear-gradient(180deg, ${C.accent}, ${C.accent2})` : C.bg3,
                    borderRadius:'8px 8px 4px 4px',
                    minHeight:8,
                    transition:'all .3s',
                    cursor:'pointer',
                  }} />
                  <div style={{fontSize:11, color: isLast ? C.accent : C.text3, fontWeight: isLast ? 700 : 500}}>{m.mes}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:18, fontWeight:700, margin:'0 0 18px', color:C.text, letterSpacing:'-.3px'}}>Estado del portafolio</h2>
          {[
            { l:'Arrendadas',  n:activeProps,  c:C.success, pct: Math.round((activeProps  / props.length) * 100) },
            { l:'En mora',     n:overdueProps, c:C.danger,  pct: Math.round((overdueProps / props.length) * 100) },
            { l:'Disponibles', n:vacantProps,  c:C.accent,  pct: Math.round((vacantProps  / props.length) * 100) },
          ].map(s => (
            <div key={s.l} style={{marginBottom:16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6}}>
                <span style={{fontSize:13, color:C.text, fontWeight:500}}>{s.l}</span>
                <span style={{fontSize:13, fontWeight:700, color:s.c, fontFamily:'Georgia, serif'}}>{s.n} <span style={{fontSize:11, color:C.text3, fontWeight:500}}>({s.pct}%)</span></span>
              </div>
              <div style={{height:6, background:C.bg3, borderRadius:3, overflow:'hidden'}}>
                <div style={{width:`${s.pct}%`, height:'100%', background:s.c, borderRadius:3, transition:'width .5s'}} />
              </div>
            </div>
          ))}
          <div style={{marginTop:20, padding:18, background:C.bg3, borderRadius:14, textAlign:'center'}}>
            <div style={{fontSize:11, color:C.text3, fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', marginBottom:6}}>Ocupación total</div>
            <div style={{fontSize:36, fontWeight:700, color:C.success, fontFamily:'Georgia, serif', letterSpacing:'-1px', lineHeight:1}}>
              {Math.round(((activeProps + overdueProps) / props.length) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* RECIENTES */}
      <div className="rt-cols-half" style={{display:'grid', gap:16}}>
        <div style={S.card}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 14px', color:C.text, letterSpacing:'-.3px'}}>Pagos recientes</h2>
          {payments.slice(0, 4).map(p => (
            <div key={p.id} style={{display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:36, height:36, borderRadius:'50%', background:`${p.status === 'paid' ? C.success : C.warning}15`, color: p.status === 'paid' ? C.success : C.warning, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {p.status === 'paid' ? Icon.check() : <span style={{fontSize:16, fontWeight:700}}>!</span>}
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600, color:C.text}}>{p.tenant}</div>
                <div style={{fontSize:11, color:C.text2}}>{p.date}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'Georgia, serif', fontWeight:700, color: p.status === 'paid' ? C.success : C.warning, fontSize:14}}>{fmt(p.amount)}</div>
                <span style={{fontSize:10, color:payStatus[p.status].c, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase'}}>{payStatus[p.status].l}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <h2 style={{fontSize:16, fontWeight:700, margin:'0 0 14px', color:C.text, letterSpacing:'-.3px'}}>Mantenimientos activos</h2>
          {maint.filter(m => m.status !== 'done').map(m => (
            <div key={m.id} style={{display:'flex', gap:12, alignItems:'flex-start', padding:'12px 0', borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:8, height:8, borderRadius:'50%', background:maintPriority[m.priority], marginTop:6, flexShrink:0}} />
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600, color:C.text}}>{m.issue}</div>
                <div style={{fontSize:11, color:C.text2, marginTop:2}}>{m.prop}</div>
              </div>
              <span style={{fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:100, background:maintStatus[m.status].bg, color:maintStatus[m.status].c, flexShrink:0, whiteSpace:'nowrap', textTransform:'uppercase', letterSpacing:'.3px'}}>{maintStatus[m.status].l}</span>
            </div>
          ))}
          {maint.filter(m => m.status !== 'done').length === 0 && (
            <div style={{fontSize:13, color:C.text2, textAlign:'center', padding:24}}>Sin mantenimientos pendientes</div>
          )}
        </div>
      </div>
    </div>
  );
}
