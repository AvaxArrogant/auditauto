import jsPDF from 'jspdf';
import { VehicleDataFull } from '../services/vehicleDataApi';

export interface VehicleReportData {
  vehicleData: VehicleDataFull;
  reportType: 'basic' | 'comprehensive';
}

export class VehicleReportGenerator {
  /**
   * Generate a PDF from vehicle data
   */
  static generateVehicleReportPDF(reportData: VehicleReportData): jsPDF {
    const { vehicleData, reportType } = reportData;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up fonts and styling
    doc.setFont('helvetica');
    
    // Add header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${reportType === 'comprehensive' ? 'COMPREHENSIVE' : 'BASIC'} VEHICLE REPORT`, 105, 20, { align: 'center' });
    
    // Add vehicle registration
    doc.setFontSize(16);
    doc.text(`${vehicleData.registration}`, 105, 30, { align: 'center' });
    
    // Add a line under header
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Reset font for body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    // Add vehicle details section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vehicle Details', 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let yPosition = 55;
    const lineHeight = 7;
    
    // Basic vehicle details
    this.addKeyValuePair(doc, 'Make:', vehicleData.make, 20, yPosition);
    this.addKeyValuePair(doc, 'Model:', vehicleData.model, 105, yPosition);
    yPosition += lineHeight;
    
    this.addKeyValuePair(doc, 'Year:', vehicleData.yearOfManufacture?.toString() || 'N/A', 20, yPosition);
    this.addKeyValuePair(doc, 'Color:', vehicleData.color, 105, yPosition);
    yPosition += lineHeight;
    
    this.addKeyValuePair(doc, 'Fuel Type:', vehicleData.fuelType, 20, yPosition);
    this.addKeyValuePair(doc, 'Engine Size:', vehicleData.engineSize ? `${(vehicleData.engineSize / 1000).toFixed(1)}L` : 'N/A', 105, yPosition);
    yPosition += lineHeight;
    
    // MOT and Tax Status
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('MOT & Tax Status', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPosition += 10;
    
    this.addKeyValuePair(doc, 'MOT Status:', vehicleData.motStatus?.isValid ? 'Valid' : 'Not Valid', 20, yPosition);
    this.addKeyValuePair(doc, 'Tax Status:', vehicleData.taxStatus?.isValid ? 'Valid' : 'Not Valid', 105, yPosition);
    yPosition += lineHeight;
    
    if (vehicleData.motStatus?.dueDate) {
      this.addKeyValuePair(doc, 'MOT Due Date:', new Date(vehicleData.motStatus.dueDate).toLocaleDateString(), 20, yPosition);
    }
    if (vehicleData.taxStatus?.co2Emissions) {
      this.addKeyValuePair(doc, 'CO2 Emissions:', `${vehicleData.taxStatus.co2Emissions} g/km`, 105, yPosition);
    }
    yPosition += lineHeight;
    
    // If comprehensive report, add additional sections
    if (reportType === 'comprehensive' && vehicleData.history) {
      // Risk Assessment
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Risk Assessment', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      yPosition += 10;
      
      if (vehicleData.riskAssessment) {
        const riskLevel = vehicleData.riskAssessment.level;
        const riskColor = riskLevel === 'low' ? [0, 128, 0] : riskLevel === 'medium' ? [255, 165, 0] : [255, 0, 0];
        
        doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${riskLevel.toUpperCase()} RISK`, 20, yPosition);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition += lineHeight;
        
        doc.text(vehicleData.riskAssessment.description, 20, yPosition);
        yPosition += lineHeight;
        
        if (vehicleData.riskAssessment.alerts && vehicleData.riskAssessment.alerts.length > 0) {
          doc.text('Alerts:', 20, yPosition);
          yPosition += 5;
          
          vehicleData.riskAssessment.alerts.forEach(alert => {
            doc.text(`• ${alert}`, 25, yPosition);
            yPosition += 5;
          });
        }
      }
      
      // Vehicle History
      yPosition += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle History', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      yPosition += 10;
      
      this.addKeyValuePair(doc, 'Stolen Status:', vehicleData.history.isStolen ? 'STOLEN' : 'Clear', 20, yPosition);
      this.addKeyValuePair(doc, 'Write-Off Status:', vehicleData.history.isWriteOff ? `Category ${vehicleData.history.writeOffCategory}` : 'Clear', 105, yPosition);
      yPosition += lineHeight;
      
      this.addKeyValuePair(doc, 'Outstanding Finance:', vehicleData.history.hasOutstandingFinance ? 'YES' : 'No', 20, yPosition);
      this.addKeyValuePair(doc, 'Mileage Discrepancy:', vehicleData.history.hasMileageDiscrepancy ? 'YES' : 'No', 105, yPosition);
      yPosition += lineHeight;
      
      // Valuation
      if (vehicleData.valuation) {
        yPosition += 5;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Valuation', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition += 10;
        
        doc.text('Retail Values:', 20, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Excellent:', `£${vehicleData.valuation.retail.excellent.toLocaleString()}`, 30, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Good:', `£${vehicleData.valuation.retail.good.toLocaleString()}`, 30, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Average:', `£${vehicleData.valuation.retail.average.toLocaleString()}`, 30, yPosition);
        yPosition += 7;
        
        doc.text('Trade-in Values:', 20, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Clean:', `£${vehicleData.valuation.trade.clean.toLocaleString()}`, 30, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Average:', `£${vehicleData.valuation.trade.average.toLocaleString()}`, 30, yPosition);
        yPosition += 5;
        this.addKeyValuePair(doc, 'Below Average:', `£${vehicleData.valuation.trade.below.toLocaleString()}`, 30, yPosition);
        yPosition += 7;
      }
      
      // Performance data
      if (vehicleData.performance) {
        yPosition += 5;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Performance', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        yPosition += 10;
        
        if (vehicleData.performance.power) {
          this.addKeyValuePair(doc, 'Power:', `${vehicleData.performance.power} bhp`, 20, yPosition);
        }
        if (vehicleData.performance.topSpeed) {
          this.addKeyValuePair(doc, 'Top Speed:', `${vehicleData.performance.topSpeed} mph`, 105, yPosition);
        }
        yPosition += lineHeight;
        
        if (vehicleData.performance.zeroToSixty) {
          this.addKeyValuePair(doc, '0-60 mph:', `${vehicleData.performance.zeroToSixty} seconds`, 20, yPosition);
        }
        if (vehicleData.performance.fuelEconomy) {
          this.addKeyValuePair(doc, 'Fuel Economy:', `${vehicleData.performance.fuelEconomy} mpg`, 105, yPosition);
        }
        yPosition += lineHeight;
      }
    }
    
    // Add footer with generation info
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Generated by AutoAudit - Page ${i} of ${totalPages}`,
        105,
        290,
        { align: 'center' }
      );
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        190,
        290,
        { align: 'right' }
      );
    }
    
    return doc;
  }

