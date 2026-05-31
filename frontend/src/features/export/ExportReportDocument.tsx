import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ExportResultData } from "./types";

interface ExportReportDocumentProps {
  result: ExportResultData;
  capturedImage: string | null;
  generatedAt: Date;
}

const getBinColor = (warnaTong: string) => {
  if (warnaTong === "Hijau") return "#10b981";
  if (warnaTong === "Kuning") return "#f59e0b";
  if (warnaTong === "Merah") return "#f43f5e";
  return "#64748b";
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#dbe4f3",
    padding: 18,
    fontFamily: "Helvetica",
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid #dbe4ee",
    backgroundColor: "#ffffff",
  },
  hero: {
    backgroundColor: "#14213d",
    paddingHorizontal: 24,
    paddingVertical: 22,
  },
  eyebrow: {
    color: "#cbd5e1",
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: 700,
    marginTop: 8,
  },
  subtitle: {
    color: "#bfdbfe",
    fontSize: 12,
    marginTop: 4,
  },
  body: {
    padding: 18,
    gap: 10,
    backgroundColor: "#f1f5f9",
  },
  panel: {
    borderRadius: 12,
    border: "1px solid #dbe4ee",
    backgroundColor: "#f8fafc",
  },
  photoWrap: {
    height: 230,
    overflow: "hidden",
    borderRadius: 12,
    border: "1px solid #dbe4ee",
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  meta: {
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  binValue: {
    color: "#64748b",
    fontSize: 34,
    fontWeight: 700,
    marginTop: 2,
  },
  timeBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    border: "1px solid #dbe4ee",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  timeValue: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: 700,
  },
  category: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.9,
  },
  categoryValue: {
    color: "#334155",
    fontSize: 20,
    fontWeight: 700,
  },
  textPanel: {
    padding: 14,
    gap: 6,
  },
  textLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#64748b",
  },
  textValue: {
    fontSize: 13,
    lineHeight: 1.45,
    fontWeight: 700,
    color: "#0f172a",
  },
  tipsPanel: {
    borderColor: "#fcd34d",
    backgroundColor: "#fffbeb",
  },
  tipsLabel: {
    color: "#a16207",
  },
  tipsValue: {
    color: "#78350f",
  },
  emptyPhoto: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
  },
});

export const ExportReportDocument = ({ result, capturedImage, generatedAt }: ExportReportDocumentProps) => (
  <Document title={`EcoSort-${result.item}`} author="EcoSort">
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>EcoSort Intelligence</Text>
          <Text style={styles.title}>{result.item}</Text>
          <Text style={styles.subtitle}>Laporan klasifikasi objek berbasis AI</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.photoWrap}>
            {capturedImage ? <Image src={capturedImage} style={styles.photo} /> : <Text style={styles.emptyPhoto}>Tidak ada foto</Text>}
          </View>

          <View style={[styles.panel, styles.meta]}>
            <Text style={styles.label}>Rekomendasi Tong</Text>
            <Text style={[styles.binValue, { color: getBinColor(result.warna_tong) }]}>{result.warna_tong}</Text>
            <View style={styles.timeBox}>
              <Text style={styles.label}>Waktu Dibuat</Text>
              <Text style={styles.timeValue}>
                {generatedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB •{" "}
                {generatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
              </Text>
            </View>
          </View>

          <View style={[styles.panel, styles.category]}>
            <Text style={styles.categoryLabel}>Kategori</Text>
            <Text style={styles.categoryValue}>{result.kategori}</Text>
          </View>

          <View style={[styles.panel, styles.textPanel]}>
            <Text style={styles.textLabel}>Ringkasan</Text>
            <Text style={styles.textValue}>{result.penjelasan}</Text>
          </View>

          <View style={[styles.panel, styles.textPanel, styles.tipsPanel]}>
            <Text style={[styles.textLabel, styles.tipsLabel]}>Tips Pengelolaan</Text>
            <Text style={[styles.textValue, styles.tipsValue]}>{result.tips}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

