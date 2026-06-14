import { Icon } from './icons.jsx';

export function Modal({ title, onSave, onClose, children, C, S }) {
  return (
    <div
      style={{position:'fixed', inset:0, background:'rgba(28, 25, 23, .65)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'40px 16px', overflowY:'auto'}}
      onClick={onClose}
    >
      <div
        style={{background:C.bg2, borderRadius:20, padding:30, width:'100%', maxWidth:540, boxShadow:C.shadowLg, border:`1px solid ${C.border}`}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
          <h2 style={{fontSize:22, fontWeight:700, margin:0, color:C.text, letterSpacing:'-.6px'}}>{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" style={{background:C.bg3, border:'none', color:C.text2, width:36, height:36, borderRadius:'50%', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {Icon.close()}
          </button>
        </div>
        {children}
        <div style={{display:'flex', gap:10, justifyContent:'flex-end', marginTop:24}}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={S.btnPri} onClick={onSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{marginBottom:16}}>
      <label style={{fontSize:12, color:'inherit', opacity:.7, display:'block', marginBottom:6, fontWeight:600}}>{label}</label>
      {children}
    </div>
  );
}
