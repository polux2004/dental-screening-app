import sqlite3

conn = sqlite3.connect("dental_screening.db")
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
print("Tablas:", cur.fetchall())

cur.execute("SELECT COUNT(*) FROM detection_results")
print("Filas en detection_results:", cur.fetchone()[0])

cur.execute("SELECT id, photo_type, diagnosis, notes, created_at FROM detection_results ORDER BY id DESC LIMIT 10")
rows = cur.fetchall()
if rows:
    print("\nÚltimos registros:")
    for r in rows:
        print(r)
else:
    print("Sin registros aún.")

conn.close()
