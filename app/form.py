"""
form.py - Pedido de orçamento (Amiraldo Rodrigues | Desenvolvimento Web & Soluções Digitais)

O que faz, automaticamente:
  1. Mostra um formulário com os serviços do catálogo e uma estimativa em tempo real.
  2. Ao submeter, recalcula a estimativa NO SERVIDOR (não confia no navegador).
  3. Gera um PDF simples com o resumo do projeto e a estimativa.
  4. Envia-te um email (Resend) com os dados do cliente + PDF em anexo.
  5. Envia ao cliente um email a confirmar o pedido e a avisar que há resposta em 48h.

Instalação:
    pip install flask reportlab resend

Variáveis de ambiente:
    RESEND_API_KEY   chave da API do Resend (obrigatória)
    MAIL_FROM        remetente com domínio verificado no Resend,
                     ex.: "Amiraldo Rodrigues <orcamentos@teudominio.pt>"
    OWNER_EMAIL      o teu email, onde recebes os pedidos
    PRICE_ADJUST_PCT ajuste global opcional, em %. Ex.: -10 (desconto) ou 15 (acréscimo). Por defeito 0.
    SECRET_KEY       chave secreta do Flask (para o token CSRF)

Uso na tua app Flask:
    from form import orcamento_bp
    app.register_blueprint(orcamento_bp)         # formulário em /orcamento

Para testar sozinho:   python form.py
"""

import html
import io
import logging
import os
import re
import secrets
import time
from datetime import datetime
from xml.sax.saxutils import escape as xml_escape

import resend
from flask import Blueprint, Flask, render_template, render_template_string, request, session
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

log = logging.getLogger(__name__)

orcamento_bp = Blueprint("orcamento", __name__)

# ---------------------------------------------------------------------------
# CONFIGURAÇÃO
# ---------------------------------------------------------------------------
NOME_NEGOCIO = "Amiraldo Rodrigues | Desenvolvimento Web & Soluções Digitais"
PRAZO_RESPOSTA = "48 horas"

# Ajuste global (promoções, clientes especiais, etc.). Ex.: -10 => 10% de desconto em tudo.
AJUSTE_PERCENTUAL = float(os.environ.get("PRICE_ADJUST_PCT", "0"))

# Anti-spam simples: máximo de pedidos por IP numa janela de tempo.
MAX_PEDIDOS_POR_IP = 5
JANELA_SEGUNDOS = 3600
_historico_ips: dict[str, list[float]] = {}

