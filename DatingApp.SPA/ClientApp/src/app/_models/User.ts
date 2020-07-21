import { Photo } from './Photo';

export interface User {
  id: number;
  userName: string;
  age: number;
  gender: string;
  knowAs: string;
  created: Date;
  lastActive: any;
  photoUrl: string;
  city: string;
  country: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  roles?: string[];
  photos: Photo[];
}
