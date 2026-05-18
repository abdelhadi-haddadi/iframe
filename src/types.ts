
export interface BrandData {
  name: string;
  logoUrl?: string;
  colors: string[];
  typography: {
    primary: string;
    secondary: string;
  };
}

export interface CompositionData {
  title: string;
  description: string;
  features: string[];
  domain?: string;
  instagram?: string;
  brand: BrandData;
  screenshots: {
    desktop: string; // Base64 or URL
    mobile: string;  // Base64 or URL
  };
  layout: 'luxury' | 'saas' | 'editorial' | 'minimal' | 'cinematic' | 'cinema';
  lights: {
    glowColor: string;
    intensity: number;
  };
}

export interface AnalysisResponse {
  composition: CompositionData;
  error?: string;
}