# ---------------------------------------------------------------------------
# CATÁLOGO  (editável: muda aqui os preços/serviços)
#   tipo: "fixo"      -> preço fechado
#         "desde"     -> "a partir de" (pode subir conforme complexidade)
#         "orcamento" -> sem preço, definido na proposta
#         "mensal"    -> valor mensal recorrente
# ---------------------------------------------------------------------------
CATALOGO = {
    # --- Websites e presença digital (escolher UM) ---
    "1.1": {"grupo": "pagina", "nome": "Landing Page Essencial", "preco": 350, "tipo": "fixo",
            "desc": "Página única focada numa ação (contactar, orçamento, reserva)."},
    "1.2": {"grupo": "pagina", "nome": "Landing Page Profissional", "preco": 500, "tipo": "fixo",
            "desc": "Página de campanha completa, com FAQ, processo e testemunhos."},
    "1.3": {"grupo": "pagina", "nome": "Landing Page Premium", "preco": 750, "tipo": "fixo",
            "desc": "Design personalizado, animações discretas e integrações."},
    "1.4": {"grupo": "pagina", "nome": "Website Essencial", "preco": 650, "tipo": "fixo",
            "desc": "Website institucional simples: empresa, serviços e contactos."},
    "1.5": {"grupo": "pagina", "nome": "Website Profissional", "preco": 950, "tipo": "fixo",
            "desc": "Várias páginas, portfólio, FAQ, formulários e SEO técnico inicial."},
    "1.6": {"grupo": "pagina", "nome": "Website Business", "preco": 1450, "tipo": "fixo",
            "desc": "Presença abrangente, componentes personalizados e integrações."},
    "1.7": {"grupo": "pagina", "nome": "Website personalizado", "preco": 1900, "tipo": "desde",
            "desc": "Feito à medida quando não se enquadra nos pacotes standard."},
    # --- Sistemas e aplicações web (escolher VÁRIOS) ---
    "2.1": {"grupo": "sistema", "nome": "Sistema de agendamento", "preco": 650, "tipo": "desde",
            "desc": "Marcações online com calendário, horários e gestão."},
    "2.2": {"grupo": "sistema", "nome": "Painel administrativo", "preco": 450, "tipo": "desde",
            "desc": "Área privada para gerir informação sem mexer em código."},
    "2.3": {"grupo": "sistema", "nome": "Aplicação web personalizada", "preco": 1500, "tipo": "desde",
            "desc": "Software no navegador para gerir processos e automatizar tarefas."},
    # --- Serviços adicionais, SEO e marketing (escolher VÁRIOS) ---
    "3.1": {"grupo": "extra", "nome": "SEO inicial", "preco": 120, "tipo": "fixo",
            "desc": "Títulos, descrições, cabeçalhos, URLs e recomendações técnicas."},
    "3.2": {"grupo": "extra", "nome": "Otimização de velocidade", "preco": 100, "tipo": "fixo",
            "desc": "Análise e melhoria do tempo de carregamento."},
    "3.3": {"grupo": "extra", "nome": "Configuração do Google Analytics", "preco": 60, "tipo": "fixo",
            "desc": "Medição de visitas e interações."},
    "3.4": {"grupo": "extra", "nome": "Google Search Console", "preco": 45, "tipo": "fixo",
            "desc": "Acompanhamento da presença na Pesquisa Google."},
    "3.5": {"grupo": "extra", "nome": "Perfil de Empresa Google (Google Meu Negócio)", "preco": 75, "tipo": "fixo",
            "desc": "Perfil na Pesquisa Google e no Google Maps."},
    "3.6": {"grupo": "extra", "nome": "Google Ads", "preco": None, "tipo": "orcamento",
            "desc": "Publicidade paga na Google (investimento em anúncios pago pelo cliente)."},
    "3.7": {"grupo": "extra", "nome": "Meta Ads (Facebook e Instagram)", "preco": None, "tipo": "orcamento",
            "desc": "Publicidade paga em Facebook/Instagram (investimento pago pelo cliente)."},
    # --- Manutenção e suporte (escolher UM) ---
    "4.1": {"grupo": "manutencao", "nome": "Plano Basic", "preco": 39, "tipo": "mensal",
            "desc": "Acompanhamento essencial para websites com poucas alterações."},
    "4.2": {"grupo": "manutencao", "nome": "Plano Professional", "preco": 69, "tipo": "mensal",
            "desc": "Apoio regular e mais margem para alterações de conteúdo."},
    "4.3": {"grupo": "manutencao", "nome": "Plano Premium", "preco": 119, "tipo": "mensal",
            "desc": "Acompanhamento prioritário e maior volume de intervenções."},
}

PRAZOS = ["Sem urgência", "Até 2 meses", "Até 1 mês", "Urgente (2 semanas ou menos)"]

# Pagamento por defeito (catálogo, secção 6)
PLANO_PAGAMENTO = [("Na adjudicação", 0.40), ("Após aprovação intermédia", 0.40), ("Antes da entrega/publicação", 0.20)]


# ---------------------------------------------------------------------------
# CÁLCULO DA ESTIMATIVA
# ---------------------------------------------------------------------------
def preco_ajustado(preco):
    if preco is None:
        return None
    return round(preco * (1 + AJUSTE_PERCENTUAL / 100))


def eur(valor):
    """Formata em euros ao estilo português: 1.450 €"""
    return f"{valor:,.0f}".replace(",", ".") + " €"


