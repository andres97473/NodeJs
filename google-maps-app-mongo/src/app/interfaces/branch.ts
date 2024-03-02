export interface Branch {
  name: string;
  email: string;
  address: Address;
  distance?: number;
  avatar?: string;
  _id?: string;
}

export interface Address {
  street: string;
  location: Location;
  country?: string;
  country_code?: string;
  _id?: string;
}

export interface Location {
  coordinates: number[];
  is_location_exact: boolean;
  type: string;
}
