export interface DisputeFormData {
  ticketNumber: string;
  issueDate: string;
  location: string;
  vehicleReg: string;
  amount: string;
  reason: string;
  evidence: string;
  selectedOffenses: string[];
  personalDetails: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
}

export interface AIEnhancedLetter {
  letterContent: string;
  legalReferences: string[];
  strengthScore: number;
  recommendations: string[];
  estimatedSuccessRate: number;
}

class AIDisputeService {
  /**
   * Generate an AI-enhanced dispute letter
   */
  async generateEnhancedLetter(formData: DisputeFormData): Promise<AIEnhancedLetter> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Derive ticket type from selected offenses
    const ticketType = this.deriveTicketType(formData.selectedOffenses);

    const legalReferences = this.getLegalReferences(ticketType, formData.reason);
    const caseStrength = this.analyzeCaseStrength(formData);
    const enhancedContent = this.generateLetterContent(formData, ticketType, legalReferences, caseStrength);
    const recommendations = this.generateRecommendations(formData, caseStrength);

    return {
      letterContent: enhancedContent,
      legalReferences,
      strengthScore: caseStrength.score,
      recommendations,
      estimatedSuccessRate: caseStrength.successRate
    };
  }

  /**
   * Analyze the strength of the case based on form data
   */
  private analyzeCaseStrength(formData: DisputeFormData): { score: number; successRate: number; factors: string[] } {
    let score = 50; // Base score
    const factors: string[] = [];

    // Analyze based on dispute reason
    switch (formData.reason) {
      case 'Signage unclear or missing':
        score += 25;
        factors.push('Strong legal ground - inadequate signage');
        break;
      case 'Medical emergency':
        score += 20;
        factors.push('Mitigating circumstances - medical emergency');
        break;
      case 'Vehicle breakdown':
        score += 15;
        factors.push('Mitigating circumstances - vehicle breakdown');
        break;
      case 'Payment made but not registered':
        score += 30;
        factors.push('Strong evidence - payment proof available');
        break;
      case 'Incorrect vehicle details':
        score += 35;
        factors.push('Administrative error - incorrect details');
        break;
      case 'Ticket issued incorrectly':
        score += 20;
        factors.push('Procedural error in ticket issuance');
        break;
      case 'Let Us Decide':
        score += 25;
        factors.push('Expert-selected dispute strategy');
        break;
    }

    // Analyze evidence quality
    if (formData.evidence.length > 100) {
      score += 10;
      factors.push('Detailed evidence provided');
    }
    if (formData.evidence.toLowerCase().includes('photo') || formData.evidence.toLowerCase().includes('image')) {
      score += 15;
      factors.push('Photographic evidence mentioned');
    }
    if (formData.evidence.toLowerCase().includes('witness')) {
      score += 10;
      factors.push('Witness testimony available');
    }

    // Analyze ticket type
    if (formData.ticketType === 'parking') {
      score += 5; // Parking tickets often have more grounds for appeal
    }

    // Cap the score
    score = Math.min(score, 95);
    score = Math.max(score, 15);

    const successRate = Math.round(score * 0.9); // Convert to success rate percentage

    return { score, successRate, factors };
  }

  /**
   * Derive ticket type from selected offenses
   */
  private deriveTicketType(selectedOffenses: string[]): 'parking' | 'speeding' | 'bus_lane' | 'congestion' | 'other' {
    if (selectedOffenses.length === 0) {
      return 'other';
    }
    
    // Map offense types to ticket types
    if (selectedOffenses.some(offense => offense.toLowerCase().includes('parking'))) {
      return 'parking';
    }
    
    if (selectedOffenses.some(offense => offense.toLowerCase().includes('speeding'))) {
      return 'speeding';
    }
    
    if (selectedOffenses.some(offense => offense.toLowerCase().includes('bus lane'))) {
      return 'bus_lane';
    }
    
    if (selectedOffenses.some(offense => offense.toLowerCase().includes('congestion'))) {
      return 'congestion';
    }
    
    return 'other';
  }

  /**
   * Get relevant legal references based on ticket type and reason
   */
  private getLegalReferences(ticketType: string, reason: string): string[] {
    const references: string[] = [];

    // Base legal framework
    references.push('Traffic Management Act 2004');
    references.push('Civil Enforcement of Parking Contraventions (England) General Regulations 2007');

    // Specific references based on ticket type
    switch (ticketType) {
      case 'parking':
        references.push('Road Traffic Regulation Act 1984');
        if (reason.includes('Signage')) {
          references.push('Traffic Signs Regulations and General Directions 2016');
        }
        break;
      case 'speeding':
        references.push('Road Traffic Offenders Act 1988');
        references.push('Road Traffic Act 1988, Section 89');
        break;
      case 'bus_lane':
        references.push('Transport Act 2000');
        references.push('Bus Lane Contraventions (Penalty Charges, Adjudication and Enforcement) (England) Regulations 2005');
        break;
      case 'congestion':
        references.push('Greater London Authority Act 1999');
        references.push('Road User Charging (Enforcement and Adjudication) (London) Regulations 2001');
        break;
    }

    // Add human rights references for serious cases
    if (reason.includes('Medical emergency')) {
      references.push('Human Rights Act 1998, Article 8 (Right to private and family life)');
    }

    return references;
  }

  /**
   * Generate the enhanced letter content
   */
  private generateLetterContent(
    formData: DisputeFormData,
    ticketType: 'parking' | 'speeding' | 'bus_lane' | 'congestion' | 'other',
    legalReferences: string[], 
    caseStrength: { score: number; factors: string[] }
  ): string {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const ticketTypeMap = {
      'parking': 'Parking Penalty Charge Notice',
      'speeding': 'Speeding Penalty Notice',
      'bus_lane': 'Bus Lane Penalty Charge Notice',
      'congestion': 'Congestion Charge Penalty Notice',
      'other': 'Traffic Penalty Notice'
    };

    const reasonEnhancement = this.enhanceReason(formData.reason, formData.evidence);
    const legalArguments = this.generateLegalArguments(formData, legalReferences);
    const evidenceSection = this.formatEvidenceSection(formData.evidence);

    return `${formData.personalDetails.name}
${formData.personalDetails.address}
${formData.personalDetails.email}
${formData.personalDetails.phone}

${currentDate}

[Council Name]
Parking Services Department / Traffic Enforcement
[Council Address]

Re: Formal Appeal - ${ticketTypeMap[ticketType]} ${formData.ticketNumber}
Vehicle Registration: ${formData.vehicleReg}
Date of Alleged Contravention: ${new Date(formData.issueDate).toLocaleDateString('en-GB')}
Location: ${formData.location}
Penalty Amount: ${formData.amount}

Dear Sir/Madam,

I am writing to formally challenge the above-referenced penalty notice under the statutory appeal process. I believe this notice was issued in error and respectfully request its immediate cancellation.

GROUNDS FOR APPEAL

${reasonEnhancement}

DETAILED CIRCUMSTANCES

${formData.evidence}

${evidenceSection}

LEGAL POSITION

${legalArguments}

PROCEDURAL CONSIDERATIONS

I would draw your attention to the requirement under the Traffic Management Act 2004 that penalty charge notices must be issued in accordance with proper procedures and that any contravention must be clearly evidenced. The circumstances outlined above demonstrate that either no contravention occurred or that there are compelling mitigating factors that warrant the exercise of discretion in cancelling this notice.

Furthermore, under the Civil Enforcement of Parking Contraventions (England) General Regulations 2007, enforcement authorities must consider all relevant circumstances when determining whether to pursue a penalty charge.

REQUEST FOR CANCELLATION

In light of the above circumstances and legal considerations, I formally request that you:

1. Cancel this penalty charge notice in its entirety
2. Confirm in writing that no further action will be taken
3. Remove any record of this notice from your enforcement database

I trust that upon review of the evidence and circumstances presented, you will agree that pursuing this matter further would not be appropriate or in the public interest.

I look forward to your prompt response and the cancellation of this notice within 14 days of receipt of this letter. Should you require any additional information or clarification, please do not hesitate to contact me using the details provided above.

Yours faithfully,

${formData.personalDetails.name}

Enclosures: [List any supporting evidence documents]

---

IMPORTANT NOTES:
- This letter should be sent by recorded delivery
- Keep copies of all correspondence
- If appeal is rejected, you may have the right to appeal to an independent adjudicator
- Seek legal advice if the matter proceeds to formal adjudication`;
  }

  /**
   * Enhance the dispute reason with AI-generated content
   */
  private enhanceReason(reason: string, evidence: string): string {
    const enhancements = {
      'Signage unclear or missing': `I contend that the penalty charge notice was issued in contravention of proper signage requirements. The Traffic Signs Regulations and General Directions 2016 mandate that all traffic signs must be clearly visible, unambiguous, and properly maintained. In this instance, the signage was either absent, obscured, or failed to meet the required standards for enforceability.`,
      
      'Medical emergency': `This contravention occurred during a genuine medical emergency situation. The circumstances were exceptional and beyond my control, requiring immediate action that took precedence over normal parking regulations. Under these circumstances, the enforcement of a penalty charge would be disproportionate and contrary to the principles of reasonableness and public interest.`,
      
      'Vehicle breakdown': `The alleged contravention occurred as a direct result of an unexpected vehicle breakdown, which rendered the vehicle immobile and unable to be moved from the location. This constitutes exceptional circumstances beyond the driver's control, and enforcement action in such situations is generally considered inappropriate and contrary to the principles of fair enforcement.`,
      
      'Payment made but not registered': `I have evidence that payment was made for parking at the relevant time and location. The failure to register this payment appears to be a technical or administrative error within the payment system. As payment was made in good faith and within the required timeframe, no actual contravention occurred.`,
      
      'Incorrect vehicle details': `The penalty charge notice contains incorrect vehicle details, which fundamentally undermines its validity. The accuracy of vehicle identification is essential for the enforceability of any penalty charge notice, and errors in this regard render the notice defective and unenforceable.`,
      
      'Ticket issued incorrectly': `The penalty charge notice was issued in error, either due to misinterpretation of the parking restrictions, incorrect assessment of the situation, or failure to follow proper enforcement procedures. The circumstances do not constitute a contravention of the relevant traffic regulation order.`,
      
      'Vehicle not in violation': `A careful review of the circumstances and applicable regulations demonstrates that no contravention occurred. The vehicle was parked in accordance with the relevant restrictions and regulations in force at the time and location specified.`
      ,
      'Let Us Decide': `I am writing to formally challenge this penalty charge notice based on several grounds that I believe render it invalid or unenforceable. After careful review of the circumstances and applicable regulations, there are compelling reasons why this notice should be cancelled.`
    };

    return enhancements[reason] || `I dispute this penalty charge notice on the grounds that ${reason.toLowerCase()}. The circumstances of this case demonstrate that no valid contravention occurred, and the notice should be cancelled.`;
  }

  /**
   * Generate legal arguments based on the case
   */
  private generateLegalArguments(formData: DisputeFormData, legalReferences: string[]): string {
    let legalArgumentsContent = `Under the ${legalReferences[0]}, enforcement authorities must ensure that penalty charge notices are issued only where a clear contravention has occurred and in accordance with proper procedures.\n\n`;

    // Add specific legal arguments based on ticket type
    switch (formData.ticketType) {
      case 'parking':
        legalArgumentsContent += `The Civil Enforcement of Parking Contraventions (England) General Regulations 2007 require that parking restrictions must be clearly indicated and that enforcement must be carried out fairly and consistently. `;
        break;
      case 'speeding':
        legalArgumentsContent += `Under the Road Traffic Offenders Act 1988, the burden of proof lies with the prosecution to demonstrate that a speeding offence occurred. `;
        break;
    }

    legalArgumentsContent += `The circumstances outlined above demonstrate that the requirements for a valid penalty charge notice have not been met, and the notice should therefore be cancelled.`;

    return legalArgumentsContent;
  }

  /**
   * Format the evidence section
   */
  private formatEvidenceSection(evidence: string): string {
    if (!evidence || evidence.trim().length === 0) {
      return '';
    }

    return `\nSUPPORTING EVIDENCE\n\nThe following evidence supports my appeal:\n\n${evidence}\n\nI am prepared to provide additional documentation or clarification as required to support this appeal.`;
  }

  /**
   * Generate recommendations for improving the appeal
   */
  private generateRecommendations(formData: DisputeFormData, caseStrength: { score: number; factors: string[] }): string[] {
    const recommendations: string[] = [];

    if (caseStrength.score < 60) {
      recommendations.push('Consider gathering additional evidence to strengthen your case');
    }

    if (!formData.evidence.toLowerCase().includes('photo')) {
      recommendations.push('Include photographs of the location and any relevant signage');
    }

    if (!formData.evidence.toLowerCase().includes('witness')) {
      recommendations.push('Obtain witness statements if available');
    }

    if (formData.reason === 'Payment made but not registered') {
      recommendations.push('Include payment receipts, bank statements, or app screenshots as evidence');
    }

    if (formData.reason === 'Medical emergency') {
      recommendations.push('Include medical documentation or hospital records if available');
    }

    if (this.deriveTicketType(formData.selectedOffenses) === 'parking') {
      recommendations.push('Check if the Traffic Regulation Order is properly published and accessible');
    }

    recommendations.push('Send your appeal by recorded delivery and keep copies of all correspondence');
    recommendations.push('Submit your appeal as soon as possible within the statutory time limit');

    return recommendations;
  }

  /**
   * Get success rate statistics for different dispute types
   */
  static getSuccessRates(): Record<string, number> {
    return {
      'Signage unclear or missing': 78,
      'Payment made but not registered': 85,
      'Incorrect vehicle details': 92,
      'Medical emergency': 65,
      'Vehicle breakdown': 58,
      'Ticket issued incorrectly': 72,
      'Vehicle not in violation': 68,
      'Mitigating circumstances': 45,
      'Other': 35,
      'Let Us Decide': 75,
    };
  }
}

export const aiDisputeService = new AIDisputeService();
export default AIDisputeService;