def calcular(pagina, sistemas, extras, manutencao):
    """Recebe os ids escolhidos e devolve linhas + totais (sempre validado contra o catálogo)."""
    ids = []
    if pagina in CATALOGO and CATALOGO[pagina]["grupo"] == "pagina":
        ids.append(pagina)
    ids += [i for i in sistemas if i in CATALOGO and CATALOGO[i]["grupo"] == "sistema"]
    ids += [i for i in extras if i in CATALOGO and CATALOGO[i]["grupo"] == "extra"]
    if manutencao in CATALOGO and CATALOGO[manutencao]["grupo"] == "manutencao":
        ids.append(manutencao)

    linhas, total_unico, total_mensal = [], 0, 0
    tem_desde = tem_orcamento = False
    for i in ids:
        item = CATALOGO[i]
        preco = preco_ajustado(item["preco"])
        linhas.append({"id": i, "nome": item["nome"], "tipo": item["tipo"], "preco": preco})
        if item["tipo"] == "mensal":
            total_mensal += preco
        elif item["tipo"] == "orcamento":
            tem_orcamento = True
        else:
            total_unico += preco
            tem_desde = tem_desde or item["tipo"] == "desde"

    return {
        "linhas": linhas,
        "total_unico": total_unico,
        "total_mensal": total_mensal,
        "tem_desde": tem_desde,
        "tem_orcamento": tem_orcamento,
    }


def texto_preco(linha):
    if linha["tipo"] == "orcamento":
        return "Sob orçamento"
    if linha["tipo"] == "desde":
        return f"desde {eur(linha['preco'])}"
    if linha["tipo"] == "mensal":
        return f"{eur(linha['preco'])}/mês"
    return eur(linha["preco"])


def texto_total(calc):
    if calc["total_unico"] == 0 and not calc["total_mensal"]:
        return "A definir em proposta"
    partes = []
    if calc["total_unico"]:
        prefixo = "a partir de " if calc["tem_desde"] else ""
        partes.append(prefixo + eur(calc["total_unico"]))
    elif calc["tem_orcamento"]:
        partes.append("A definir em proposta")
    if calc["total_mensal"]:
        partes.append(f"+ {eur(calc['total_mensal'])}/mês de manutenção")
    return " ".join(partes)


# ---------------------------------------------------------------------------
# PDF
# ---------------------------------------------------------------------------
AZUL = colors.HexColor("#1F3A5F")
CINZA = colors.HexColor("#F2F4F7")


