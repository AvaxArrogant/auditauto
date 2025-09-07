import axios from '../lib/apiClient';

// PC2Paper API configuration
const PC2PAPER_API_BASE_URL = import.meta.env.VITE_PC2PAPER_API_URL || 'https://www.pc2paper.co.uk/api';
const PC2PAPER_TOKEN = import.meta.env.VITE_PC2PAPER_TOKEN || '';
const PC2PAPER_SECRET = import.meta.env.VITE_PC2PAPER_SECRET || '';

export interface PC2PaperAddress {
  ReceiverName: string;
  ReceiverAddressLine1: string;
  ReceiverAddressLine2?: string;
  ReceiverAddressTownCityOrLine3: string;
  ReceiverAddressCountyStateOrLine4?: string;
  ReceiverAddressPostCode: string;
}

export interface PC2PaperLetterRequest {
  SourceClient: string;
  Addresses: PC2PaperAddress[];
  ReceiverCountryCode: string;
  Postage: string;
  Paper: string;
  Envelope: string;
  Extras?: string;
  LetterBody: string;
  IncludeSenderAddressOnEnvelope: boolean;
  SenderAddress: string;
  CustomerOwnId?: string;
}

export interface PC2PaperLetterResponse {
  success: boolean;
  message: string;
  letterId?: string;
  cost?: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface PC2PaperPricingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'postage' | 'paper' | 'envelope' | 'extras';
}

export interface PC2PaperPricingRequest {
  countryCode: string;
  paperType?: string;
  envelopeType?: string;
  postageType?: string;
  extras?: string[];
  pages?: number;
}

export interface PC2PaperPricingResponse {
  success: boolean;
  totalCost: number;
  breakdown: {
    postage: number;
    paper: number;
    envelope: number;
    extras: number;
  };
  currency: string;
  options: {
    postage: PC2PaperPricingOption[];
    paper: PC2PaperPricingOption[];
    envelope: PC2PaperPricingOption[];
    extras: PC2PaperPricingOption[];
  };
}

export interface PC2PaperApiError {
  error: string;
  message: string;
  statusCode: number;
}

class PC2PaperApiService {
  private token: string;
  private secret: string;
  private baseURL: string;

  constructor(token: string, secret: string, baseURL: string = PC2PAPER_API_BASE_URL) {
    this.token = token;
    this.secret = secret;
    this.baseURL = baseURL;
  }

  /**
   * Get available pricing options for letters
   * @param countryCode - Country code (e.g., 'GB' for UK)
   * @returns Promise with pricing options or error
   */
  async getPricingOptions(countryCode: string = 'GB'): Promise<PC2PaperPricingResponse | PC2PaperApiError> {
    try {
      // Since this is a demo, we'll return mock data
      // In production, you would make an actual API call
      const mockOptions: PC2PaperPricingResponse = {
        success: true,
        totalCost: 0.85,
        breakdown: {
          postage: 0.75,
          paper: 0.05,
          envelope: 0.03,
          extras: 0.02
        },
        currency: 'GBP',
        options: {
          postage: [
            {
              id: 'uk_first_class',
              name: 'UK First Class',
              description: 'Next working day delivery',
              price: 0.75,
              category: 'postage'
            },
            {
              id: 'uk_second_class',
              name: 'UK Second Class',
              description: '2-3 working days delivery',
              price: 0.65,
              category: 'postage'
            },
            {
              id: 'uk_recorded',
              name: 'UK Recorded Delivery',
              description: 'Tracked delivery with signature',
              price: 1.85,
              category: 'postage'
            },
            {
              id: 'uk_special',
              name: 'UK Special Delivery',
              description: 'Guaranteed next day by 1pm',
              price: 6.85,
              category: 'postage'
            }
          ],
          paper: [
            {
              id: 'standard_white',
              name: 'Standard White',
              description: '80gsm white paper',
              price: 0.05,
              category: 'paper'
            },
            {
              id: 'premium_white',
              name: 'Premium White',
              description: '100gsm premium white paper',
              price: 0.08,
              category: 'paper'
            },
            {
              id: 'letterhead',
              name: 'Letterhead Paper',
              description: 'Professional letterhead design',
              price: 0.15,
              category: 'paper'
            }
          ],
          envelope: [
            {
              id: 'standard_dl',
              name: 'Standard DL',
              description: 'Standard DL envelope',
              price: 0.03,
              category: 'envelope'
            },
            {
              id: 'window_dl',
              name: 'Window DL',
              description: 'DL envelope with window',
              price: 0.04,
              category: 'envelope'
            },
            {
              id: 'premium_c5',
              name: 'Premium C5',
              description: 'Premium C5 envelope',
              price: 0.06,
              category: 'envelope'
            }
          ],
          extras: [
            {
              id: 'none',
              name: 'No Extras',
              description: 'Standard service',
              price: 0,
              category: 'extras'
            },
            {
              id: 'recorded',
              name: 'Recorded Delivery',
              description: 'Proof of delivery',
              price: 1.10,
              category: 'extras'
            },
            {
              id: 'signed_for',
              name: 'Signed For',
              description: 'Signature required',
              price: 1.55,
              category: 'extras'
            }
          ]
        }
      };

      return mockOptions;
    } catch (error) {
      return this.handleApiError(error, 'pricing options');
    }
  }

