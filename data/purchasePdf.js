const PDFDocument = require("pdfkit");
const path = require("path");

const normalFont = path.join(__dirname, "../font/tahoma.ttf");
const boldFont = path.join(__dirname, "../font/tahoma.ttf");

function rtl(text) {
    if (text === null || text === undefined) {
        return '';
    }

    return String(text)
        .split(' ')
        .join('\u00A0');
}

function generatePurchasesPdf(purchase, items, res) {
    const doc = new PDFDocument({
        margin: 40,
        size: 'A4'
    });

    doc.pipe(res);

    // =========================
    // Title
    // =========================

    doc
        .font(boldFont)
        .fontSize(20)
        .text(rtl('فاکتور خرید'), {
            align: 'center'
        });

    doc.moveDown();

    // =========================
    // Purchase info
    // =========================

    doc
        .font(normalFont)
        .fontSize(10)
        .text(
            rtl(`شماره خرید: ${purchase.id}`),
            {
                align: 'right'
            }
        );

    doc
        .text(
            `${purchase.date}`,
            {
                align: 'right'
            }
        );

    doc.moveDown(2);

    // =========================
    // Table
    // =========================

    const startX = 40;
    let y = doc.y;

    const columns = [
        {
            title: 'شناسه',
            x: startX,
            width: 45
        },
        {
            title: 'نام کالا',
            x: startX + 45,
            width: 150
        },
        {
            title: 'قیمت',
            x: startX + 195,
            width: 90
        },
        {
            title: 'قیمت اصلی',
            x: startX + 285,
            width: 90
        },
        {
            title: 'تعداد',
            x: startX + 375,
            width: 60
        },
        {
            title: 'دسته‌بندی',
            x: startX + 435,
            width: 70
        }
    ];

    // =========================
    // Header
    // =========================

    doc
        .font(boldFont)
        .fontSize(9);

    columns.forEach(column => {
        doc.text(
            rtl(column.title),
            column.x,
            y,
            {
                width: column.width,
                align: 'right'
            }
        );
    });

    y += 20;

    doc
        .moveTo(startX, y - 5)
        .lineTo(545, y - 5)
        .stroke();

    // =========================
    // Rows
    // =========================

    doc
        .font(normalFont)
        .fontSize(9);

    for (const item of items) {

        if (y > 750) {
            doc.addPage();
            y = 40;

            doc
                .font(boldFont)
                .fontSize(9);

            columns.forEach(column => {
                doc.text(
                    rtl(column.title),
                    column.x,
                    y,
                    {
                        width: column.width,
                        align: 'right'
                    }
                );
            });

            y += 20;

            doc
                .moveTo(startX, y - 5)
                .lineTo(545, y - 5)
                .stroke();

            doc
                .font(normalFont)
                .fontSize(9);
        }

        // ID
        doc.text(
            String(item.item_id ?? ''),
            columns[0].x,
            y,
            {
                width: columns[0].width,
                align: 'right'
            }
        );

        // Name
        doc.text(
            rtl(item.name ?? ''),
            columns[1].x,
            y,
            {
                width: columns[1].width,
                align: 'right'
            }
        );

        // Price
        doc.text(
            Number(item.price ?? 0).toLocaleString('en-US'),
            columns[2].x,
            y,
            {
                width: columns[2].width,
                align: 'right'
            }
        );

        // Original price
        doc.text(
            Number(item.original_price ?? 0).toLocaleString('en-US'),
            columns[3].x,
            y,
            {
                width: columns[3].width,
                align: 'right'
            }
        );

        // Count
        doc.text(
            String(item.count ?? ''),
            columns[4].x,
            y,
            {
                width: columns[4].width,
                align: 'right'
            }
        );

        // Category
        doc.text(
            rtl(item.category ?? ''),
            columns[5].x,
            y,
            {
                width: columns[5].width,
                align: 'right'
            }
        );

        y += 20;
    }

    // =========================
    // Total
    // =========================

    y += 15;

    doc
        .moveTo(startX, y)
        .lineTo(545, y)
        .stroke();

    y += 15;

const total = Number(purchase.total ?? 0).toLocaleString('en-US');

doc.font(boldFont)
    .fontSize(11)
    .text(`${total} : ${rtl('مبلغ کل')}`, startX, y, {
        align: 'right',
        width: 505
    });

    doc.end();
}
module.exports = generatePurchasesPdf;