def gerar_pdf(dados, calc, referencia):
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf, pagesize=A4, leftMargin=2 * cm, rightMargin=2 * cm, topMargin=1.8 * cm, bottomMargin=2 * cm,
        title=f"Pedido de orçamento {referencia}", author=NOME_NEGOCIO,
    )
    ss = getSampleStyleSheet()
    titulo = ParagraphStyle("t", parent=ss["Title"], textColor=AZUL, fontSize=20, spaceAfter=2)
    sub = ParagraphStyle("s", parent=ss["Normal"], textColor=colors.grey, alignment=TA_CENTER, fontSize=9)
    h = ParagraphStyle("h", parent=ss["Heading2"], textColor=AZUL, fontSize=12, spaceBefore=14, spaceAfter=6)
    normal = ParagraphStyle("n", parent=ss["Normal"], fontSize=9.5, leading=13)
    peq = ParagraphStyle("p", parent=normal, fontSize=8, textColor=colors.grey, leading=11)

    def P(texto, estilo=normal):
        return Paragraph(xml_escape(str(texto or "—")).replace("\n", "<br/>"), estilo)

    story = [
        Paragraph("Pedido de orçamento", titulo),
        Paragraph(xml_escape(NOME_NEGOCIO), sub),
        Paragraph(f"Ref. {referencia} · {datetime.now().strftime('%d/%m/%Y %H:%M')}", sub),
        Spacer(1, 8),
    ]

    # --- Cliente
    story.append(Paragraph("Dados do cliente", h))
    t = Table(
        [
            [P("Nome"), P(dados["nome"])],
            [P("Email"), P(dados["email"])],
            [P("Telefone"), P(dados["telefone"])],
            [P("Empresa"), P(dados["empresa"])],
            [P("Website atual"), P(dados["site_atual"])],
        ],
        colWidths=[4 * cm, 13 * cm],
    )
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), CINZA), ("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(t)

    # --- Projeto
    story.append(Paragraph("Projeto pretendido", h))
    story.append(Table(
        [[P("Prazo desejado"), P(dados["prazo"])], [P("Orçamento do cliente"), P(dados["orcamento_cliente"])]],
        colWidths=[4 * cm, 13 * cm],
        style=TableStyle([("BACKGROUND", (0, 0), (0, -1), CINZA), ("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey)]),
    ))
    story.append(Spacer(1, 6))
    story.append(P(dados["descricao"] or "Sem descrição adicional."))

    # --- Estimativa
    story.append(Paragraph("Estimativa de custos (valores de referência)", h))
    if calc["linhas"]:
        cab = ParagraphStyle("c", parent=normal, textColor=colors.white)
        dados_tab = [[Paragraph("Serviço", cab), Paragraph("Tipo", cab), Paragraph("Valor", cab)]]
        nomes_tipo = {"fixo": "Pontual", "desde": "Pontual (a partir de)", "orcamento": "Sob orçamento", "mensal": "Mensal"}
        for l in calc["linhas"]:
            dados_tab.append([P(f"{l['id']} {l['nome']}"), P(nomes_tipo[l["tipo"]]), P(texto_preco(l))])
        dados_tab.append([Paragraph("<b>Total</b>", normal), "", P(texto_total(calc))])
        tab = Table(dados_tab, colWidths=[8.2 * cm, 3.8 * cm, 5 * cm], repeatRows=1)
        tab.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), AZUL), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BACKGROUND", (0, -1), (-1, -1), CINZA), ("SPAN", (0, -1), (1, -1)),
        ]))
        story.append(tab)

        if calc["total_unico"]:
            story.append(Spacer(1, 8))
            story.append(Paragraph("Condições de pagamento habituais (ajustáveis na proposta)", h))
            pag = [[P(n), P(f"{int(p * 100)}%"), P(eur(calc["total_unico"] * p))] for n, p in PLANO_PAGAMENTO]
            tp = Table(pag, colWidths=[8.2 * cm, 3.8 * cm, 5 * cm])
            tp.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.4, colors.lightgrey)]))
            story.append(tp)
    else:
        story.append(P("Nenhum serviço do catálogo selecionado. O âmbito será definido em conversa com o cliente."))

    story.append(Spacer(1, 14))
    story.append(Paragraph(
        "Este documento é uma estimativa informativa e não constitui proposta vinculativa. "
        "O âmbito, entregáveis, prazo, preço e condições finais serão definidos numa proposta individual, "
        "podendo ser ajustados às necessidades do cliente. IVA não incluído quando aplicável. "
        "Domínio, alojamento, licenças e investimento em anúncios são custos de terceiros, pagos pelo cliente.",
        peq,
    ))

    def rodape(canvas, d):
        canvas.saveState()
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(colors.grey)
        canvas.drawString(2 * cm, 1.1 * cm, NOME_NEGOCIO)
        canvas.drawRightString(A4[0] - 2 * cm, 1.1 * cm, f"Página {d.page}")
        canvas.restoreState()

    doc.build(story, onFirstPage=rodape, onLaterPages=rodape)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# EMAILS (Resend)
# ---------------------------------------------------------------------------
def _linhas_html(calc):
    if not calc["linhas"]:
        return "<p><em>Nenhum serviço do catálogo selecionado.</em></p>"
    li = "".join(
        f"<li>{html.escape(l['id'])} {html.escape(l['nome'])} — {html.escape(texto_preco(l))}</li>"
        for l in calc["linhas"]
    )
    return f"<ul>{li}</ul><p><strong>Estimativa:</strong> {html.escape(texto_total(calc))}</p>"


