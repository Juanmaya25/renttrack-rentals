import { Icon } from '../components/icons.jsx';
import { maintPriority, maintStatus } from '../data/themes.js';

export function Maintenance({ maint, onNew, onClose, C, S }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Operaciones</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Mantenimiento</h1>
        </div>
        <button style={S.btnPri} onClick={onNew}>
          <Icon.plus /> Nuevo reporte
        </button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:12}}>
        {maint.map(m => (
          <div key={m.id} style={{
            ...S.card,
            display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
            borderLeft:`5px solid ${maintPriority[m.priority]}`,
          }}>
            <div style={{width:42, height:42, borderRadius:'50%', background:`${maintPriority[m.priority]}15`, color:maintPriority[m.priority], display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
              {Icon.wrench()}
            </div>
            <div style={{flex:1, minWidth:200}}>
              <div style={{display:'flex', gap:10, alignItems:'center', flexWrap:'wrap', marginBottom:5}}>
                <h3 style={{fontSize:15, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.2px'}}>{m.issue}</h3>
                <span style={{fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:100, background:`${maintPriority[m.priority]}15`, color:maintPriority[m.priority], textTransform:'uppercase', letterSpacing:'.3px'}}>
                  {m.priority === 'high' ? 'Alta' : m.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
              <div style={{fontSize:13, color:C.text2, marginBottom:3}}>{m.prop}</div>
              <div style={{fontSize:12, color:C.text3}}>Reportado: {m.date}{m.tech && ` · ${m.tech}`}</div>
            </div>
            <div style={{display:'flex', gap:8, alignItems:'center', flexShrink:0}}>
              <span style={{fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:100, background:maintStatus[m.status].bg, color:maintStatus[m.status].c, textTransform:'uppercase', letterSpacing:'.3px'}}>{maintStatus[m.status].l}</span>
              {m.status !== 'done' && (
                <button onClick={() => onClose(m.id)} style={{background:`${C.success}15`, border:`1px solid ${C.success}40`, color:C.success, borderRadius:100, padding:'7px 14px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:5}}>
                  <Icon.check /> Resolver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
