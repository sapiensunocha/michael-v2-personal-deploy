export type DisasterFormData = {
  date: string;
  time: string;
  location: string;
  stateEvent: "continuous" | "punctual";
  disasterType: string;
  impact: {
    killed: number;
    peopleAffected: number;
    lengthAffected: number;
  };
  description: string;
  metadata: string;
  file: FileList;
  // New fields for Link/API
  apiUrl?: string;
  apiKey?: string;
  headers?: string;
};