def enviar_emails(dados, calc, pdf_bytes, referencia):
    resend.api_key = os.environ["RESEND_API_KEY"]
    remetente = os.environ["MAIL_FROM"]
    dono = os.environ["OWNER_EMAIL"]
    e = {k: html.escape(v or "—") for k, v in dados.items()}

    # 1) Para ti: dados do cliente + PDF
    corpo_dono = f"""
    <h2>Novo pedido de orçamento — {referencia}</h2>
    <p><strong>Nome:</strong> {e['nome']}<br>
       <strong>Email:</strong> {e['email']}<br>
       <strong>Telefone:</strong> {e['telefone']}<br>
       <strong>Empresa:</strong> {e['empresa']}<br>
       <strong>Website atual:</strong> {e['site_atual']}<br>
       <strong>Prazo:</strong> {e['prazo']}<br>
       <strong>Orçamento do cliente:</strong> {e['orcamento_cliente']}</p>
    <h3>Serviços e estimativa</h3>{_linhas_html(calc)}
    <h3>Descrição do projeto</h3><p>{e['descricao'].replace(chr(10), '<br>')}</p>
    <p style="color:#666">Compromisso: responder em {PRAZO_RESPOSTA}. Podes responder diretamente a este email.</p>
    """
    resend.Emails.send({
        "from": remetente,
        "to": [dono],
        "reply_to": dados["email"],
        "subject": f"Novo pedido de orçamento — {dados['nome']} ({referencia})",
        "html": corpo_dono,
        "attachments": [{"filename": f"orcamento-{referencia}.pdf", "content": list(pdf_bytes)}],
    })

    # 2) Para o cliente: aviso de receção (falha aqui não deve anular o pedido)
    corpo_cliente = f"""
    <p>Olá {e['nome']},</p>
    <p>Recebemos o seu pedido de orçamento (ref. <strong>{referencia}</strong>). Obrigado pelo contacto!</p>
    <p>Vamos analisar o seu projeto e <strong>entraremos em contacto num prazo de {PRAZO_RESPOSTA}</strong>
       para confirmar o âmbito e apresentar uma proposta ajustada às suas necessidades.</p>
    <h3>Resumo do que indicou</h3>{_linhas_html(calc)}
    <p style="color:#666;font-size:13px">Os valores são estimativas de referência, não vinculativas, e podem ser
       ajustados na proposta final.</p>
    <p>Cumprimentos,<br>Amiraldo Rodrigues<br>Desenvolvimento Web &amp; Soluções Digitais</p>
    """
    try:
        resend.Emails.send({
            "from": remetente,
            "to": [dados["email"]],
            "reply_to": dono,
            "subject": "Recebemos o seu pedido de orçamento",
            "html": corpo_cliente,
        })
    except Exception:
        log.exception("Falha ao enviar confirmação ao cliente %s", dados["email"])


# ---------------------------------------------------------------------------
# VALIDAÇÃO / SEGURANÇA
# ---------------------------------------------------------------------------
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")


def _limite_excedido(ip):
    agora = time.time()
    registos = [t for t in _historico_ips.get(ip, []) if agora - t < JANELA_SEGUNDOS]
    _historico_ips[ip] = registos
    return len(registos) >= MAX_PEDIDOS_POR_IP


def _csrf_token():
    if "csrf" not in session:
        session["csrf"] = secrets.token_hex(16)
    return session["csrf"]


def _recolher_dados():
    g = lambda k, n=200: (request.form.get(k) or "").strip()[:n]
    return {
        "nome": g("nome", 120), "email": g("email", 160), "telefone": g("telefone", 40),
        "empresa": g("empresa", 120), "site_atual": g("site_atual", 200),
        "prazo": g("prazo", 60), "orcamento_cliente": g("orcamento_cliente", 60),
        "descricao": g("descricao", 3000),
    }


