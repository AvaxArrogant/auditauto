import axios from '../lib/apiClient';

// DVLA API configuration
const DVLA_VEHICLE_API_BASE_URL = 'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1';
const DVLA_DRIVER_API_BASE_URL = 'https://driver-vehicle-licensing.api.gov.uk/full-driver-enquiry/v1';

export interface DVLAVehicleData {
  registrationNumber: string;
  taxStatus: string;
  taxDueDate?: string;
  artEndDate?: string;
  motStatus: string;
  motExpiryDate?: string;
  make: string;
  yearOfManufacture: number;
  engineCapacity?: number;
  co2Emissions?: number;
  fuelType: string;
  markedForExport: boolean;
  colour: string;
  typeApproval?: string;
  wheelplan?: string;
  revenueWeight?: number;
  realDrivingEmissions?: string;
  dateOfLastV5CIssued?: string;
  euroStatus?: string;
}

export interface DVLADriverData {
  driver: {
    drivingLicenceNumber: string;
    firstNames: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    address: {
      unstructuredAddress: {
        line1: string;
        line2?: string;
        line3?: string;
        line4?: string;
        line5?: string;
        postcode: string;
      };
    };
  };
  licence: {
    type: string;
    status: string;
  };
  entitlement: Array<{
    categoryCode: string;
    categoryLegalLiteral: string;
    categoryType: string;
    fromDate: string;
    expiryDate: string;
    restrictions?: Array<{
      restrictionCode: string;
      restrictionLiteral: string;
    }>;
  }>;
  endorsements?: Array<{
    offenceCode: string;
    offenceLegalLiteral: string;
    offenceDate: string;
    penaltyPoints: number;
  }>;
  token: {
    validFromDate: string;
    validToDate: string;
    issueNumber: string;
  };
}

export interface DVLAMOTHistoryData {
  registration: string;
  make: string;
  model: string;
  firstUsedDate: string;
  fuelType: string;
  primaryColour: string;
  motTests: Array<{
    completedDate: string;
    testResult: string;
    expiryDate?: string;
    odometerValue?: string;
    odometerUnit?: string;
    motTestNumber?: string;
    defects?: Array<{
      text: string;
      type: string;
      dangerous: boolean;
    }>;
    rfrAndComments?: Array<{
      text: string;
      type: string;
    }>;
  }>;
}

export interface DVLAApiError {
  error: string;
  message: string;
  statusCode: number;
}

interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

class DVLAApiService {
  private vehicleApiKey: string;
  private motApiKey: string;
  private motClientId: string;
  private motClientSecret: string;
  private motScopeUrl: string;
  private motTokenUrl: string;
  private motHistoryApiBaseUrl: string;
  private cachedToken: OAuthToken | null = null;

  constructor(
    vehicleApiKey: string,
    motApiKey: string = '',
    motClientId: string = '',
    motClientSecret: string = '',
    motScopeUrl: string = '',
    motTokenUrl: string = '',
    motHistoryApiBaseUrl: string = ''
  ) {
    this.vehicleApiKey = vehicleApiKey;
    this.motApiKey = motApiKey;
    this.motClientId = motClientId;
    this.motClientSecret = motClientSecret;
    this.motScopeUrl = motScopeUrl;
    this.motTokenUrl = motTokenUrl;
    this.motHistoryApiBaseUrl = motHistoryApiBaseUrl;
  }

