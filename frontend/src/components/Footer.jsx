export default function Footer() {
  const year = new Date().getFullYear();
  const styles = {
    footer: {
      padding: "14px 20px",
      textAlign: "center",
      color: "#6b7280",
      borderTop: "1px solid #e6edf3",
      background: "#fff",
      fontSize: 14,
    },
    appName: { fontWeight: 600, color: "#111827", marginLeft: 6 }
  };

  return (
    <footer style={styles.footer}>
      <span>© {year}</span>
      <span style={styles.appName}>StockApp</span>
      <span style={{ marginLeft: 8, color: "#94a3b8" }}>— All rights reserved</span>
      <span style={{ marginLeft: 8, color: "#94a3b8" }}>: For Web Development Mini Project</span>
    </footer>
  );
}