# ---------------------------------------------------------------------------
# TEMPLATES (podes passá-los para ficheiros .html e estender o teu base.html)
# ---------------------------------------------------------------------------
TEMPLATE_FORM = """<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pedido de orçamento</title>
<style>
 :root{--az:#1F3A5F;--bg:#f5f7fa;--bd:#d9dee5}
 *{box-sizing:border-box} body{font-family:system-ui,Arial,sans-serif;background:var(--bg);margin:0;color:#222}
 .wrap{max-width:860px;margin:0 auto;padding:24px 16px 120px}
 h1{color:var(--az);margin-bottom:4px} .lead{color:#555;margin-top:0}
 fieldset{background:#fff;border:1px solid var(--bd);border-radius:10px;margin:18px 0;padding:16px}
 legend{font-weight:700;color:var(--az);padding:0 8px}
 label.f{display:block;font-size:14px;margin:10px 0 4px}
 input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;padding:10px;border:1px solid var(--bd);border-radius:8px;font:inherit}
 .grid{display:grid;grid-template-columns:1fr 1fr;gap:0 16px} @media(max-width:640px){.grid{grid-template-columns:1fr}}
 .op{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--bd);border-radius:8px;margin:8px 0;cursor:pointer}
 .op:hover{border-color:var(--az)} .op small{color:#666;display:block} .op b{flex:1}
 .pr{white-space:nowrap;color:var(--az);font-weight:600}
 .err{background:#fde8e8;border:1px solid #f5b5b5;color:#8a1f1f;padding:10px 14px;border-radius:8px;margin:12px 0}
 .hp{position:absolute;left:-9999px}
 .bar{position:fixed;left:0;right:0;bottom:0;background:#fff;border-top:2px solid var(--az);padding:12px 16px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
 .bar .tot{font-size:15px} .bar .tot strong{font-size:18px;color:var(--az)}
 button{background:var(--az);color:#fff;border:0;border-radius:8px;padding:12px 22px;font-size:16px;cursor:pointer}
 button:disabled{opacity:.6}
 .nota{font-size:12.5px;color:#666}
</style></head><body><div class="wrap">
<h1>Pedido de orçamento</h1>
<p class="lead">Escolha o que pretende e veja uma estimativa. Tudo é ajustável: responderemos em {{ prazo_resp }} com uma proposta à medida.</p>
{% for e in erros %}<div class="err">{{ e }}</div>{% endfor %}

<form method="post" action="{{ url_for('orcamento.orcamento') }}" id="frm">
<input type="hidden" name="csrf" value="{{ csrf }}">
<input class="hp" type="text" name="contacto_extra" tabindex="-1" autocomplete="off" aria-hidden="true">

<fieldset><legend>Os seus dados</legend>
 <div class="grid">
  <div><label class="f">Nome *</label><input type="text" name="nome" required value="{{ v.nome }}"></div>
  <div><label class="f">Email *</label><input type="email" name="email" required value="{{ v.email }}"></div>
  <div><label class="f">Telefone</label><input type="tel" name="telefone" value="{{ v.telefone }}"></div>
  <div><label class="f">Empresa / negócio</label><input type="text" name="empresa" value="{{ v.empresa }}"></div>
 </div>
 <label class="f">Website atual (se existir)</label><input type="text" name="site_atual" value="{{ v.site_atual }}">
</fieldset>

<fieldset><legend>1. Website ou landing page (escolha uma opção)</legend>
 <label class="op"><input type="radio" name="pagina" value="" data-id="" {{ 'checked' if not sel.pagina }}><b>Não preciso / ainda não sei</b></label>
 {% for id, i in grupos.pagina %}
 <label class="op"><input type="radio" name="pagina" value="{{ id }}" data-id="{{ id }}" {{ 'checked' if sel.pagina == id }}>
  <b>{{ i.nome }}<small>{{ i.desc }}</small></b><span class="pr">{{ i.rotulo }}</span></label>
 {% endfor %}
</fieldset>

<fieldset><legend>2. Sistemas e aplicações web</legend>
 {% for id, i in grupos.sistema %}
 <label class="op"><input type="checkbox" name="sistemas" value="{{ id }}" data-id="{{ id }}" {{ 'checked' if id in sel.sistemas }}>
  <b>{{ i.nome }}<small>{{ i.desc }}</small></b><span class="pr">{{ i.rotulo }}</span></label>
 {% endfor %}
</fieldset>

<fieldset><legend>3. Serviços adicionais, SEO e marketing</legend>
 {% for id, i in grupos.extra %}
 <label class="op"><input type="checkbox" name="extras" value="{{ id }}" data-id="{{ id }}" {{ 'checked' if id in sel.extras }}>
  <b>{{ i.nome }}<small>{{ i.desc }}</small></b><span class="pr">{{ i.rotulo }}</span></label>
 {% endfor %}
</fieldset>

<fieldset><legend>4. Manutenção e suporte mensal (opcional)</legend>
 <label class="op"><input type="radio" name="manutencao" value="" data-id="" {{ 'checked' if not sel.manutencao }}><b>Sem manutenção</b></label>
 {% for id, i in grupos.manutencao %}
 <label class="op"><input type="radio" name="manutencao" value="{{ id }}" data-id="{{ id }}" {{ 'checked' if sel.manutencao == id }}>
  <b>{{ i.nome }}<small>{{ i.desc }}</small></b><span class="pr">{{ i.rotulo }}</span></label>
 {% endfor %}
</fieldset>

<fieldset><legend>Sobre o projeto</legend>
 <div class="grid">
  <div><label class="f">Prazo desejado</label>
   <select name="prazo">{% for p in prazos %}<option {{ 'selected' if v.prazo == p }}>{{ p }}</option>{% endfor %}</select></div>
  <div><label class="f">Orçamento aproximado (opcional)</label><input type="text" name="orcamento_cliente" placeholder="ex.: 800 €" value="{{ v.orcamento_cliente }}"></div>
 </div>
 <label class="f">Descreva o que pretende, o seu objetivo e o que o seu negócio faz</label>
 <textarea name="descricao" rows="6">{{ v.descricao }}</textarea>
 <label class="op" style="margin-top:14px"><input type="checkbox" name="consentimento" value="1" required>
  <b style="font-weight:400">Autorizo o tratamento dos meus dados para efeitos de resposta a este pedido de orçamento. *</b></label>
</fieldset>

<div class="bar">
 <div class="tot">Estimativa: <strong id="total">—</strong><div class="nota" id="nota">Valores de referência, sem compromisso. IVA não incluído quando aplicável.</div></div>
 <button type="submit" id="btn">Pedir orçamento</button>
</div>
</form>

<script>
const CAT = {{ catalogo|tojson }}; const ADJ = {{ ajuste }};
const eur = v => v.toLocaleString('pt-PT',{maximumFractionDigits:0}) + ' €';
function calc(){
  let uni=0, men=0, desde=false, orc=false, n=0;
  document.querySelectorAll('#frm input[data-id]:checked').forEach(el=>{
    const it = CAT[el.dataset.id]; if(!it) return; n++;
    if(it.tipo==='orcamento'){orc=true; return;}
    const p = Math.round(it.preco*(1+ADJ/100));
    if(it.tipo==='mensal') men+=p; else {uni+=p; if(it.tipo==='desde') desde=true;}
  });
  let t = [];
  if(uni) t.push((desde?'a partir de ':'')+eur(uni));
  if(men) t.push((uni?'+ ':'')+eur(men)+'/mês');
  if(!t.length) t.push(n? 'A definir em proposta' : '—');
  if(orc && uni) t.push('(+ anúncios sob orçamento)');
  document.getElementById('total').textContent = t.join(' ');
}
document.getElementById('frm').addEventListener('change', calc); calc();
document.getElementById('frm').addEventListener('submit', ()=>{const b=document.getElementById('btn'); b.disabled=true; b.textContent='A enviar…';});
</script>
</div></body></html>"""

