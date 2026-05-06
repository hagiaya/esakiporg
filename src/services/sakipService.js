/**
 * SAKIP Data Service
 * This service acts as a bridge to provide Renstra data for each OPD.
 * In a production environment, this would call a backend API.
 */

const sakipData = {
  DINKES: [
    {
      tujuan: "Meningkatnya Derajat Kesehatan",
      sasaran: "Meningkatnya Akses dan Mutu Pelayanan Kesehatan Menuju Cakupan Kesehatan Semesta",
      activeYears: [2023, 2024, 2025, 2026],
      indikatorList: [
        {
          indikator: "100% tahapan SPM Provinsi terpenuhi sesuai standar pada tahun 2026",
          satuan: "%",
          target: { 2023: "", 2024: "100", 2025: "", 2026: "" },
          program: "Program Pemenuhan Upaya Kesehatan"
        },
        {
          indikator: "Angka Kematian Bayi (AKB) per 1.000 KH",
          satuan: "1000",
          target: { 2023: "0.3", 2024: "0.4", 2025: "16", 2026: "" },
          program: "Program Kesehatan Masyarakat"
        },
        {
          indikator: "Angka Kematian Ibu (AKI) per 100.000 KH",
          satuan: "100000",
          target: { 2023: "", 2024: "100", 2025: "183", 2026: "" },
          program: "Program Kesehatan Masyarakat"
        },
        {
          indikator: "Prevalensi Wasting",
          satuan: "Persen",
          target: { 2023: "", 2024: "", 2025: "5", 2026: "" },
          program: "Program Kesehatan Masyarakat"
        }
      ]
    },
    {
      tujuan: "Meningkatnya Kualitas Tata Kelola Pemerintahan",
      sasaran: "Meningkatnya Kualitas Urusan Penunjang Pemerintahan OPD",
      activeYears: [2023, 2024, 2025, 2026],
      indikatorList: [
        {
          indikator: "Indeks Kepuasan Masyarakat",
          satuan: "Indeks",
          target: { 2023: "88", 2024: "89", 2025: "", 2026: "" },
          program: "Program Penunjang Urusan Pemerintahan"
        },
        {
          indikator: "Nilai Sakip OPD",
          satuan: "Persen",
          target: { 2023: "", 2024: "", 2025: "80", 2026: "" },
          program: "Program Penunjang Urusan Pemerintahan"
        }
      ]
    }
  ],
  DIKBUDPORA: [
    {
      tujuan: "Peningkatan pelestarian kebudayaan",
      sasaran: "Meningkatkan pelestarian warisan budaya daerah",
      activeYears: [2023, 2024, 2025, 2026],
      indikatorList: [
        {
          indikator: "Persentase komunitas budaya yang diberdayakan",
          satuan: "%",
          target: { 2023: "85", 2024: "100", 2025: "100", 2026: "100" },
          program: "Program Pengelolaan Kebudayaan"
        }
      ]
    }
  ]
};

export const fetchRenstraByOPD = async (opdCode) => {
  // Simulate API Delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (sakipData[opdCode]) {
    return sakipData[opdCode].map(s => ({
      ...s,
      id: Math.random().toString(36).substr(2, 9),
      expanded: true,
      indikatorList: s.indikatorList.map(i => ({
        ...i,
        id: Math.random().toString(36).substr(2, 9),
        kondisiAwal: i.kondisiAwal || "0",
        kondisiAkhir: i.kondisiAkhir || "100"
      }))
    }));
  }
  
  return null;
};
