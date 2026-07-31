export function baseTemplate({ titulo, preheader, corpoHtml }) {
  return `
  <!doctype html>
  <html lang="pt-BR">
    <body style="margin:0;padding:0;background-color:#0F0F17;font-family:Inter,Arial,sans-serif;">
      <span style="display:none;max-height:0;overflow:hidden;">${preheader || ''}</span>
      <table role="presentation" width="100%" style="background-color:#0F0F17;padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" style="background-color:#1A1A26;border-radius:12px;padding:32px;">
              <tr>
                <td>
                  <p style="color:#6366F1;font-weight:700;font-size:14px;letter-spacing:0.05em;text-transform:uppercase;margin:0 0 16px;">DevFocus</p>
                  <h1 style="color:#F4F4F5;font-size:22px;font-weight:700;margin:0 0 16px;">${titulo}</h1>
                  ${corpoHtml}
                </td>
              </tr>
            </table>
            <p style="color:#6B7280;font-size:12px;margin-top:16px;">Você está recebendo este e-mail porque possui uma conta ativa no DevFocus.</p>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}