TEMPLATE_OBRIGADO = """<!doctype html>
<html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pedido recebido</title>
<style>body{font-family:system-ui,Arial,sans-serif;background:#f5f7fa;color:#222;display:grid;place-items:center;min-height:100vh;margin:0}
.c{background:#fff;border:1px solid #d9dee5;border-radius:12px;padding:32px;max-width:520px;margin:16px;text-align:center}
h1{color:#1F3A5F}</style></head><body><div class="c">
<h1>Pedido recebido ✔</h1>
<p>Obrigado, {{ nome }}! Referência <strong>{{ ref }}</strong>.</p>
<p>Enviámos um email de confirmação para <strong>{{ email }}</strong>. Entraremos em contacto num prazo de <strong>{{ prazo }}</strong>.</p>
<p style="font-size:13px;color:#666">Não encontra o email? Verifique a pasta de spam.</p>
</div></body></html>"""


def _contexto_form(valores=None, selecao=None, erros=None):
    grupos = {"pagina": [], "sistema": [], "extra": [], "manutencao": []}
    for id_, item in CATALOGO.items():
        linha = {"id": id_, "tipo": item["tipo"], "preco": preco_ajustado(item["preco"])}
        copia = dict(item, rotulo=texto_preco(linha))
        grupos[item["grupo"]].append((id_, copia))
    publico = {i: {"tipo": c["tipo"], "preco": c["preco"]} for i, c in CATALOGO.items()}
    vazio = {k: "" for k in ("nome", "email", "telefone", "empresa", "site_atual", "prazo", "orcamento_cliente", "descricao")}
    return dict(
        grupos=grupos, catalogo=publico, ajuste=AJUSTE_PERCENTUAL, prazos=PRAZOS, prazo_resp=PRAZO_RESPOSTA,
        csrf=_csrf_token(), erros=erros or [], v=valores or vazio,
        sel=selecao or {"pagina": "", "sistemas": [], "extras": [], "manutencao": ""},
    )


