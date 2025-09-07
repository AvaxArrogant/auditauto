import axios from '../lib/apiClient';

// CAP HPI API configuration
const CAP_HPI_API_BASE_URL = 'https://api.cap-hpi.co.uk';

export interface CAPHPIVehicleData {
  vehicleId: string;
  registration: string;
  make: string;
  model: string;
  derivative: string;
  year: number;
  mileage?: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  doors: number;
  engineSize: number;
  co2Emissions?: number;
  euroStatus?: string;
  colour: string;
  dateFirstRegistered: string;
  manufacturerCode: string;
  modelCode: string;
  derivativeCode: string;
}

export interface CAPHPIValuationData {
  vehicleId: string;
  valuationDate: string;
  mileage: number;
  condition: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  values: {
    trade: {
      clean: number;
      average: number;
      below: number;
    };
    retail: {
      excellent: number;
      good: number;
      average: number;
      below: number;
      poor: number;
    };
    part_exchange: {
      excellent: number;
      good: number;
      average: number;
      below: number;
      poor: number;
    };
    auction: {
      average: number;
    };
  };
  currency: string;
  region: string;
}

export interface CAPHPIInsuranceData {
  vehicleId: string;
  insuranceGroup: string;
  securityRating: string;
  theftRating: number;
  performanceIndex: number;
  damageIndex: number;
  repairCosts: {
    front: number;
    rear: number;
    side: number;
  };
  safetyRating: {
    ncap: number;
    year: number;
  };
}

export interface CAPHPIHistoryData {
  vehicleId: string;
  checks: {
    stolen: {
      status: 'clear' | 'alert' | 'unknown';
      details?: string;
    };
    writeOff: {
      status: 'clear' | 'alert' | 'unknown';
      category?: 'A' | 'B' | 'C' | 'D' | 'S' | 'N';
      details?: string;
    };
    mileage: {
      status: 'clear' | 'alert' | 'unknown';
      discrepancies?: Array<{
        date: string;
        mileage: number;
        source: string;
      }>;
    };
    previousKeepers: {
      count: number;
      details?: Array<{
        from: string;
        to: string;
        type: 'private' | 'fleet' | 'lease' | 'rental' | 'police' | 'government';
      }>;
    };
    finance: {
      status: 'clear' | 'outstanding' | 'unknown';
      details?: string;
    };
    import: {
      status: 'uk' | 'imported' | 'unknown';
      country?: string;
      date?: string;
    };
  };
  lastChecked: string;
}

export interface CAPHPIApiError {
  error: string;
  message: string;
  statusCode: number;
}

class CAPHPIApiService {
  private apiKey: string;
  private baseURL: string;

