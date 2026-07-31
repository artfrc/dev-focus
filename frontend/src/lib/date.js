const FUSO_BRASILIA = 'America/Sao_Paulo';

function localeIntl(idioma) {
  return idioma === 'en' ? 'en-US' : 'pt-BR';
}

/**
 * 'YYYY-MM-DD' (data pura, sem horario) -> 'dd/mm/aaaa' (pt-BR) ou 'mm/dd/aaaa' (en).
 * O fuso nao importa aqui pois a coluna e' `date`, sem componente de horario.
 */
export function formatarData(dataISO, idioma = 'pt-BR') {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.slice(0, 10).split('-').map(Number);
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return new Intl.DateTimeFormat(localeIntl(idioma), {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data);
}

/**
 * Timestamp (ISO com horario, ex: criado_em/concluido_em) -> data+hora formatada.
 * Sempre convertido para o horario de Brasilia, independente do idioma da interface
 * (o idioma muda o formato/ordem da data, nao o fuso horario exibido).
 */
export function formatarDataHora(timestamp, idioma = 'pt-BR') {
  if (!timestamp) return '';
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat(localeIntl(idioma), {
      timeZone: FUSO_BRASILIA,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(new Date(timestamp))
      .map((p) => [p.type, p.value]),
  );
  const dataFormatada =
    idioma === 'en' ? `${partes.month}/${partes.day}/${partes.year}` : `${partes.day}/${partes.month}/${partes.year}`;
  return `${dataFormatada} ${partes.hour}:${partes.minute}`;
}

/** Data de "hoje" em Brasilia, no formato 'YYYY-MM-DD' (para comparar com colunas `date` do banco). */
export function hojeBrasiliaISO() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO_BRASILIA }).format(new Date());
}
