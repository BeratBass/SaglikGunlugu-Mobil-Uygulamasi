import { Log } from '../types/navigation';

type ViewMode = 'daily' | 'weekly' | 'monthly';
type DataType = 'steps' | 'water' | 'sleep' | 'calories' | 'weight';

/**
 * Firestore'dan gelen log verilerini, seçilen zaman aralığına ve veri türüne göre
 * `react-native-chart-kit`'in anlayacağı formata dönüştürür.
 * @param logs - Firestore'dan gelen sıralanmış log dizisi.
 * @param viewMode - 'daily', 'weekly', veya 'monthly'.
 * @param dataType - Grafiği çizilecek veri türü (örn: 'steps').
 * @returns - Grafik için formatlanmış veri.
 */
export const processChartData = (logs: Log[], viewMode: ViewMode, dataType: DataType) => {
  if (viewMode === 'daily') {
    // Son 7 günün verisini al
    const recentLogs = logs.slice(-7);
    return {
      labels: recentLogs.map(log => new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })),
      datasets: [{
        data: recentLogs.map(log => Number(log[dataType]) || 0),
      }],
    };
  }

  const groupedData: { [key: string]: { values: number[]; count: number } } = {};

  logs.forEach(log => {
    const date = new Date(log.date);
    if (isNaN(date.getTime())) return;

    let key = '';
    if (viewMode === 'weekly') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Pazartesi haftanın başlangıcı
      key = startOfWeek.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } else if (viewMode === 'monthly') {
      key = date.toLocaleDateString('tr-TR', { month: 'short', year: '2-digit' });
    }
    
    if (!groupedData[key]) {
      groupedData[key] = { values: [], count: 0 };
    }
    
    const value = Number(log[dataType]);
    if (!isNaN(value)) {
      groupedData[key].values.push(value);
      groupedData[key].count += 1;
    }
  });

  const labels = Object.keys(groupedData);
  const data = labels.map(key => {
    const group = groupedData[key];
    if (group.values.length === 0) return 0;
    const sum = group.values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / group.count); // Ortalamayı al
  });

  return {
    labels,
    datasets: [{ data }],
  };
};