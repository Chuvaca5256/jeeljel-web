const Divider = () => (
  <div
    style={{
      width: '80%',
      margin: '0.5rem auto',
      height: '12px',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='12'%3E%3Crect width='40' height='12' fill='none'/%3E%3Cpolyline points='0,6 4,2 8,6 12,2 16,6 20,2 24,6 28,2 32,6 36,2 40,6' fill='none' stroke='%23c9a84c' stroke-width='1.2' opacity='0.7'/%3E%3Cpolyline points='0,6 4,10 8,6 12,10 16,6 20,10 24,6 28,10 32,6 36,10 40,6' fill='none' stroke='%23c9a84c' stroke-width='1.2' opacity='0.7'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat-x',
      backgroundPosition: 'center',
      opacity: 0.85,
    }}
  />
)

export default Divider
