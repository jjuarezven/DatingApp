import { Photo } from './Photo';

export interface User {
  id: number;
  username: string;
  age: number;
  gender: string;
  knowAs: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos: Photo[];
}