  /**
   * Calculate the total cost for a letter with selected options
   * @param pricingRequest - Selected options for pricing calculation
   * @returns Promise with calculated price or error
   */
  async calculatePrice(pricingRequest: PC2PaperPricingRequest): Promise<{ totalCost: number; breakdown: any } | PC2PaperApiError> {
    try {
      // Get pricing options first
      const pricingOptions = await this.getPricingOptions(pricingRequest.countryCode);
      
      if ('error' in pricingOptions) {
        return pricingOptions;
      }

      const options = pricingOptions as PC2PaperPricingResponse;
      let totalCost = 0;
      const breakdown = {
        postage: 0,
        paper: 0,
        envelope: 0,
        extras: 0
      };

      // Calculate postage cost
      if (pricingRequest.postageType) {
        const postageOption = options.options.postage.find(p => p.id === pricingRequest.postageType);
        if (postageOption) {
          breakdown.postage = postageOption.price;
          totalCost += postageOption.price;
        }
      }

      // Calculate paper cost
      if (pricingRequest.paperType) {
        const paperOption = options.options.paper.find(p => p.id === pricingRequest.paperType);
        if (paperOption) {
          breakdown.paper = paperOption.price * (pricingRequest.pages || 1);
          totalCost += breakdown.paper;
        }
      }

      // Calculate envelope cost
      if (pricingRequest.envelopeType) {
        const envelopeOption = options.options.envelope.find(e => e.id === pricingRequest.envelopeType);
        if (envelopeOption) {
          breakdown.envelope = envelopeOption.price;
          totalCost += envelopeOption.price;
        }
      }

      // Calculate extras cost
      if (pricingRequest.extras && pricingRequest.extras.length > 0) {
        pricingRequest.extras.forEach(extraId => {
          const extraOption = options.options.extras.find(e => e.id === extraId);
          if (extraOption) {
            breakdown.extras += extraOption.price;
            totalCost += extraOption.price;
          }
        });
      }

      return {
        totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimal places
        breakdown
      };
    } catch (error) {
      return this.handleApiError(error, 'price calculation');
    }
  }

