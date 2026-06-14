import { Icon } from '../components/icons.jsx';
import { fmt } from '../utils/format.js';
import { statusInfo, propTypeStyle } from '../data/themes.js';

export function Properties({ props, filteredProps, search, onSearch, filterStatus, onFilter, onExport, onNew, onEdit, onDelete, C, S, focusH }) {
  return (
    <div className="fade-in">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:14}}>
        <div>
          <div style={{fontSize:13, color:C.text3, fontWeight:600, marginBottom:6, letterSpacing:'.3px', textTransform:'uppercase'}}>Catálogo</div>
          <h1 style={{fontSize:36, fontWeight:700, margin:0, color:C.text, letterSpacing:'-1.2px', fontFamily:'Georgia, serif', lineHeight:1.1}}>Propiedades</h1>
          <div style={{fontSize:14, color:C.text2, marginTop:6}}>{filteredProps.length} de {props.length}</div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <button style={S.btnGhost} onClick={onExport}>
            <Icon.download /> Exportar
          </button>
          <button style={S.btnPri} onClick={onNew}>
            <Icon.plus /> Agregar propiedad
          </button>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div style={{display:'flex', gap:10, marginBottom:24, flexWrap:'wrap', alignItems:'center'}}>
        <div style={{flex:1, minWidth:240, position:'relative', maxWidth:400}}>
          <span style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.text3}}>{Icon.search()}</span>
          <input style={{...S.input, paddingLeft:38}} placeholder="Buscar dirección, propiedad, inquilino..." value={search} onChange={e => onSearch(e.target.value)} {...focusH} />
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {['all','active','overdue','vacant'].map(s => (
            <button
              key={s}
              onClick={() => onFilter(s)}
              style={{
                background: filterStatus === s ? C.text : 'transparent',
                color:      filterStatus === s ? C.bg2 : C.text,
                border: `1px solid ${filterStatus === s ? C.text : C.borderDark}`,
                borderRadius:100, padding:'10px 18px', fontSize:13, fontWeight: filterStatus === s ? 600 : 500,
                cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
              }}
            >
              {s === 'all' ? 'Todas' : s === 'active' ? 'Arrendadas' : s === 'overdue' ? 'En mora' : 'Disponibles'}
            </button>
          ))}
        </div>
      </div>

      {/* AIRBNB-STYLE LISTING CARDS */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:24}}>
        {filteredProps.map(p => {
          const ts = propTypeStyle[p.type] || propTypeStyle.Apartamento;
          return (
            <div key={p.id} style={{
              background:C.bg2,
              borderRadius:18,
              overflow:'hidden',
              cursor:'pointer',
              transition:'transform .25s, box-shadow .25s',
              boxShadow:C.shadow,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = C.shadowLg; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = C.shadow; }}>
              {/* "Imagen" - gradient + emoji */}
              <div style={{
                background: ts.bg,
                height:200, position:'relative',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{fontSize:80, opacity:.4}}>{ts.emoji}</span>
                <div style={{position:'absolute', top:14, left:14}}>
                  <span style={{fontSize:11, fontWeight:700, padding:'5px 12px', borderRadius:100, background:'rgba(255,255,255,.95)', color:statusInfo[p.status].c, display:'inline-flex', alignItems:'center', gap:6}}>
                    <span style={{width:6, height:6, borderRadius:'50%', background:statusInfo[p.status].dot}} />
                    {statusInfo[p.status].l}
                  </span>
                </div>
                <div style={{position:'absolute', top:14, right:14}}>
                  <span style={{fontSize:11, fontWeight:600, padding:'5px 12px', borderRadius:100, background:'rgba(0,0,0,.4)', color:'#fff', backdropFilter:'blur(4px)'}}>
                    {p.type}
                  </span>
                </div>
                <div style={{position:'absolute', bottom:14, left:14, right:14, display:'flex', gap:8}}>
                  <button style={{flex:1, background:'rgba(255,255,255,.95)', color:C.text, border:'none', borderRadius:10, padding:'8px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={e => { e.stopPropagation(); onEdit(p); }}>
                    <Icon.pencil /> Editar
                  </button>
                  <button style={{background:'rgba(255,255,255,.95)', color:C.danger, border:'none', borderRadius:10, padding:'8px 12px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6}} onClick={e => { e.stopPropagation(); onDelete(p.id); }}>
                    <Icon.trash />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{padding:'20px 22px'}}>
                <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:6}}>
                  <h3 style={{fontSize:17, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.3px'}}>{p.name}</h3>
                </div>
                <div style={{fontSize:13, color:C.text2, marginBottom:14, display:'flex', alignItems:'center', gap:5}}>
                  {Icon.pin()} {p.address}
                </div>

                <div style={{display:'flex', gap:14, marginBottom:14, fontSize:12, color:C.text2, paddingBottom:14, borderBottom:`1px solid ${C.border}`}}>
                  <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.ruler()} {p.area}</span>
                  {p.rooms > 0 && <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.bed()} {p.rooms} hab</span>}
                  <span style={{display:'inline-flex', alignItems:'center', gap:5}}>{Icon.bath()} {p.baths || 1}</span>
                </div>

                {p.tenant ? (
                  <>
                    <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6, marginBottom:4}}>
                      {Icon.user()} <strong style={{color:C.text, fontWeight:600}}>{p.tenant}</strong>
                    </div>
                    <div style={{fontSize:12, color:C.text2, display:'flex', alignItems:'center', gap:6, marginBottom:14}}>
                      {Icon.phone()} {p.phone}
                    </div>
                  </>
                ) : (
                  <div style={{padding:'10px 14px', background:`${C.accent}10`, color:C.accent, borderRadius:10, fontSize:12, fontWeight:600, marginBottom:14, display:'inline-flex', alignItems:'center', gap:8}}>
                    {Icon.key()} Disponible para arrendar
                  </div>
                )}

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <div>
                    <div style={{fontSize:24, fontWeight:700, color:C.text, fontFamily:'Georgia, serif', letterSpacing:'-.5px', display:'inline'}}>{fmt(p.rent)}</div>
                    <span style={{fontSize:13, color:C.text2, marginLeft:4}}>/mes</span>
                  </div>
                  {p.end && (
                    <div style={{fontSize:11, color:C.text3, display:'inline-flex', alignItems:'center', gap:5}}>
                      {Icon.calendar()} hasta {p.end}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredProps.length === 0 && (
          <div style={{...S.card, gridColumn:'1/-1', textAlign:'center', padding:40, color:C.text2}}>
            <div style={{fontSize:48, marginBottom:10, opacity:.3}}>🏠</div>
            Ninguna propiedad coincide con los filtros.
          </div>
        )}
      </div>
    </div>
  );
}
