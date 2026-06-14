import { Icon } from './icons.jsx';
import { fmt } from '../utils/format.js';

export const NAV = [
  { id:'dashboard',   icon: Icon.home,     label:'Inicio' },
  { id:'properties',  icon: Icon.building, label:'Propiedades' },
  { id:'payments',    icon: Icon.dollar,   label:'Pagos' },
  { id:'maintenance', icon: Icon.wrench,   label:'Mantenimiento' },
  { id:'reports',     icon: Icon.chart,    label:'Reportes' },
];

export function Header({ page, onNavigate, theme, onToggleTheme, monthlyTotal, C }) {
  return (
    <header style={{background:C.bg2, borderBottom:`1px solid ${C.border}`, padding:'18px 32px', position:'sticky', top:0, zIndex:50, backdropFilter:'blur(12px)'}}>
      <div style={{maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <div style={{width:40, height:40, borderRadius:12, background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {Icon.building()}
          </div>
          <div>
            <div style={{fontWeight:800, fontSize:18, letterSpacing:'-.5px', color:C.text, fontFamily:'Georgia, serif'}}>RentTrack</div>
            <div style={{fontSize:11, color:C.text2, marginTop:1, letterSpacing:'.3px'}}>Gestión de arrendamientos</div>
          </div>
        </div>

        <nav style={{display:'flex', gap:4, overflowX:'auto'}}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                style={{
                  background: active ? C.text : 'transparent',
                  color:      active ? C.bg2 : C.text2,
                  border:'none', borderRadius:100, padding:'10px 18px',
                  fontSize:13, fontWeight: active ? 700 : 500,
                  cursor:'pointer', fontFamily:'inherit',
                  display:'inline-flex', alignItems:'center', gap:8,
                  transition:'all .15s', whiteSpace:'nowrap',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.bg3; e.currentTarget.style.color = C.text; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.text2; }}}
              >
                <span style={{display:'flex', opacity:.85}}>{n.icon()}</span>
                {n.label}
              </button>
            );
          })}
        </nav>

        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{padding:'8px 14px', background:C.bg3, borderRadius:100, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:8}}>
            <span style={{color:C.text3, fontSize:10, letterSpacing:'.4px', textTransform:'uppercase'}}>Mes</span>
            <span style={{color:C.success, fontFamily:'Georgia, serif', fontSize:14}}>{fmt(monthlyTotal)}</span>
          </div>
          <button onClick={onToggleTheme} aria-label="Tema" style={{background:C.bg3, border:'none', color:C.text, width:38, height:38, borderRadius:'50%', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
            {theme === 'light' ? Icon.moon() : Icon.sun()}
          </button>
        </div>
      </div>
    </header>
  );
}