  /**
   * Send a letter via PC2Paper API
   * @param letterRequest - Letter details and options
   * @returns Promise with send result or error
   */
  async sendLetter(letterRequest: PC2PaperLetterRequest): Promise<PC2PaperLetterResponse | PC2PaperApiError> {
    try {
      // In a real implementation, you would make an actual API call here
      // For demo purposes, we'll simulate the API call
      
      if (!this.token || !this.secret) {
        return {
          error: 'CONFIGURATION_ERROR',
          message: 'PC2Paper API credentials not configured',
          statusCode: 401
        };
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful response
      const mockResponse: PC2PaperLetterResponse = {
        success: true,
        message: 'Letter queued for printing and posting',
        letterId: `PC2P-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        cost: 0.85,
        trackingNumber: `RR${Math.random().toString().substr(2, 9)}GB`,
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow
      };

      return mockResponse;

      // Real API call would look like this:
      /*
      const response = await axios.post(
        `${this.baseURL}/send-letter`,
        letterRequest,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'X-API-Secret': this.secret
          },
          timeout: 30000
        }
      );

      return response.data as PC2PaperLetterResponse;
      */
    } catch (error) {
      return this.handleApiError(error, 'letter sending');
    }
  }

  /**
   * Get the status of a sent letter
   * @param letterId - Letter ID returned from sendLetter
   * @returns Promise with letter status or error
   */
  async getLetterStatus(letterId: string): Promise<{ status: string; trackingInfo?: any } | PC2PaperApiError> {
    try {
      // Mock status response
      const mockStatus = {
        status: 'printed',
        trackingInfo: {
          printed: new Date().toISOString(),
          posted: null,
          delivered: null,
          estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      };

      return mockStatus;
    } catch (error) {
      return this.handleApiError(error, 'status check');
    }
  }

  /**
   * Parse council address from location string
   * @param location - Location where ticket was issued
   * @returns Council address with confidence indicator
   */
  static parseCouncilAddress(location: string): PC2PaperAddress & { confidence: 'high' | 'medium' | 'low' } {
    // This is a simplified parser - in production you'd want a more sophisticated system
    const locationLower = location.toLowerCase();
    
    // High confidence matches - specific council areas
    if (locationLower.includes('westminster')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Westminster City Council',
        ReceiverAddressLine2: 'City Hall',
        ReceiverAddressTownCityOrLine3: 'London',
        ReceiverAddressCountyStateOrLine4: 'Greater London',
        ReceiverAddressPostCode: 'SW1E 6QP',
        confidence: 'high'
      };
    } else if (locationLower.includes('camden')) {
      return {
        ReceiverName: 'Parking and Traffic Enforcement',
        ReceiverAddressLine1: 'Camden Council',
        ReceiverAddressLine2: 'Town Hall',
        ReceiverAddressTownCityOrLine3: 'London',
        ReceiverAddressCountyStateOrLine4: 'Greater London',
        ReceiverAddressPostCode: 'NW1 2RU',
        confidence: 'high'
      };
    } else if (locationLower.includes('manchester') && !locationLower.includes('greater manchester')) {
      return {
        ReceiverName: 'Traffic Enforcement',
        ReceiverAddressLine1: 'Manchester City Council',
        ReceiverAddressLine2: 'Town Hall',
        ReceiverAddressTownCityOrLine3: 'Manchester',
        ReceiverAddressCountyStateOrLine4: 'Greater Manchester',
        ReceiverAddressPostCode: 'M60 2LA',
        confidence: 'high'
      };
    } else if (locationLower.includes('birmingham') && !locationLower.includes('west midlands')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Birmingham City Council',
        ReceiverAddressLine2: 'Council House',
        ReceiverAddressTownCityOrLine3: 'Birmingham',
        ReceiverAddressCountyStateOrLine4: 'West Midlands',
        ReceiverAddressPostCode: 'B1 1BB',
        confidence: 'high'
      };
    } else if (locationLower.includes('liverpool')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Liverpool City Council',
        ReceiverAddressLine2: 'Cunard Building',
        ReceiverAddressTownCityOrLine3: 'Liverpool',
        ReceiverAddressCountyStateOrLine4: 'Merseyside',
        ReceiverAddressPostCode: 'L3 1AH',
        confidence: 'high'
      };
    } else if (locationLower.includes('leeds')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Leeds City Council',
        ReceiverAddressLine2: 'Civic Hall',
        ReceiverAddressTownCityOrLine3: 'Leeds',
        ReceiverAddressCountyStateOrLine4: 'West Yorkshire',
        ReceiverAddressPostCode: 'LS1 1UR',
        confidence: 'high'
      };
    } else if (locationLower.includes('bristol')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Bristol City Council',
        ReceiverAddressLine2: 'City Hall',
        ReceiverAddressTownCityOrLine3: 'Bristol',
        ReceiverAddressCountyStateOrLine4: 'South West England',
        ReceiverAddressPostCode: 'BS1 5TR',
        confidence: 'high'
      };
    } else if (locationLower.includes('sheffield')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Sheffield City Council',
        ReceiverAddressLine2: 'Town Hall',
        ReceiverAddressTownCityOrLine3: 'Sheffield',
        ReceiverAddressCountyStateOrLine4: 'South Yorkshire',
        ReceiverAddressPostCode: 'S1 2HH',
        confidence: 'high'
      };
    } else if (locationLower.includes('newcastle')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Newcastle City Council',
        ReceiverAddressLine2: 'Civic Centre',
        ReceiverAddressTownCityOrLine3: 'Newcastle upon Tyne',
        ReceiverAddressCountyStateOrLine4: 'Tyne and Wear',
        ReceiverAddressPostCode: 'NE1 8QH',
        confidence: 'high'
      };
    } else if (locationLower.includes('nottingham')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Nottingham City Council',
        ReceiverAddressLine2: 'Loxley House',
        ReceiverAddressTownCityOrLine3: 'Nottingham',
        ReceiverAddressCountyStateOrLine4: 'Nottinghamshire',
        ReceiverAddressPostCode: 'NG1 5DT',
        confidence: 'high'
      };
    }
    
    // Medium confidence - general area matches
    else if (locationLower.includes('london')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Local Council',
        ReceiverAddressLine2: 'Parking Department',
        ReceiverAddressTownCityOrLine3: 'London',
        ReceiverAddressCountyStateOrLine4: 'Greater London',
        ReceiverAddressPostCode: 'UNKNOWN',
        confidence: 'medium'
      };
    } else if (locationLower.includes('greater manchester')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Local Council',
        ReceiverAddressLine2: 'Parking Department',
        ReceiverAddressTownCityOrLine3: location,
        ReceiverAddressCountyStateOrLine4: 'Greater Manchester',
        ReceiverAddressPostCode: 'UNKNOWN',
        confidence: 'medium'
      };
    } else if (locationLower.includes('west midlands')) {
      return {
        ReceiverName: 'Parking Services',
        ReceiverAddressLine1: 'Local Council',
        ReceiverAddressLine2: 'Parking Department',
        ReceiverAddressTownCityOrLine3: location,
        ReceiverAddressCountyStateOrLine4: 'West Midlands',
        ReceiverAddressPostCode: 'UNKNOWN',
        confidence: 'medium'
      };
    } else {
      // Low confidence - generic council address
      return {
        ReceiverName: 'Parking Services Department',
        ReceiverAddressLine1: 'Local Council',
        ReceiverAddressLine2: 'Civic Centre',
        ReceiverAddressTownCityOrLine3: location,
        ReceiverAddressCountyStateOrLine4: 'United Kingdom',
        ReceiverAddressPostCode: 'UNKNOWN',
        confidence: 'low'
      };
    }
  }

  /**
   * Format council address for letter display
   * @param councilAddress - Council address object
   * @returns Formatted multi-line address string
   */
  static formatCouncilAddressForLetter(councilAddress: PC2PaperAddress): string {
    const lines = [
      councilAddress.ReceiverName,
      councilAddress.ReceiverAddressLine1,
      councilAddress.ReceiverAddressLine2,
      councilAddress.ReceiverAddressTownCityOrLine3,
      councilAddress.ReceiverAddressCountyStateOrLine4,
      councilAddress.ReceiverAddressPostCode
    ].filter(line => line && line.trim() && line !== 'UNKNOWN');
    
    return lines.join('\n');
  }

  /**
   * Format sender address from form data
   * @param personalDetails - User's personal details
   * @returns Formatted sender address string
   */
  static formatSenderAddress(personalDetails: { name: string; address: string; email: string; phone: string }): string {
    return `${personalDetails.name}\n${personalDetails.address}\n${personalDetails.email}\n${personalDetails.phone}`;
  }

  /**
   * Handle API errors consistently
   * @param error - Axios error or other error
   * @param operation - Description of the operation that failed
   * @returns Standardized error object
   */
  private handleApiError(error: any, operation: string): PC2PaperApiError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const statusCode = error.response.status;
        let message = `Failed to ${operation}`;

        switch (statusCode) {
          case 400:
            message = `Invalid request for ${operation} - check parameters`;
            break;
          case 401:
            message = 'Unauthorized - check API credentials';
            break;
          case 403:
            message = 'Access forbidden - insufficient permissions';
            break;
          case 404:
            message = `${operation} endpoint not found`;
            break;
          case 429:
            message = 'Rate limit exceeded - please try again later';
            break;
          case 500:
            message = 'PC2Paper service temporarily unavailable';
            break;
          case 503:
            message = 'PC2Paper service maintenance - please try again later';
            break;
        }

        return {
          error: 'API_ERROR',
          message,
          statusCode
        };
      } else if (error.request) {
        return {
          error: 'NETWORK_ERROR',
          message: 'Unable to connect to PC2Paper service',
          statusCode: 0
        };
      }
    }

    return {
      error: 'UNKNOWN_ERROR',
      message: `An unexpected error occurred during ${operation}`,
      statusCode: 500
    };
  }

  /**
   * Format currency for display
   * @param amount - Amount in GBP
   * @returns Formatted currency string
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  }

  /**
   * Estimate letter pages based on content length
   * @param content - Letter content
   * @returns Estimated number of pages
   */
  static estimatePages(content: string): number {
    // Rough estimate: 500 characters per page
    const charactersPerPage = 500;
    return Math.max(1, Math.ceil(content.length / charactersPerPage));
  }
}

// Export a default instance
export const pc2paperApi = new PC2PaperApiService(
  PC2PAPER_TOKEN,
  PC2PAPER_SECRET
);

export default PC2PaperApiService;