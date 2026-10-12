// Email templates and mock dispatcher for ALMAS-SHOP

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  templateKey: string;
  contentHtml: string;
  sentAt: string;
  status: 'SENT' | 'FAILED';
}

export function generateNewSaleEmailToVendor(
  vendorName: string,
  storeName: string,
  orderNumber: string,
  productName: string,
  totalAmount: number,
  commissionAmount: number,
  netAmount: number,
  customerName: string,
  customerCity: string,
  customerPhone: string
): { subject: string; html: string } {
  const subject = `🎉 Nova Venda Confirmada! Pedido #${orderNumber} - ${productName}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #051F20; color: #DAF1DE; margin: 0; padding: 20px; }
    .card { background-color: #0B2B26; border: 1px solid #235347; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; }
    .header { text-align: center; border-bottom: 1px solid #163832; padding-bottom: 16px; margin-bottom: 20px; }
    .logo { color: #8EB69B; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
    .badge { background: #235347; color: #DAF1DE; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-block; }
    .highlight { color: #8EB69B; font-weight: 700; font-size: 20px; }
    .box { background: #163832; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .btn { display: inline-block; background-color: #8EB69B; color: #051F20; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
    .footer { text-align: center; font-size: 12px; color: #8EB69B; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">ALMAS-SHOP · EASY SOLUTION</div>
      <p style="margin: 4px 0 0 0; color: #8EB69B; font-size: 13px;">Marketplace Oficial de Moçambique</p>
    </div>
    
    <span class="badge">NOVA VENDA RECEBIDA</span>
    <h2 style="color: #ffffff; margin-top: 12px;">Parabéns, ${vendorName}!</h2>
    <p>A sua loja <strong>${storeName}</strong> acabou de vender um item através do marketplace ALMAS-SHOP.</p>
    
    <div class="box">
      <p style="margin: 4px 0;"><strong>Pedido:</strong> #${orderNumber}</p>
      <p style="margin: 4px 0;"><strong>Produto:</strong> ${productName}</p>
      <p style="margin: 4px 0;"><strong>Valor Bruto:</strong> ${totalAmount.toLocaleString()} MT</p>
      <p style="margin: 4px 0; color: #8EB69B;"><strong>Comissão Plataforma (5%):</strong> -${commissionAmount.toLocaleString()} MT</p>
      <hr style="border: 0; border-top: 1px solid #235347; margin: 8px 0;" />
      <p style="margin: 4px 0;" class="highlight">Seu Saldo Líquido: ${netAmount.toLocaleString()} MT</p>
    </div>

    <div class="box">
      <h4 style="margin: 0 0 8px 0; color: #DAF1DE;">Dados do Comprador para Entrega:</h4>
      <p style="margin: 2px 0;"><strong>Cliente:</strong> ${customerName}</p>
      <p style="margin: 2px 0;"><strong>Localização:</strong> ${customerCity}</p>
      <p style="margin: 2px 0;"><strong>Contacto:</strong> ${customerPhone}</p>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #8EB69B;">Modalidade: Pagamento na Entrega (Estafeta Maputo/Matola)</p>
    </div>

    <div style="text-align: center;">
      <a href="/vendedor/pedidos" class="btn">Abrir Pedido no Painel do Vendedor</a>
    </div>

    <div class="footer">
      ALMAS-SHOP Moçambique · Suporte: yuriscandarnurgi@gmail.com · M-Pesa: 843456786<br>
      Este é um email automático de notificação de vendas.
    </div>
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateOrderConfirmationEmailToCustomer(
  customerName: string,
  orderNumber: string,
  totalAmount: number,
  itemsSummary: string,
  addressSummary: string
): { subject: string; html: string } {
  const subject = `Confirmamos o seu pedido #${orderNumber} na ALMAS-SHOP!`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; background-color: #051F20; color: #DAF1DE; margin: 0; padding: 20px; }
    .card { background-color: #0B2B26; border: 1px solid #235347; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; }
    .highlight { color: #8EB69B; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color: #ffffff;">Obrigado pela sua compra, ${customerName}!</h2>
    <p>O seu pedido <span class="highlight">#${orderNumber}</span> foi registado com sucesso.</p>
    <p><strong>Itens:</strong> ${itemsSummary}</p>
    <p><strong>Total:</strong> ${totalAmount.toLocaleString()} MT (Entrega Grátis em Maputo e Matola)</p>
    <p><strong>Endereço de Entrega:</strong> ${addressSummary}</p>
    <p>O estafeta entrará em contacto por chamada ou WhatsApp antes da entrega.</p>
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateAccountBannedEmail(userName: string, reason: string): { subject: string; html: string } {
  const subject = `Aviso Importante: Notificação sobre o estado da sua conta ALMAS-SHOP`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #051F20; color: #DAF1DE; padding: 20px;">
  <div style="background: #0B2B26; border: 1px solid #ef4444; border-radius: 12px; padding: 24px; max-width: 500px; margin: auto;">
    <h3 style="color: #ef4444;">Conta Temporariamente Suspensa</h3>
    <p>Olá, ${userName}.</p>
    <p>Informamos que o acesso à sua conta na plataforma ALMAS-SHOP foi suspenso pela administração central.</p>
    <p><strong>Motivo registado:</strong> ${reason}</p>
    <p style="font-size: 13px; color: #8EB69B;">Se considera que se tratou de um equívoco, contacte a nossa equipa de apoio: yuriscandarnurgi@gmail.com ou WhatsApp +258 83 546 6322.</p>
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateAccountUnbannedEmail(userName: string): { subject: string; html: string } {
  const subject = `A sua conta ALMAS-SHOP foi reativada com sucesso`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #051F20; color: #DAF1DE; padding: 20px;">
  <div style="background: #0B2B26; border: 1px solid #8EB69B; border-radius: 12px; padding: 24px; max-width: 500px; margin: auto;">
    <h3 style="color: #8EB69B;">Bem-vindo(a) de volta!</h3>
    <p>Olá, ${userName}. O acesso à sua conta na ALMAS-SHOP foi restabelecido pelo Administrador Mestre.</p>
    <p>Já pode aceder novamente ao marketplace ou ao seu painel profissional.</p>
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateWithdrawalUpdateEmail(
  vendorName: string,
  amount: number,
  status: 'APPROVED' | 'REJECTED' | 'PAID',
  method: string,
  notes?: string
): { subject: string; html: string } {
  const isOk = status === 'APPROVED' || status === 'PAID';
  const subject = isOk 
    ? `Levantamento de ${amount.toLocaleString()} MT ${status === 'PAID' ? 'Pago' : 'Aprovado'} - ALMAS-SHOP`
    : `Actualização sobre o seu pedido de levantamento - ALMAS-SHOP`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #051F20; color: #DAF1DE; padding: 20px;">
  <div style="background: #0B2B26; border: 1px solid ${isOk ? '#8EB69B' : '#ef4444'}; border-radius: 12px; padding: 24px; max-width: 500px; margin: auto;">
    <h3 style="color: ${isOk ? '#8EB69B' : '#ef4444'};">Levantamento ${status}</h3>
    <p>Olá, ${vendorName}.</p>
    <p>O seu pedido de levantamento de <strong>${amount.toLocaleString()} MT</strong> via ${method} foi processado.</p>
    ${notes ? `<p><strong>Observações:</strong> ${notes}</p>` : ''}
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateAdminNewRegistrationEmail(
  userName: string,
  userEmail: string,
  userRole: string
): { subject: string; html: string } {
  const subject = `Parabéns, tivestes um novo cadastro com nome: ${userName}`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #F8F8F8; color: #0F0F0F; padding: 20px;">
  <div style="background: #ffffff; border: 1px solid #5DD62C; border-radius: 16px; padding: 24px; max-width: 500px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #337418; margin-top: 0;">Novo Cadastro no ALMAS-SHOP</h2>
    <p style="font-size: 16px; font-weight: bold; color: #0F0F0F;">Parabéns, tivestes um novo cadastro com nome: ${userName}</p>
    <div style="background: #F8F8F8; padding: 12px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong>Nome:</strong> ${userName}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${userEmail}</p>
      <p style="margin: 4px 0;"><strong>Tipo de Conta:</strong> ${userRole === 'VENDOR' ? 'Vendedor / Loja' : 'Cliente'}</p>
      <p style="margin: 4px 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-MZ')}</p>
    </div>
    <p style="font-size: 12px; color: #666;">Notificação automática enviada para o Super Admin (almayurnurgi563@gmail.com).</p>
  </div>
</body>
</html>
  `;
  return { subject, html };
}

export function generateAdminNewSaleEmail(
  orderId: string,
  productName: string,
  totalAmount: number,
  customerName: string
): { subject: string; html: string } {
  const subject = `Parabéns, uma nova venda na ALMAS-SHOP`;
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #F8F8F8; color: #0F0F0F; padding: 20px;">
  <div style="background: #ffffff; border: 1px solid #5DD62C; border-radius: 16px; padding: 24px; max-width: 500px; margin: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h2 style="color: #337418; margin-top: 0;">Nova Venda Confirmada!</h2>
    <p style="font-size: 16px; font-weight: bold; color: #0F0F0F;">Parabéns, uma nova venda na ALMAS-SHOP</p>
    <div style="background: #F8F8F8; padding: 12px; border-radius: 8px; margin: 16px 0; font-size: 13px;">
      <p style="margin: 4px 0;"><strong>Pedido:</strong> #${orderId}</p>
      <p style="margin: 4px 0;"><strong>Produto:</strong> ${productName}</p>
      <p style="margin: 4px 0;"><strong>Valor:</strong> ${totalAmount.toLocaleString()} MT</p>
      <p style="margin: 4px 0;"><strong>Cliente:</strong> ${customerName}</p>
      <p style="margin: 4px 0;"><strong>Data / Hora:</strong> ${new Date().toLocaleString('pt-MZ')}</p>
    </div>
    <p style="font-size: 12px; color: #666;">Notificação do Painel Mestre ALMAS-SHOP.</p>
  </div>
</body>
</html>
  `;
  return { subject, html };
}
