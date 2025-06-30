export type Disaster = {
  url: string;
  chunk_number: number;
  time: string;
  people_affected: number;
  disaster: string;
  location: string;
  people_supported: number;
  organizations: string[];
  metadata: {
    chunk_size: number;
    crawled_at: string;
    url_path: string;
  };
};

export type Stats = {
  disaster_count: number;
  people_affected: number;
  people_supported: number;
};

import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface DisasterEvent {
  id: string;
  longitude: number;
  latitude: number;
  depth?: number;
  place: string;          // Added here
  magnitude: number;
  time: number;
  tsunami?: number;
  url?: string;
  detailUrl?: string;
  disaster_type: string;
}