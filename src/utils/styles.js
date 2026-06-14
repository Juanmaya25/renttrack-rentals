export const makeStyles = C => ({
  card:    { background:C.bg2, border:`1px solid ${C.border}`, borderRadius:18, padding:22, boxShadow:C.shadow },
  input:   { background:C.bg2, border:`1px solid ${C.borderDark}`, borderRadius:10, padding:'11px 14px', fontSize:14, color:C.text, outline:'none', fontFamily:'inherit', width:'100%', boxSizing:'border-box', transition:'border-color .15s, box-shadow .15s' },
  btnPri:  { background:C.text, color:C.bg2, border:'none', borderRadius:100, padding:'12px 22px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:8, transition:'transform .15s, box-shadow .2s' },
  btnGhost:{ background:'transparent', color:C.text, border:`1px solid ${C.borderDark}`, borderRadius:100, padding:'12px 18px', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap:6, transition:'all .15s' },
  btnIcon: { background:'transparent', color:C.text2, border:'none', cursor:'pointer', padding:8, borderRadius:10, display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background .15s, color .15s' },
});

export const makeFocusHandlers = C => ({
  onFocus: e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accent}25`; },
  onBlur:  e => { e.target.style.borderColor = C.borderDark; e.target.style.boxShadow = 'none'; },
});
