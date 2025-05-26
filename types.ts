
export interface User {
  id: string;
  username: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number; // in bytes
  uploadDate: Date;
}

export interface HistoryEntry {
  id: string;
  action: string;
  timestamp: Date;
  details?: string;
}

export enum AppScreen {
  Login = "/login",
  Register = "/register",
  FileManagement = "/files",
  ZipDownload = "/zip",
  History = "/history",
  Home = "/" 
}