  constructor(apiKey: string, baseURL: string = CAP_HPI_API_BASE_URL) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  /**
   * Get vehicle information by registration number
   * @param registration - Vehicle registration number
   * @returns Promise with vehicle data or error
   */
  async getVehicleData(registration: string): Promise<CAPHPIVehicleData | CAPHPIApiError> {
    try {
      const cleanedReg = registration.replace(/\s+/g, '').toUpperCase();
      
      const response = await axios.get(
        `${this.baseURL}/vehicles/lookup`,
        {
          params: {
            registration: cleanedReg
          },
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data as CAPHPIVehicleData;
    } catch (error) {
      return this.handleApiError(error, 'vehicle lookup');
    }
  }

  /**
   * Get vehicle valuation data
   * @param vehicleId - CAP HPI vehicle ID
   * @param mileage - Current vehicle mileage
   * @param condition - Vehicle condition
   * @returns Promise with valuation data or error
   */
  async getValuation(
    vehicleId: string, 
    mileage: number, 
    condition: 'excellent' | 'good' | 'average' | 'below_average' | 'poor' = 'good'
  ): Promise<CAPHPIValuationData | CAPHPIApiError> {
    try {
      const response = await axios.post(
        `${this.baseURL}/valuations`,
        {
          vehicleId,
          mileage,
          condition,
          region: 'UK'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data as CAPHPIValuationData;
    } catch (error) {
      return this.handleApiError(error, 'valuation');
    }
  }

  /**
   * Get vehicle insurance information
   * @param vehicleId - CAP HPI vehicle ID
   * @returns Promise with insurance data or error
   */
  async getInsuranceData(vehicleId: string): Promise<CAPHPIInsuranceData | CAPHPIApiError> {
    try {
      const response = await axios.get(
        `${this.baseURL}/insurance/${vehicleId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      return response.data as CAPHPIInsuranceData;
    } catch (error) {
      return this.handleApiError(error, 'insurance data');
    }
  }

  /**
   * Get vehicle history check
   * @param registration - Vehicle registration number
   * @returns Promise with history data or error
   */
  async getVehicleHistory(registration: string): Promise<CAPHPIHistoryData | CAPHPIApiError> {
    try {
      const cleanedReg = registration.replace(/\s+/g, '').toUpperCase();
      
      const response = await axios.post(
        `${this.baseURL}/history/check`,
        {
          registration: cleanedReg,
          includeAll: true
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000 // History checks may take longer
        }
      );

      return response.data as CAPHPIHistoryData;
    } catch (error) {
      return this.handleApiError(error, 'vehicle history');
    }
  }

  /**
   * Get comprehensive vehicle report (combines all data)
   * @param registration - Vehicle registration number
   * @param mileage - Current vehicle mileage (optional)
   * @param condition - Vehicle condition (optional)
   * @returns Promise with comprehensive vehicle report
   */
  async getComprehensiveReport(
    registration: string,
    mileage?: number,
    condition: 'excellent' | 'good' | 'average' | 'below_average' | 'poor' = 'good'
  ): Promise<{
    vehicle: CAPHPIVehicleData;
    valuation?: CAPHPIValuationData;
    insurance?: CAPHPIInsuranceData;
    history?: CAPHPIHistoryData;
  } | CAPHPIApiError> {
    try {
      // Get basic vehicle data first
      const vehicleResult = await this.getVehicleData(registration);
      
      if ('error' in vehicleResult) {
        return vehicleResult;
      }

      const vehicle = vehicleResult as CAPHPIVehicleData;
      const report: any = { vehicle };

      // Get additional data in parallel
      const promises = [
        this.getInsuranceData(vehicle.vehicleId),
        this.getVehicleHistory(registration)
      ];

      // Add valuation if mileage is provided
      if (mileage) {
        promises.push(this.getValuation(vehicle.vehicleId, mileage, condition));
      }

      const results = await Promise.allSettled(promises);

      // Process insurance data
      if (results[0].status === 'fulfilled' && !('error' in results[0].value)) {
        report.insurance = results[0].value;
      }

      // Process history data
      if (results[1].status === 'fulfilled' && !('error' in results[1].value)) {
        report.history = results[1].value;
      }

      // Process valuation data (if requested)
      if (mileage && results[2] && results[2].status === 'fulfilled' && !('error' in results[2].value)) {
        report.valuation = results[2].value;
      }

      return report;
    } catch (error) {
      return this.handleApiError(error, 'comprehensive report');
    }
  }

  /**
   * Handle API errors consistently
   * @param error - Axios error or other error
   * @param operation - Description of the operation that failed
   * @returns Standardized error object
   */
  private handleApiError(error: any, operation: string): CAPHPIApiError {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const statusCode = error.response.status;
        let message = `Failed to get ${operation}`;

        switch (statusCode) {
          case 400:
            message = `Invalid request for ${operation} - check parameters`;
            break;
          case 401:
            message = 'Unauthorized - check API key';
            break;
          case 403:
            message = 'Access forbidden - insufficient permissions';
            break;
          case 404:
            message = `${operation} not found`;
            break;
          case 429:
            message = 'Rate limit exceeded - please try again later';
            break;
          case 500:
            message = 'CAP HPI service temporarily unavailable';
            break;
          case 503:
            message = 'CAP HPI service maintenance - please try again later';
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
          message: 'Unable to connect to CAP HPI service',
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
   * Format currency values for display
   * @param value - Numeric value
   * @param currency - Currency code (default: GBP)
   * @returns Formatted currency string
   */
  static formatCurrency(value: number, currency: string = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(value);
  }

  /**
   * Get risk assessment based on history data
   * @param historyData - CAP HPI history data
   * @returns Risk level and description
   */
  static getRiskAssessment(historyData: CAPHPIHistoryData): {
    level: 'low' | 'medium' | 'high';
    description: string;
    alerts: string[];
  } {
    const alerts: string[] = [];
    let riskScore = 0;

    // Check for stolen status
    if (historyData.checks.stolen.status === 'alert') {
      alerts.push('Vehicle reported as stolen');
      riskScore += 10;
    }

    // Check for write-off status
    if (historyData.checks.writeOff.status === 'alert') {
      alerts.push(`Vehicle has write-off record (Category ${historyData.checks.writeOff.category})`);
      riskScore += historyData.checks.writeOff.category === 'A' || historyData.checks.writeOff.category === 'B' ? 8 : 5;
    }

    // Check for mileage discrepancies
    if (historyData.checks.mileage.status === 'alert') {
      alerts.push('Mileage discrepancies detected');
      riskScore += 3;
    }

    // Check for outstanding finance
    if (historyData.checks.finance.status === 'outstanding') {
      alerts.push('Outstanding finance detected');
      riskScore += 6;
    }

    // Check for high number of previous keepers
    if (historyData.checks.previousKeepers.count > 5) {
      alerts.push(`High number of previous keepers (${historyData.checks.previousKeepers.count})`);
      riskScore += 2;
    }

    // Check for import status
    if (historyData.checks.import.status === 'imported') {
      alerts.push(`Imported vehicle from ${historyData.checks.import.country}`);
      riskScore += 1;
    }

    // Determine risk level
    let level: 'low' | 'medium' | 'high';
    let description: string;

    if (riskScore >= 8) {
      level = 'high';
      description = 'High risk - significant issues detected';
    } else if (riskScore >= 3) {
      level = 'medium';
      description = 'Medium risk - some concerns identified';
    } else {
      level = 'low';
      description = 'Low risk - no major issues detected';
    }

    return { level, description, alerts };
  }

  /**
   * Get insurance group description
   * @param group - Insurance group number/string
   * @returns Human-readable description
   */
  static getInsuranceGroupDescription(group: string): string {
    const groupNum = parseInt(group);
    
    if (groupNum <= 10) {
      return 'Very Low (Cheapest to insure)';
    } else if (groupNum <= 20) {
      return 'Low (Affordable insurance)';
    } else if (groupNum <= 30) {
      return 'Medium (Moderate insurance costs)';
    } else if (groupNum <= 40) {
      return 'High (Expensive to insure)';
    } else {
      return 'Very High (Most expensive to insure)';
    }
  }
}

// Export a default instance (API key should be set via environment variable)
export const capHpiApi = new CAPHPIApiService(
  import.meta.env.VITE_CAP_HPI_API_KEY || ''
);

export default CAPHPIApiService;