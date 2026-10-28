import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf():
    pdf_filename = "Ruchi_Bazaar_Costing_and_Earnings_Breakdown.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#ea580c")
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748b")
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        alignment=2,
        textColor=colors.HexColor("#334155")
    )

    h2_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155")
    )

    table_header_style = ParagraphStyle(
        'TH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    table_cell_style = ParagraphStyle(
        'TC',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#334155")
    )

    table_cell_bold = ParagraphStyle(
        'TCB',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # --- Header ---
    header_data = [
        [
            Paragraph("<b>Ruchi Bazaar</b>", title_style),
            Paragraph("<b>FINANCIAL COSTING REPORT</b><br/><font color='#64748b'>Operational Hub: <b>Adilabad, Telangana</b><br/>Status: <b>Verified (Production)</b></font>", meta_style)
        ],
        [
            Paragraph("Costing, Delivery Fee Slabs & Partner Earnings Schedule", subtitle_style),
            ""
        ]
    ]
    t_header = Table(header_data, colWidths=[340, 200])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#ea580c"), spaceBefore=4, spaceAfter=12))

    # --- KPI Summary Grid ---
    kpi_data = [
        [
            Paragraph("<font size='7' color='#64748b'><b>PLATFORM COMMISSION</b></font><br/><b><font size='14' color='#ea580c'>2.0%</font></b><br/><font size='7' color='#475569'>Subtotal deduction</font>", body_style),
            Paragraph("<font size='7' color='#64748b'><b>RESTAURANT SHARE</b></font><br/><b><font size='14' color='#16a34a'>98.0%</font></b><br/><font size='7' color='#475569'>Net food payout</font>", body_style),
            Paragraph("<font size='7' color='#64748b'><b>BASE DELIVERY FEE</b></font><br/><b><font size='14' color='#2563eb'>Rs. 15.00</font></b><br/><font size='7' color='#475569'>Under 5.0 km</font>", body_style),
            Paragraph("<font size='7' color='#64748b'><b>GST / TAXES</b></font><br/><b><font size='14' color='#64748b'>Rs. 0.00</font></b><br/><font size='7' color='#475569'>0% (No GST / Exempt)</font>", body_style),
        ]
    ]
    t_kpi = Table(kpi_data, colWidths=[135, 135, 135, 135])
    t_kpi.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_kpi)
    story.append(Spacer(1, 10))

    # --- Section 1: Distance-Based Delivery Schedule ---
    story.append(Paragraph("1. Distance-Based Delivery Fee Schedule", h2_style))
    story.append(Paragraph("Delivery fees are calculated strictly by transit distance. <b>100% of this collected fee is allocated directly to the delivery partner:</b>", body_style))
    story.append(Spacer(1, 6))

    delivery_table_data = [
        [
            Paragraph("Distance Slab", table_header_style),
            Paragraph("Customer Delivery Charge", table_header_style),
            Paragraph("Delivery Partner Receives", table_header_style),
            Paragraph("Pricing & Calculation Rule", table_header_style),
        ],
        [
            Paragraph("<b>&le; 5.0 km (Under 5 km)</b>", table_cell_style),
            Paragraph("<b>Rs. 15.00</b>", table_cell_bold),
            Paragraph("<font color='#1d4ed8'><b>Rs. 15.00 (100%)</b></font>", table_cell_style),
            Paragraph("Flat base fee for local town orders", table_cell_style),
        ],
        [
            Paragraph("<b>5.1 km – 6.0 km (6 km)</b>", table_cell_style),
            Paragraph("<b>Rs. 18.00</b>", table_cell_bold),
            Paragraph("<font color='#1d4ed8'><b>Rs. 18.00 (100%)</b></font>", table_cell_style),
            Paragraph("Base Rs. 15 + Rs. 3 distance increment", table_cell_style),
        ],
        [
            Paragraph("<b>6.1 km – 7.0 km (7 km)</b>", table_cell_style),
            Paragraph("<b>Rs. 21.00</b>", table_cell_bold),
            Paragraph("<font color='#1d4ed8'><b>Rs. 21.00 (100%)</b></font>", table_cell_style),
            Paragraph("Base Rs. 15 + Rs. 6 distance increment", table_cell_style),
        ],
        [
            Paragraph("<b>Beyond 7.0 km</b>", table_cell_style),
            Paragraph("<b>Rs. 21 + Rs. 3 / km</b>", table_cell_bold),
            Paragraph("<font color='#1d4ed8'><b>100% of collected fee</b></font>", table_cell_style),
            Paragraph("Rs. 3 added for every additional kilometer", table_cell_style),
        ],
    ]
    t_deliv = Table(delivery_table_data, colWidths=[130, 125, 125, 160])
    t_deliv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_deliv)
    story.append(Spacer(1, 10))

    # --- Section 2: Concrete Order Scenarios ---
    story.append(Paragraph("2. Concrete Real-World Order Scenarios", h2_style))
    story.append(Paragraph("Clear, uncompromised double-entry calculation showing how payments are split with zero leaks:", body_style))
    story.append(Spacer(1, 6))

    scenarios_data = [
        [
            Paragraph("Metric / Component", table_header_style),
            Paragraph("Scenario A: Under 5 km<br/><font size='7' color='#64748b'>Dist: 3.5 km | Food: Rs. 200</font>", table_header_style),
            Paragraph("Scenario B: At 6 km<br/><font size='7' color='#64748b'>Dist: 6.0 km | Food: Rs. 500</font>", table_header_style),
            Paragraph("Scenario C: At 7 km + Coupon<br/><font size='7' color='#64748b'>Dist: 7.0 km | Food: Rs. 1000</font>", table_header_style),
        ],
        [
            Paragraph("Food Subtotal", table_cell_style),
            Paragraph("Rs. 200.00", table_cell_style),
            Paragraph("Rs. 500.00", table_cell_style),
            Paragraph("Rs. 1,000.00", table_cell_style),
        ],
        [
            Paragraph("Promo Discount", table_cell_style),
            Paragraph("Rs. 0.00", table_cell_style),
            Paragraph("Rs. 0.00", table_cell_style),
            Paragraph("<font color='#dc2626'>- Rs. 50.00</font>", table_cell_style),
        ],
        [
            Paragraph("GST Tax Liability", table_cell_style),
            Paragraph("Rs. 0.00 (0%)", table_cell_style),
            Paragraph("Rs. 0.00 (0%)", table_cell_style),
            Paragraph("Rs. 0.00 (0%)", table_cell_style),
        ],
        [
            Paragraph("Delivery Fee", table_cell_style),
            Paragraph("Rs. 15.00 (&le; 5km)", table_cell_style),
            Paragraph("Rs. 18.00 (6km)", table_cell_style),
            Paragraph("Rs. 21.00 (7km)", table_cell_style),
        ],
        [
            Paragraph("<b>TOTAL CHARGED TO CUSTOMER</b>", table_cell_bold),
            Paragraph("<b>Rs. 215.00</b>", table_cell_bold),
            Paragraph("<b>Rs. 518.00</b>", table_cell_bold),
            Paragraph("<b>Rs. 971.00</b>", table_cell_bold),
        ],
        [
            Paragraph("<b>🧑‍🍳 Restaurant Net Earning (98%)</b>", table_cell_style),
            Paragraph("<font color='#15803d'><b>Rs. 196.00</b></font><br/><font size='6.5' color='#64748b'>Rs. 200 - Rs. 4 comm.</font>", table_cell_style),
            Paragraph("<font color='#15803d'><b>Rs. 490.00</b></font><br/><font size='6.5' color='#64748b'>Rs. 500 - Rs. 10 comm.</font>", table_cell_style),
            Paragraph("<font color='#15803d'><b>Rs. 930.00</b></font><br/><font size='6.5' color='#64748b'>Rs. 1000 - Rs. 20 - Rs. 50</font>", table_cell_style),
        ],
        [
            Paragraph("<b>🚚 Delivery Partner Earning (100%)</b>", table_cell_style),
            Paragraph("<font color='#1d4ed8'><b>Rs. 15.00</b></font>", table_cell_style),
            Paragraph("<font color='#1d4ed8'><b>Rs. 18.00</b></font>", table_cell_style),
            Paragraph("<font color='#1d4ed8'><b>Rs. 21.00</b></font>", table_cell_style),
        ],
        [
            Paragraph("<b>🏢 Platform Keeps (2.0%)</b>", table_cell_style),
            Paragraph("<font color='#ea580c'><b>Rs. 4.00</b></font>", table_cell_style),
            Paragraph("<font color='#ea580c'><b>Rs. 10.00</b></font>", table_cell_style),
            Paragraph("<font color='#ea580c'><b>Rs. 20.00</b></font>", table_cell_style),
        ],
        [
            Paragraph("<b>Reconciliation Audit Check</b>", table_cell_style),
            Paragraph("<font color='#047857'><b>Balanced (Rs. 215)</b></font>", table_cell_style),
            Paragraph("<font color='#047857'><b>Balanced (Rs. 518)</b></font>", table_cell_style),
            Paragraph("<font color='#047857'><b>Balanced (Rs. 971)</b></font>", table_cell_style),
        ]
    ]

    t_scenarios = Table(scenarios_data, colWidths=[150, 130, 130, 130])
    t_scenarios.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,5), (-1,5), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0,6), (-1,6), colors.HexColor("#f0fdf4")),
        ('BACKGROUND', (0,7), (-1,7), colors.HexColor("#eff6ff")),
        ('BACKGROUND', (0,8), (-1,8), colors.HexColor("#fff7ed")),
        ('BACKGROUND', (0,9), (-1,9), colors.HexColor("#ecfdf5")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_scenarios)
    story.append(Spacer(1, 10))

    # --- Section 3: Settlement & Operational Guarantees ---
    story.append(Paragraph("3. Partner Settlement & Compliance Guarantees", h2_style))
    story.append(Paragraph(
        "&bull; <b>Zero Delivery Shortfall:</b> 100% of customer delivery fees are paid to the delivery partner.<br/>"
        "&bull; <b>Restaurant Self-Service Withdrawals:</b> Restaurants can withdraw their available balance anytime once it reaches Rs. 100.<br/>"
        "&bull; <b>Mandatory UTR Verification:</b> Payouts cannot be marked 'Paid' on the admin dashboard without an authenticated Bank UTR transfer number.<br/>"
        "&bull; <b>Cancellation Protection:</b> If an order is cancelled or refunded, accrued earnings are automatically cancelled to protect platform capital.",
        body_style
    ))
    story.append(Spacer(1, 14))

    # --- Footer ---
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e2e8f0"), spaceBefore=4, spaceAfter=8))
    footer_text = Table([
        [
            Paragraph("Ruchi Bazaar &bull; Operations, FinTech & Reconciliation Division", subtitle_style),
            Paragraph("Strictly Reconciled &bull; Confidential &bull; System Verified", meta_style)
        ]
    ], colWidths=[340, 200])
    footer_text.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(footer_text)

    doc.build(story)
    print(f"PDF generated successfully: {pdf_filename}")

if __name__ == '__main__':
    generate_pdf()
