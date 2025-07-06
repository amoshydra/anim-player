export interface MarkerUnprocessed {
  dr: number;
  tm: number;
  cm: string;
}

export interface Marker {
  duration: number;
  time: number;
  payload: {
    name: string;
  }
}