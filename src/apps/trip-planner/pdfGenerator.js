import jsPDF from 'jspdf';

export const generateTravelPlanPDF = (plan) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryColor = [99, 102, 241];
    const secondaryColor = [168, 85, 247];
    const accentColor = [0, 255, 157];
    const textColor = [30, 30, 30];
    const mutedColor = [120, 120, 120];

    let yPos = 20;

    // Header
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');

    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setGState(new doc.GState({ opacity: 0.3 }));
    doc.rect(pageWidth / 2, 0, pageWidth / 2, 60, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip Itinerary', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(plan.name || 'Untitled Trip', pageWidth / 2, 42, { align: 'center' });

    doc.setFontSize(10);
    doc.text(plan.startDate + ' to ' + plan.endDate, pageWidth / 2, 50, { align: 'center' });

    yPos = 70;

    // Overview
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Trip Overview', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

    if (plan.description) {
        const descLines = doc.splitTextToSize(plan.description, pageWidth - 40);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 5;
    }

    doc.text('Travelers: ' + (plan.travelers || 1), 20, yPos);
    yPos += 6;

    if (plan.budget) {
        doc.text('Budget: Rs. ' + plan.budget, 20, yPos);
        yPos += 6;
    }

    const totalCost = calculateTotalCost(plan);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Estimated Cost: Rs. ' + totalCost, 20, yPos);
    yPos += 15;

    // Helper function
    function checkPageBreak(requiredSpace = 30) {
        if (yPos > pageHeight - requiredSpace) {
            doc.addPage();
            yPos = 20;
        }
    }

    // Places Section
    if (plan.places && plan.places.length > 0) {
        checkPageBreak();

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Places to Visit', 20, yPos);
        yPos += 12;

        plan.places.forEach((place, index) => {
            checkPageBreak(55);

            doc.setFillColor(245, 255, 250);
            doc.roundedRect(15, yPos - 5, pageWidth - 30, 50, 3, 3, 'F');

            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.circle(25, yPos + 5, 5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 25, yPos + 7, { align: 'center' });

            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(place.name || 'Unnamed Place', 35, yPos + 3);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
            doc.text(place.location || '', 35, yPos + 10);

            let detailY = yPos + 16;

            if (place.arrivalDate) {
                const arrivalText = 'Arrival: ' + place.arrivalDate + (place.arrivalTime ? ' at ' + place.arrivalTime : '');
                doc.text(arrivalText, 35, detailY);
                detailY += 5;
            }

            if (place.departureDate) {
                const departureText = 'Departure: ' + place.departureDate + (place.departureTime ? ' at ' + place.departureTime : '');
                doc.text(departureText, 35, detailY);
                detailY += 5;
            }

            if (place.activities) {
                doc.text('Activities: ' + place.activities, 35, detailY);
                detailY += 5;
            }

            if (place.bookingReference) {
                doc.text('Booking Ref: ' + place.bookingReference, 35, detailY);
                detailY += 5;
            }

            if (place.notes) {
                const noteLines = doc.splitTextToSize('Notes: ' + place.notes, pageWidth - 70);
                doc.setFont('helvetica', 'italic');
                doc.text(noteLines, 35, detailY);
                detailY += noteLines.length * 5;
                doc.setFont('helvetica', 'normal');
            }

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text('Rs. ' + (place.cost || 0), pageWidth - 25, yPos + 10, { align: 'right' });

            yPos += 55;
        });

        yPos += 8;
    }

    // Transportation
    if (plan.transports && plan.transports.length > 0) {
        checkPageBreak();

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Transportation', 20, yPos);
        yPos += 12;

        plan.transports.forEach((transport) => {
            checkPageBreak(50);

            doc.setFillColor(245, 250, 255);
            doc.roundedRect(15, yPos - 5, pageWidth - 30, 45, 3, 3, 'F');

            const icon = getTransportIcon(transport.mode);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(icon, 20, yPos + 3);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(transport.from + '  ->  ' + transport.to, 40, yPos + 3);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

            let detailY = yPos + 10;

            if (transport.carrier) {
                doc.text('Carrier: ' + transport.carrier, 40, detailY);
                detailY += 5;
            }

            if (transport.departureDate) {
                const departText = 'Depart: ' + transport.departureDate + (transport.departureTime ? ' at ' + transport.departureTime : '');
                doc.text(departText, 40, detailY);
                detailY += 5;
            }

            if (transport.arrivalDate) {
                const arriveText = 'Arrive: ' + transport.arrivalDate + (transport.arrivalTime ? ' at ' + transport.arrivalTime : '');
                doc.text(arriveText, 40, detailY);
                detailY += 5;
            }

            if (transport.bookingReference) {
                doc.text('Booking Ref: ' + transport.bookingReference, 40, detailY);
                detailY += 5;
            }

            if (transport.notes) {
                const noteLines = doc.splitTextToSize('Notes: ' + transport.notes, pageWidth - 80);
                doc.setFont('helvetica', 'italic');
                doc.text(noteLines, 40, detailY);
                doc.setFont('helvetica', 'normal');
            }

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text('Rs. ' + (transport.cost || 0), pageWidth - 25, yPos + 10, { align: 'right' });

            yPos += 50;
        });

        yPos += 8;
    }

    // Accommodations
    if (plan.accommodations && plan.accommodations.length > 0) {
        checkPageBreak();

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Accommodations', 20, yPos);
        yPos += 12;

        plan.accommodations.forEach((accommodation) => {
            checkPageBreak(55);

            doc.setFillColor(250, 245, 255);
            doc.roundedRect(15, yPos - 5, pageWidth - 30, 50, 3, 3, 'F');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(accommodation.name || 'Unnamed', 20, yPos + 3);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);

            doc.text(accommodation.type + '  -  ' + accommodation.location, 20, yPos + 10);

            let detailY = yPos + 16;

            if (accommodation.address) {
                const addrLines = doc.splitTextToSize('Address: ' + accommodation.address, pageWidth - 50);
                doc.text(addrLines, 20, detailY);
                detailY += addrLines.length * 5;
            }

            if (accommodation.checkInDate) {
                const checkInText = 'Check-in: ' + accommodation.checkInDate + ' at ' + (accommodation.checkInTime || '14:00');
                doc.text(checkInText, 20, detailY);
                detailY += 5;
            }

            if (accommodation.checkOutDate) {
                const checkOutText = 'Check-out: ' + accommodation.checkOutDate + ' at ' + (accommodation.checkOutTime || '11:00');
                doc.text(checkOutText, 20, detailY);
                detailY += 5;
            }

            if (accommodation.phone) {
                doc.text('Phone: ' + accommodation.phone, 20, detailY);
                detailY += 5;
            }

            if (accommodation.bookingReference) {
                doc.text('Booking Ref: ' + accommodation.bookingReference, 20, detailY);
                detailY += 5;
            }

            if (accommodation.notes) {
                const noteLines = doc.splitTextToSize('Notes: ' + accommodation.notes, pageWidth - 50);
                doc.setFont('helvetica', 'italic');
                doc.text(noteLines, 20, detailY);
                doc.setFont('helvetica', 'normal');
            }

            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text('Rs. ' + (accommodation.cost || 0), pageWidth - 25, yPos + 10, { align: 'right' });

            yPos += 55;
        });

        yPos += 8;
    }

    // Total Cost
    yPos += 10;
    checkPageBreak(25);

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.roundedRect(15, yPos - 5, pageWidth - 30, 20, 3, 3, 'F');
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Total Trip Cost:', 20, yPos + 5);

    doc.setFontSize(18);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Rs. ' + totalCost, pageWidth - 20, yPos + 5, { align: 'right' });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated by Trip Planner - Chaitanya Tech World', pageWidth / 2, footerY, { align: 'center' });
        doc.text(new Date().toLocaleDateString(), pageWidth / 2, footerY + 5, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.text('Page ' + i + ' of ' + pageCount, pageWidth - 20, footerY, { align: 'right' });
    }

    const fileName = plan.name.replace(/\s+/g, '_') + '_TripPlan.pdf';
    doc.save(fileName);
};

function calculateTotalCost(plan) {
    const placesCost = (plan.places || []).reduce((sum, p) => sum + (parseFloat(p.cost) || 0), 0);
    const transportCost = (plan.transports || []).reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0);
    const accomCost = (plan.accommodations || []).reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
    return placesCost + transportCost + accomCost;
}

function getTransportIcon(mode) {
    const icons = {
        flight: 'Flight',
        train: 'Train',
        bus: 'Bus',
        car: 'Car',
        ferry: 'Ferry',
        walk: 'Walk'
    };
    return icons[mode] || 'Transport';
}
