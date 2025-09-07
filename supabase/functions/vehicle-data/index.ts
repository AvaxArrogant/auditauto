// Supabase Edge Function: vehicle-data.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

serve(async (req) => {
  console.log("Incoming request", {
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("VEHICLE_DATA_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: "Configuration error",
        message: "VEHICLE_DATA_API_KEY not set in environment variables"
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const bodyText = await req.text();
    if (!bodyText.trim()) {
      return new Response(JSON.stringify({
        error: "Empty request body",
        message: "Missing registration or dataType"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(bodyText);
      console.log("Parsed body:", parsedBody);
    } catch (err) {
      return new Response(JSON.stringify({
        error: "Invalid JSON",
        message: "Failed to parse request body"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { registration, dataType = "basic" } = parsedBody;
    if (!registration) {
      return new Response(JSON.stringify({
        error: "Missing registration",
        message: "Field 'registration' is required"
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const cleanedReg = registration.replace(/\s+/g, "").toUpperCase();
    const endpointMap = {
      basic: "VehicleData/Basic",
      mot: "VehicleData/MOT",
      technical: "VehicleData/Technical",
      valuation: "VehicleData/Valuation",
      full: "r2/lookup"
    };

    const endpoint = endpointMap[dataType];
    if (!endpoint) {
      return new Response(JSON.stringify({
        error: "Invalid dataType",
        message: `Supported values: ${Object.keys(endpointMap).join(", ")}`
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let apiUrl = `https://uk.api.vehicledataglobal.com/${endpoint}?ApiKey=${apiKey}`;
    if (dataType === "full") {
      apiUrl += `&PackageName=VDICheck&Vrm=${cleanedReg}`;
    } else {
      apiUrl += `&registration=${cleanedReg}`;
    }

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    const rawText = await response.text();
    console.log(`Vehicle API response (${dataType}) for [${cleanedReg}]:`, rawText);

    if (!rawText.trim()) {
      return new Response(JSON.stringify({
        error: "Empty response from vehicle data provider",
        message: "The external API returned no content"
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let vehicleData;
    try {
      vehicleData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("JSON parse failed:", parseError);
      return new Response(JSON.stringify({
        error: "Malformed JSON from external API",
        message: "Failed to parse vehicle data response"
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: "Vehicle Data API error",
        message: vehicleData?.message || "Failed to fetch data",
        details: vehicleData
      }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const result = transformVehicleData(vehicleData, dataType);

    // Optional: log to Supabase
    try {
      await fetch(`${Deno.env.get("SUPABASE_EDGE_URL")}/vehicle-data-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": req.headers.get("Authorization") || ""
        },
        body: JSON.stringify({
          registration: cleanedReg,
          timestamp: new Date().toISOString(),
          submission_id: crypto.randomUUID()
        })
      });
    } catch (logErr) {
      console.warn("Failed to log vehicle lookup to Supabase:", logErr);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

function transformVehicleData(data: any, dataType: string) {
  if (dataType === "full") {
    try {
      const results = data.Results || {};
      const vehicleDetails = results.VehicleDetails || {};
      const modelDetails = results.ModelDetails || {};
      const motHistory = results.MotHistoryDetails || {};
      const financeDetails = results.FinanceDetails || {};
      const mileageCheck = results.MileageCheckDetails || {};
      const miaftrDetails = results.MiaftrDetails || {};
      const pncDetails = results.PncDetails || {};

      let motIsValid = false;
      if (motHistory.MotDueDate) {
        motIsValid = new Date(motHistory.MotDueDate) > new Date();
      }

      let taxIsValid = Boolean(vehicleDetails.VehicleStatus?.VehicleExciseDutyDetails);

      const isStolen = pncDetails?.IsStolen || false;
      const hasWriteOff = miaftrDetails?.WriteOffRecordList?.length > 0;
      const writeOffCategory = hasWriteOff ? miaftrDetails.WriteOffRecordList[0]?.Category : null;
      const hasOutstandingFinance = financeDetails?.FinanceRecordList?.length > 0;
      const hasMileageDiscrepancy = mileageCheck?.MileageAnomalyDetected || false;

      let riskLevel = "low";
      const riskAlerts: string[] = [];

      if (isStolen) {
        riskLevel = "high";
        riskAlerts.push("Vehicle reported as stolen");
      }

      if (hasWriteOff) {
        if (["A", "B"].includes(writeOffCategory)) {
          riskLevel = "high";
        } else if (riskLevel !== "high") {
          riskLevel = "medium";
        }
        riskAlerts.push(`Write-off: Category ${writeOffCategory ?? "unknown"}`);
      }

      if (hasOutstandingFinance) {
        if (riskLevel !== "high") riskLevel = "medium";
        riskAlerts.push("Outstanding finance found");
      }

      if (hasMileageDiscrepancy) {
        if (riskLevel !== "high") riskLevel = "medium";
        riskAlerts.push("Mileage discrepancy detected");
      }

      return {
        registration: vehicleDetails.VehicleIdentification?.Vrm,
        make: vehicleDetails.VehicleIdentification?.DvlaMake,
        model: vehicleDetails.VehicleIdentification?.DvlaModel,
        color: vehicleDetails.VehicleHistory?.ColourDetails?.CurrentColour,
        yearOfManufacture: vehicleDetails.VehicleIdentification?.YearOfManufacture,
        engineSize: vehicleDetails.DvlaTechnicalDetails?.EngineCapacityCc,
        fuelType: vehicleDetails.VehicleIdentification?.DvlaFuelType,
        motStatus: {
          isValid: motIsValid,
          dueDate: motHistory.MotDueDate,
          lastTestDate: motHistory.LatestTestDate
        },
        taxStatus: {
          isValid: taxIsValid,
          co2Emissions: vehicleDetails.VehicleStatus?.VehicleExciseDutyDetails?.DvlaCo2
        },
        valuation: {
          // TODO: Replace with dynamic valuation API when available
          retail: { excellent: 8500, good: 7800, average: 7200 },
          trade: { clean: 6500, average: 6000, below: 5500 },
          private: { excellent: 7800, good: 7200, average: 6800 }
        },
        history: {
          isStolen,
          isWriteOff: hasWriteOff,
          writeOffCategory,
          hasOutstandingFinance,
          hasMileageDiscrepancy,
          mileageHistory: mileageCheck?.MileageResultList || [],
          keeperChanges: vehicleDetails.VehicleHistory?.KeeperChangeList || [],
          plateChanges: vehicleDetails.VehicleHistory?.PlateChangeList || []
        },
        riskAssessment: {
          level: riskLevel,
          alerts: riskAlerts,
          description:
            riskLevel === "low"
              ? "No major issues detected"
              : riskLevel === "medium"
              ? "Some issues found"
              : "Critical issues found"
        }
      };
    } catch (e) {
      console.error("Transform error:", e);
      return {
        registration: data?.Results?.VehicleDetails?.VehicleIdentification?.Vrm || "Unknown",
        error: "Failed to parse full report"
      };
    }
  }

  return data;
}
