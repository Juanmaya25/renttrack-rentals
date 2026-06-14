export const toCSV = data => {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  return [
    headers.join(','),
    ...data.map(r => headers.map(h => `"${(r[h] ?? '').toString().replace(/"/g, '""')}"`).join(','))
  ].join('\n');
};

export const downloadCSV = (data, name) => {
  const csv  = toCSV(data);
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${name}_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