# ---------------------------------------------------------------------------
# ROTA
# ---------------------------------------------------------------------------
@orcamento_bp.route("/orcamento", methods=["GET", "POST"])
def orcamento():
    if request.method == "GET":
        return render_template("orcamento.html", **_contexto_form())

    dados = _recolher_dados()
    selecao = {
        "pagina": request.form.get("pagina", ""),
        "sistemas": request.form.getlist("sistemas"),
        "extras": request.form.getlist("extras"),
        "manutencao": request.form.get("manutencao", ""),
    }

    # Honeypot: bots preenchem este campo escondido -> fingimos sucesso e ignoramos.
    if request.form.get("contacto_extra"):
        return render_template('obrigado.html', nome=dados["nome"], email=dados["email"], ref=referencia, prazo=PRAZO_RESPOSTA)

    erros = []
    token = request.form.get("csrf", "")
    if not token or not secrets.compare_digest(token, session.get("csrf", "")):
        erros.append("A sessão expirou. Volte a enviar o formulário.")
    if len(dados["nome"]) < 2:
        erros.append("Indique o seu nome.")
    if not EMAIL_RE.match(dados["email"]):
        erros.append("Indique um email válido.")
    if not request.form.get("consentimento"):
        erros.append("É necessário autorizar o tratamento dos dados.")

    calc = calcular(selecao["pagina"], selecao["sistemas"], selecao["extras"], selecao["manutencao"])
    if not calc["linhas"] and len(dados["descricao"]) < 10:
        erros.append("Selecione pelo menos um serviço ou descreva o que pretende.")

    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "?").split(",")[0].strip()
    if not erros and _limite_excedido(ip):
        erros.append("Demasiados pedidos deste endereço. Tente mais tarde.")

    if erros:
        return render_template("orcamento.html", **_contexto_form(dados, selecao, erros)), 400

    referencia = datetime.now().strftime("%Y%m%d") + "-" + secrets.token_hex(2).upper()
    try:
        pdf = gerar_pdf(dados, calc, referencia)
        enviar_emails(dados, calc, pdf, referencia)
    except Exception:
        log.exception("Falha ao processar pedido de orçamento %s", referencia)
        erros.append("Não foi possível enviar o pedido neste momento. Tente novamente dentro de instantes.")
        return render_template("orcamento.html", **_contexto_form(dados, selecao, erros)), 500

    _historico_ips.setdefault(ip, []).append(time.time())
    session.pop("csrf", None)
    return render_template_string(
        TEMPLATE_OBRIGADO, nome=dados["nome"], email=dados["email"], ref=referencia, prazo=PRAZO_RESPOSTA
    )


# ---------------------------------------------------------------------------
# Execução isolada para testes:  python form.py  ->  http://127.0.0.1:5000/orcamento
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    app = Flask(__name__)
    app.secret_key = os.environ.get("SECRET_KEY", "dev-troca-isto")
    app.register_blueprint(orcamento_bp)
    app.run(debug=True)