  /**
   * Get OAuth access token for MOT History API
   * @returns Promise with access token or error
   */
  private async _getOAuthToken(): Promise<string | DVLAApiError> {
    try {
      // Check if we have a valid cached token
      if (this.cachedToken && this.cachedToken.expires_at > Date.now()) {
        return this.cachedToken.access_token;
      }

      if (!this.motClientId || !this.motClientSecret || !this.motTokenUrl || !this.motScopeUrl) {
        return {
          error: 'CONFIGURATION_ERROR',
          message: 'MOT History API credentials not configured. Please check your environment variables.',
          statusCode: 401
        };
      }

      const tokenData = new URLSearchParams();
      tokenData.append('grant_type', 'client_credentials');
      tokenData.append('client_id', this.motClientId);
      tokenData.append('client_secret', this.motClientSecret);
      tokenData.append('scope', this.motScopeUrl);

      const response = await axios.post(this.motTokenUrl, tokenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      });

      const tokenResponse = response.data;
      
      // Cache the token with expiry time
      this.cachedToken = {
        access_token: tokenResponse.access_token,
        token_type: tokenResponse.token_type,
        expires_in: tokenResponse.expires_in,
        expires_at: Date.now() + (tokenResponse.expires_in * 1000) - 60000 // Subtract 1 minute for safety
      };

      return this.cachedToken.access_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          let message = 'Failed to obtain OAuth token';

          switch (statusCode) {
            case 400:
              message = 'Invalid OAuth request - check client credentials';
              break;
            case 401:
              message = 'Unauthorized - check client ID and secret';
              break;
            case 403:
              message = 'Access forbidden - insufficient permissions';
              break;
            case 500:
              message = 'OAuth service temporarily unavailable';
              break;
          }

          return {
            error: 'OAUTH_ERROR',
            message,
            statusCode
          };
        } else if (error.request) {
          return {
            error: 'NETWORK_ERROR',
            message: 'Unable to connect to OAuth service',
            statusCode: 0
          };
        }
      }

      return {
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during OAuth authentication',
        statusCode: 500
      };
    }
  }

  /**
   * Get MOT history from DVLA MOT History API
   * @param registrationNumber - Vehicle registration number
   * @returns Promise with MOT history data or error
   */
  async getMOTHistory(registrationNumber: string): Promise<DVLAMOTHistoryData | DVLAApiError> {
    try {
      // Clean and format registration number
      const cleanedReg = registrationNumber.replace(/\s+/g, '').toUpperCase();
      
      if (!this.isValidRegistrationFormat(cleanedReg)) {
        return {
          error: 'INVALID_FORMAT',
          message: 'Invalid UK registration number format',
          statusCode: 400
        };
      }

      // Get OAuth access token
      const tokenResult = await this._getOAuthToken();
      if (typeof tokenResult !== 'string') {
        return tokenResult; // Return the error
      }

      const accessToken = tokenResult;

      if (!this.motHistoryApiBaseUrl) {
        return {
          error: 'CONFIGURATION_ERROR',
          message: 'MOT History API base URL not configured',
          statusCode: 500
        };
      }

      const response = await axios.get(
        `${this.motHistoryApiBaseUrl}/${cleanedReg}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-api-key': this.motApiKey || this.motClientId,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000 // 15 second timeout for MOT history
        }
      );

      return response.data as DVLAMOTHistoryData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const statusCode = error.response.status;
          let message = 'Unknown error occurred';

          switch (statusCode) {
            case 400:
              message = 'Invalid request - check registration number format';
              break;
            case 401:
              message = 'Unauthorized - authentication failed';
              break;
            case 403:
              message = 'Access forbidden - insufficient permissions';
              break;
            case 404:
              message = 'MOT history not found for this vehicle';
              break;
            case 429:
              message = 'Rate limit exceeded - please try again later';
              break;
            case 500:
              message = 'MOT History service temporarily unavailable';
              break;
            case 503:
              message = 'MOT History service maintenance - please try again later';
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
            message: 'Unable to connect to MOT History service',
            statusCode: 0
          };
        }
      }

      return {
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  }

  /**
   * Get vehicle information from DVLA API
   * @param registrationNumber - Vehicle registration number (e.g., "AB12CDE")
   * @returns Promise with vehicle data or error
   */
  async getVehicleInfo(registrationNumber: string): Promise<DVLAVehicleData | DVLAApiError> {
    try {
      // Clean and format registration number
      const cleanedReg = registrationNumber.replace(/\s+/g, '').toUpperCase();
      
      if (!this.isValidRegistrationFormat(cleanedReg)) {
        return {
          error: 'INVALID_FORMAT',
          message: 'Invalid UK registration number format',
          statusCode: 400
        };
      }

      const response = await axios.post(
        `${DVLA_VEHICLE_API_BASE_URL}/vehicles`,
        {
          registrationNumber: cleanedReg
        },
        {
          headers: {
            'x-api-key': this.vehicleApiKey,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      return response.data as DVLAVehicleData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // API returned an error response
          const statusCode = error.response.status;
          let message = 'Unknown error occurred';

          switch (statusCode) {
            case 400:
              message = 'Invalid request - check registration number format';
              break;
            case 403:
              message = 'Access forbidden - check API key';
              break;
            case 404:
              message = 'Vehicle not found in DVLA database';
              break;
            case 429:
              message = 'Rate limit exceeded - please try again later';
              break;
            case 500:
              message = 'DVLA service temporarily unavailable';
              break;
            case 503:
              message = 'DVLA service maintenance - please try again later';
              break;
          }

          return {
            error: 'API_ERROR',
            message,
            statusCode
          };
        } else if (error.request) {
          // Network error
          return {
            error: 'NETWORK_ERROR',
            message: 'Unable to connect to DVLA service',
            statusCode: 0
          };
        }
      }

      return {
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  }

  /**
   * Get driver license information from DVLA API
   * @param drivingLicenceNumber - UK driving license number
   * @param includeCPC - Include CPC information (default: false)
   * @param includeTacho - Include tachograph information (default: false)
   * @param acceptPartialResponse - Accept partial response (default: false)
   * @returns Promise with driver data or error
   */
  async getDriverInfo(
    drivingLicenceNumber: string,
    includeCPC: boolean = false,
    includeTacho: boolean = false,
    acceptPartialResponse: boolean = false
  ): Promise<DVLADriverData | DVLAApiError> {
    try {
      // Clean and format license number
      const cleanedLicense = drivingLicenceNumber.replace(/\s+/g, '').toUpperCase();
      
      if (!this.isValidLicenseFormat(cleanedLicense)) {
        return {
          error: 'INVALID_FORMAT',
          message: 'Invalid UK driving license number format',
          statusCode: 400
        };
      }

      const response = await axios.post(
        `${DVLA_DRIVER_API_BASE_URL}/driving-licences/retrieve`,
        {
          drivingLicenceNumber: cleanedLicense,
          includeCPC,
          includeTacho,
          acceptPartialResponse: acceptPartialResponse.toString()
        },
        {
          headers: {
            'Authorization': `Bearer ${this.vehicleApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      return response.data as DVLADriverData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // API returned an error response
          const statusCode = error.response.status;
          let message = 'Unknown error occurred';

          switch (statusCode) {
            case 400:
              message = 'Invalid request - check license number format';
              break;
            case 401:
              message = 'Unauthorized - check API key';
              break;
            case 403:
              message = 'Access forbidden - insufficient permissions';
              break;
            case 404:
              message = 'License not found in DVLA database';
              break;
            case 429:
              message = 'Rate limit exceeded - please try again later';
              break;
            case 500:
              message = 'DVLA service temporarily unavailable';
              break;
            case 503:
              message = 'DVLA service maintenance - please try again later';
              break;
          }

          return {
            error: 'API_ERROR',
            message,
            statusCode
          };
        } else if (error.request) {
          // Network error
          return {
            error: 'NETWORK_ERROR',
            message: 'Unable to connect to DVLA service',
            statusCode: 0
          };
        }
      }

      return {
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
        statusCode: 500
      };
    }
  }

  /**
   * Validate UK driving license number format
   * @param licenseNumber - License number to validate
   * @returns boolean indicating if format is valid
   */
  private isValidLicenseFormat(licenseNumber: string): boolean {
    // UK driving license format: 5 letters + 6 digits + 2 letters + 2 digits
    // Example: TCAEU610267NO9EK
    const pattern = /^[A-Z]{5}[0-9]{6}[A-Z]{2}[0-9]{2}$/;
    return pattern.test(licenseNumber);
  }

  /**
   * Validate UK registration number format
   * @param registration - Registration number to validate
   * @returns boolean indicating if format is valid
   */
  private isValidRegistrationFormat(registration: string): boolean {
    // UK registration patterns:
    // Current format: AB12CDE (2 letters, 2 numbers, 3 letters)
    // Prefix format: A123BCD (1 letter, 1-3 numbers, 3 letters)
    // Suffix format: ABC123D (3 letters, 1-3 numbers, 1 letter)
    // And other historical formats

    const patterns = [
      /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/, // Current format: AB12CDE
      /^[A-Z][0-9]{1,3}[A-Z]{3}$/, // Prefix format: A123BCD
      /^[A-Z]{3}[0-9]{1,3}[A-Z]$/, // Suffix format: ABC123D
      /^[A-Z]{1,3}[0-9]{1,4}$/, // Early formats: A1, AB12, ABC1234
      /^[0-9]{1,4}[A-Z]{1,3}$/, // Reverse early formats: 1A, 12AB
    ];

    return patterns.some(pattern => pattern.test(registration));
  }

  /**
   * Check if driving license is valid and current
   * @param driverData - DVLA driver data
   * @returns boolean indicating if license is valid
   */
  static isLicenseValid(driverData: DVLADriverData): boolean {
    if (driverData.licence.status !== 'Valid') {
      return false;
    }
    
    const expiryDate = new Date(driverData.token.validToDate);
    return expiryDate > new Date();
  }

  /**
   * Check if driver has valid entitlement for specific category
   * @param driverData - DVLA driver data
   * @param categoryCode - License category code (e.g., 'B', 'C', 'D')
   * @returns boolean indicating if driver has valid entitlement
   */
  static hasValidEntitlement(driverData: DVLADriverData, categoryCode: string): boolean {
    const entitlement = driverData.entitlement.find(e => e.categoryCode === categoryCode);
    if (!entitlement) {
      return false;
    }
    
    const expiryDate = new Date(entitlement.expiryDate);
    return expiryDate > new Date();
  }

  /**
   * Get total penalty points on license
   * @param driverData - DVLA driver data
   * @returns total penalty points
   */
  static getTotalPenaltyPoints(driverData: DVLADriverData): number {
    if (!driverData.endorsements) {
      return 0;
    }
    
    return driverData.endorsements.reduce((total, endorsement) => {
      return total + endorsement.penaltyPoints;
    }, 0);
  }

  /**
   * Get driver age from date of birth
   * @param driverData - DVLA driver data
   * @returns age in years
   */
  static getDriverAge(driverData: DVLADriverData): number {
    const birthDate = new Date(driverData.driver.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Check if vehicle tax is valid
   * @param vehicleData - DVLA vehicle data
   * @returns boolean indicating if tax is valid
   */
  static isTaxValid(vehicleData: DVLAVehicleData): boolean {
    if (vehicleData.taxStatus === 'Taxed') {
      if (vehicleData.taxDueDate) {
        const taxDueDate = new Date(vehicleData.taxDueDate);
        return taxDueDate > new Date();
      }
      return true;
    }
    return false;
  }

  /**
   * Check if vehicle MOT is valid
   * @param vehicleData - DVLA vehicle data
   * @returns boolean indicating if MOT is valid
   */
  static isMOTValid(vehicleData: DVLAVehicleData): boolean {
    if (vehicleData.motStatus === 'Valid') {
      if (vehicleData.motExpiryDate) {
        const motExpiryDate = new Date(vehicleData.motExpiryDate);
        return motExpiryDate > new Date();
      }
      return true;
    }
    return false;
  }

  /**
   * Get vehicle age in years
   * @param vehicleData - DVLA vehicle data
   * @returns number of years since manufacture
   */
  static getVehicleAge(vehicleData: DVLAVehicleData): number {
    const currentYear = new Date().getFullYear();
    return currentYear - vehicleData.yearOfManufacture;
  }

  /**
   * Format registration number for display
   * @param registration - Raw registration number
   * @returns Formatted registration number
   */
  static formatRegistration(registration: string): string {
    const cleaned = registration.replace(/\s+/g, '').toUpperCase();
    
    // Format current style: AB12CDE -> AB12 CDE
    if (/^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(cleaned)) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    }
    
    // Format prefix style: A123BCD -> A123 BCD
    if (/^[A-Z][0-9]{1,3}[A-Z]{3}$/.test(cleaned)) {
      const match = cleaned.match(/^([A-Z][0-9]{1,3})([A-Z]{3})$/);
      return match ? `${match[1]} ${match[2]}` : cleaned;
    }
    
    // Return as-is for other formats
    return cleaned;
  }

  /**
   * Get MOT test result status color
   * @param testResult - MOT test result
   * @returns CSS color class
   */
  static getMOTResultColor(testResult: string): string {
    switch (testResult.toLowerCase()) {
      case 'passed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'advisory':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Format MOT test date for display
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  static formatMOTDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  /**
   * Get defect severity color
   * @param dangerous - Whether the defect is dangerous
   * @returns CSS color class
   */
  static getDefectSeverityColor(dangerous: boolean): string {
    return dangerous ? 'text-red-600' : 'text-yellow-600';
  }
}

// Export a default instance (API keys should be set via environment variables)
export const dvlaApi = new DVLAApiService(
  import.meta.env.VITE_DVLA_VEHICLE_API_KEY || '',
  import.meta.env.VITE_DVLA_MOT_API_KEY || '',
  import.meta.env.VITE_DVLA_MOT_CLIENT_ID || '',
  import.meta.env.VITE_DVLA_MOT_CLIENT_SECRET || '',
  import.meta.env.VITE_DVLA_MOT_SCOPE_URL || '',
  import.meta.env.VITE_DVLA_MOT_TOKEN_URL || '',
  import.meta.env.VITE_DVLA_MOT_HISTORY_API_BASE_URL || ''
);

export default DVLAApiService;