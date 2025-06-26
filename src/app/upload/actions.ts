"use server";

import * as XLSX from "xlsx-js-style";

const REQUIRED_COLUMNS = [
  "event_id",
  "date",
  "time",
  "location",
  "state_event",
  "disaster_type",
  "killed",
  "people_affected",
  "length_affected",
  "description",
  "metadata",
] as const;

type ValidationResult = {
  success: boolean;
  error?: {
    message: string;
    missingColumns?: string[];
    rowNumber?: number;
    columnName?: string;
  };
  data?: any[];
};

export default async function validateExcelFile(
  formData: FormData,
): Promise<ValidationResult> {
  try {
    const file = formData.get("file") as File;
    if (!file)
      return {
        success: false,
        error: { message: "No file provided" },
      };

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read workbook with style options
    const workbook = XLSX.read(buffer, {
      type: "buffer",
      cellStyles: true,
      cellDates: true,
      dateNF: "yyyy-mm-dd",
    });

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      dateNF: "yyyy-mm-dd",
    });

    if (jsonData.length === 0)
      return {
        success: false,
        error: { message: "The Excel file is empty" },
      };

    // Get headers from first row and normalize them
    const headers = (jsonData[0] as string[]).map(
      (header) => header?.toLowerCase().trim().replace(/\s+/g, "_") || "",
    );

    // Check for missing required columns
    const missingColumns = REQUIRED_COLUMNS.filter(
      (required) => !headers.includes(required),
    );

    if (missingColumns.length > 0)
      return {
        success: false,
        error: {
          message: "Missing required columns in Excel file",
          missingColumns,
        },
      };

    // Validate data types in each row
    const rows = jsonData.slice(1) as any[];
    const processedData = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // Adding 2 because 1st row is header and we're 0-based

      // Skip empty rows
      if (!row || Object.keys(row).length === 0) continue;

      // Create an object to store processed row data
      const processedRow: Record<string, any> = {};

      // Check if row has all required fields
      if (row.length !== headers.length)
        return {
          success: false,
          error: {
            message: `Row ${rowNumber} has missing data`,
            rowNumber,
          },
        };

      // Get column indices
      const columnIndices = {
        date: headers.indexOf("date"),
        time: headers.indexOf("time"),
        killed: headers.indexOf("killed"),
        peopleAffected: headers.indexOf("people_affected"),
        lengthAffected: headers.indexOf("length_affected"),
        stateEvent: headers.indexOf("state_event"),
      };

      // Validate date
      const dateValue = row[columnIndices.date];
      if (!dateValue || !Date.parse(dateValue))
        return {
          success: false,
          error: {
            message: `Invalid date format in row ${rowNumber}`,
            rowNumber,
            columnName: "date",
          },
        };
      processedRow.date = dateValue;

      // Validate time
      const timeValue = row[columnIndices.time];
      if (!timeValue || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeValue))
        return {
          success: false,
          error: {
            message: `Invalid time format in row ${rowNumber}. Use HH:MM format`,
            rowNumber,
            columnName: "time",
          },
        };
      processedRow.time = timeValue;

      // Validate numeric fields
      const numericFields = [
        { index: columnIndices.killed, name: "killed" },
        { index: columnIndices.peopleAffected, name: "people_affected" },
        { index: columnIndices.lengthAffected, name: "length_affected" },
      ];

      for (const field of numericFields) {
        const value = row[field.index];
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0)
          return {
            success: false,
            error: {
              message: `Invalid ${field.name} value in row ${rowNumber}. Must be a non-negative number`,
              rowNumber,
              columnName: field.name,
            },
          };
        processedRow[field.name] = numValue;
      }

      // Validate state_event
      const stateEventValue = row[columnIndices.stateEvent]?.toLowerCase();
      const validStates = ["continuous", "punctual"];
      if (!validStates.includes(stateEventValue))
        return {
          success: false,
          error: {
            message: `Invalid state_event in row ${rowNumber}. Must be either 'continuous' or 'punctual'`,
            rowNumber,
            columnName: "state_event",
          },
        };
      processedRow.state_event = stateEventValue;

      // Add other fields
      headers.forEach((header, index) => {
        if (!processedRow.hasOwnProperty(header))
          processedRow[header] = row[index];
      });

      processedData.push(processedRow);
    }

    return {
      success: true,
      data: processedData,
    };
  } catch (error) {
    console.error("Excel validation error:", error);
    return {
      success: false,
      error: {
        message:
          "Error processing Excel file. Please make sure it's a valid Excel file.",
      },
    };
  }
}
