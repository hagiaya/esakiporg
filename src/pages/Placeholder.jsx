function Placeholder({ title }) {
  return (
    <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)' }}>Halaman ini sedang dalam pengembangan.</p>
    </div>
  );
}

export default Placeholder;
