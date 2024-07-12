import React from 'react';
import jsPDF from 'jspdf';

const DownloadPDF = ({ holiday }) => { // Ensure holiday is received as a prop

    const handleDownload = () => {
        const doc = new jsPDF();
        // Create a temporary div element
        const tempDiv = document.createElement('div');
        // Set its content to the holiday information
        tempDiv.innerHTML = `<h6>${holiday.city}</h6>
        <span>${holiday.description}</span>`;
        
        // Use jsPDF's html method on the temporary div
        doc.html(tempDiv, {
            callback: function (pdf) {
                pdf.save(`${holiday.city}.pdf`);
            },
            x: 10,
            y: 10
        });
    };

    return (
        <div>
            <button onClick={handleDownload}><i className='fa fa-file'></i></button>
        </div>
    );
};

export default DownloadPDF;