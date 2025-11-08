export interface FormState {
  nume: string;
  prenume: string;
  location: string;
  email: string;
  description: string;
  photo: File | null; // JPG sau orice alt fișier
}
