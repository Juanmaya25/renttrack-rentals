// PALETTE: real-estate cyan + slate, mucho whitespace, estilo Airbnb
export const themes = {
  light: {
    bg:        '#f5f5f4',     // beige claro
    bg2:       '#ffffff',
    bg3:       '#fafaf9',
    accent:    '#0d9488',     // teal premium
    accent2:   '#0891b2',     // cyan
    accent3:   '#f59e0b',     // dorado para destacar
    success:   '#059669',
    danger:    '#e11d48',
    warning:   '#ea580c',
    text:      '#1c1917',
    text2:     '#57534e',
    text3:     '#a8a29e',
    border:    '#e7e5e4',
    borderDark:'#d6d3d1',
    shadow:    '0 1px 2px rgba(28,25,23,.04)',
    shadowMd:  '0 6px 20px rgba(28,25,23,.06)',
    shadowLg:  '0 20px 60px rgba(28,25,23,.12)',
  },
  dark: {
    bg:        '#0c0a09',
    bg2:       '#1c1917',
    bg3:       '#292524',
    accent:    '#2dd4bf',
    accent2:   '#22d3ee',
    accent3:   '#fbbf24',
    success:   '#10b981',
    danger:    '#fb7185',
    warning:   '#fb923c',
    text:      '#fafaf9',
    text2:     '#a8a29e',
    text3:     '#78716c',
    border:    '#292524',
    borderDark:'#44403c',
    shadow:    '0 1px 2px rgba(0,0,0,.3)',
    shadowMd:  '0 6px 20px rgba(0,0,0,.5)',
    shadowLg:  '0 20px 60px rgba(0,0,0,.6)',
  },
};

export const statusInfo = {
  active:  { l:'Arrendado',  bg:'rgba(16,185,129,.12)', c:'#059669', dot:'#10b981' },
  overdue: { l:'En mora',    bg:'rgba(225,29,72,.12)',  c:'#e11d48', dot:'#fb7185' },
  vacant:  { l:'Disponible', bg:'rgba(13,148,136,.12)', c:'#0d9488', dot:'#2dd4bf' },
};

export const payStatus = {
  paid:    { l:'Pagado',    bg:'rgba(16,185,129,.12)', c:'#059669' },
  pending: { l:'Pendiente', bg:'rgba(234,88,12,.12)',  c:'#ea580c' },
  overdue: { l:'En mora',   bg:'rgba(225,29,72,.12)',  c:'#e11d48' },
};

export const maintPriority = { high:'#e11d48', medium:'#ea580c', low:'#a8a29e' };

export const maintStatus = {
  open:     { l:'Abierto',    bg:'rgba(225,29,72,.12)', c:'#e11d48' },
  progress: { l:'En proceso', bg:'rgba(234,88,12,.12)', c:'#ea580c' },
  done:     { l:'Resuelto',   bg:'rgba(16,185,129,.12)', c:'#059669' },
};

// Imagen placeholder por tipo de propiedad (gradient + emoji)
export const propTypeStyle = {
  Apartamento: { bg:'linear-gradient(135deg, #06b6d4, #3b82f6)', emoji:'🏢' },
  Casa:        { bg:'linear-gradient(135deg, #f59e0b, #ef4444)', emoji:'🏡' },
  Local:       { bg:'linear-gradient(135deg, #8b5cf6, #ec4899)', emoji:'🏬' },
  Bodega:      { bg:'linear-gradient(135deg, #64748b, #475569)', emoji:'🏭' },
};
