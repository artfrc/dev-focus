import { useI18n } from 'vue-i18n';
import { formatarData, formatarDataHora, hojeBrasiliaISO } from '../lib/date.js';

/** Formatacao de datas ciente do idioma atual da interface (pt-BR ou en). */
export function useFormatoData() {
  const { locale } = useI18n();

  return {
    formatarData: (dataISO) => formatarData(dataISO, locale.value),
    formatarDataHora: (timestamp) => formatarDataHora(timestamp, locale.value),
    hojeBrasiliaISO,
  };
}
