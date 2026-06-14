export interface LinkResponse {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clickCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  ownerEmail: string;
}

export interface CreateLinkRequest {
  originalUrl: string;
  shortCode?: string;
  expiresAt?: string;
}

export interface UpdateLinkRequest {
  originalUrl: string;
  expiresAt?: string | null;
  isActive: boolean;
}

export interface CreateAnonymousLinkRequest {
  originalUrl: string;
}