  /**
   * Add a key-value pair to the PDF
   */
  private static addKeyValuePair(doc: jsPDF, key: string, value: string, x: number, y: number): void {
    doc.setFont('helvetica', 'bold');
    doc.text(key, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, x + 30, y);
  }

  /**
   * Download the PDF file
   */
  static downloadPDF(reportData: VehicleReportData): void {
    const doc = this.generateVehicleReportPDF(reportData);
    const filename = `Vehicle_Report_${reportData.vehicleData.registration}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  }

  /**
   * Get PDF as blob for email attachment
   */
  static getPDFBlob(reportData: VehicleReportData): Blob {
    const doc = this.generateVehicleReportPDF(reportData);
    return doc.output('blob');
  }

  /**
   * Get PDF as base64 string
   */
  static getPDFBase64(reportData: VehicleReportData): string {
    const doc = this.generateVehicleReportPDF(reportData);
    return doc.output('datauristring');
  }

  /**
   * Generate plain text report
   */
  static generatePlainTextReport(reportData: VehicleReportData): string {
    const { vehicleData, reportType } = reportData;
    
    let report = `VEHICLE REPORT - ${reportType.toUpperCase()}\n`;
    report += `Registration: ${vehicleData.registration}\n`;
    report += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    report += `VEHICLE DETAILS\n`;
    report += `Make: ${vehicleData.make}\n`;
    report += `Model: ${vehicleData.model}\n`;
    report += `Year: ${vehicleData.yearOfManufacture}\n`;
    report += `Color: ${vehicleData.color}\n`;
    report += `Fuel Type: ${vehicleData.fuelType}\n`;
    report += `Engine Size: ${vehicleData.engineSize ? (vehicleData.engineSize / 1000).toFixed(1) + 'L' : 'N/A'}\n\n`;
    
    report += `MOT & TAX STATUS\n`;
    report += `MOT Status: ${vehicleData.motStatus?.isValid ? 'Valid' : 'Not Valid'}\n`;
    report += `Tax Status: ${vehicleData.taxStatus?.isValid ? 'Valid' : 'Not Valid'}\n`;
    
    if (vehicleData.motStatus?.dueDate) {
      report += `MOT Due Date: ${new Date(vehicleData.motStatus.dueDate).toLocaleDateString()}\n`;
    }
    
    if (vehicleData.taxStatus?.co2Emissions) {
      report += `CO2 Emissions: ${vehicleData.taxStatus.co2Emissions} g/km\n`;
    }
    
    if (reportType === 'comprehensive' && vehicleData.riskAssessment) {
      report += `\nRISK ASSESSMENT\n`;
      report += `Risk Level: ${vehicleData.riskAssessment.level.toUpperCase()}\n`;
      report += `Description: ${vehicleData.riskAssessment.description}\n`;
      
      if (vehicleData.riskAssessment.alerts && vehicleData.riskAssessment.alerts.length > 0) {
        report += `Alerts:\n`;
        vehicleData.riskAssessment.alerts.forEach(alert => {
          report += `• ${alert}\n`;
        });
      }
    }
    
    if (reportType === 'comprehensive' && vehicleData.history) {
      report += `\nVEHICLE HISTORY\n`;
      report += `Stolen Status: ${vehicleData.history.isStolen ? 'STOLEN' : 'Clear'}\n`;
      report += `Write-Off Status: ${vehicleData.history.isWriteOff ? `Category ${vehicleData.history.writeOffCategory}` : 'Clear'}\n`;
      report += `Outstanding Finance: ${vehicleData.history.hasOutstandingFinance ? 'YES' : 'No'}\n`;
      report += `Mileage Discrepancy: ${vehicleData.history.hasMileageDiscrepancy ? 'YES' : 'No'}\n`;
    }
    
    if (reportType === 'comprehensive' && vehicleData.valuation) {
      report += `\nVALUATION\n`;
      report += `Retail Values:\n`;
      report += `  Excellent: £${vehicleData.valuation.retail.excellent.toLocaleString()}\n`;
      report += `  Good: £${vehicleData.valuation.retail.good.toLocaleString()}\n`;
      report += `  Average: £${vehicleData.valuation.retail.average.toLocaleString()}\n\n`;
      
      report += `Trade-in Values:\n`;
      report += `  Clean: £${vehicleData.valuation.trade.clean.toLocaleString()}\n`;
      report += `  Average: £${vehicleData.valuation.trade.average.toLocaleString()}\n`;
      report += `  Below Average: £${vehicleData.valuation.trade.below.toLocaleString()}\n`;
    }
    
    if (reportType === 'comprehensive' && vehicleData.performance) {
      report += `\nPERFORMANCE\n`;
      if (vehicleData.performance.power) report += `Power: ${vehicleData.performance.power} bhp\n`;
      if (vehicleData.performance.topSpeed) report += `Top Speed: ${vehicleData.performance.topSpeed} mph\n`;
      if (vehicleData.performance.zeroToSixty) report += `0-60 mph: ${vehicleData.performance.zeroToSixty} seconds\n`;
      if (vehicleData.performance.fuelEconomy) report += `Fuel Economy: ${vehicleData.performance.fuelEconomy} mpg\n`;
    }
    
    report += `\n---\nThis report was generated by AutoAudit's vehicle history service.\n`;
    report += `For support, visit: https://autoaudit.net/contact\n`;
    
    return report;
  }
}

export default VehicleReportGenerator;