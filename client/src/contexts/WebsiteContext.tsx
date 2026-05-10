import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { websiteApi } from '../api/websiteApi';
import { productApi } from '../api/productApi';
import { certificationApi } from '../api/certificationApi';
import { specialityApi } from '../api/specialityApi';
import { coreValueApi } from '../api/coreValueApi';
import { sectionImageApi } from '../api/sectionImageApi';

interface WebsiteData {
  settings: any;
  products: any[];
  certifications: any[];
  specialities: any[];
  coreValues: any[];
  heroImages: any[];
  aboutImages: any[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const WebsiteContext = createContext<WebsiteData>({
  settings: null, products: [], certifications: [], specialities: [], coreValues: [],
  heroImages: [], aboutImages: [],
  loading: true, refresh: async () => {},
});

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [coreValues, setCoreValues] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [aboutImages, setAboutImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [settingsRes, productsRes, certsRes, specsRes, valuesRes, heroRes, aboutRes] = await Promise.all([
        websiteApi.getSettings(),
        productApi.getAll(),
        certificationApi.getAll(),
        specialityApi.getAll(),
        coreValueApi.getAll(),
        sectionImageApi.getBySection('hero'),
        sectionImageApi.getBySection('about'),
      ]);
      setSettings(settingsRes.data.data);
      setProducts(productsRes.data.data || []);
      setCertifications(certsRes.data.data || []);
      setSpecialities(specsRes.data.data || []);
      setCoreValues(valuesRes.data.data || []);
      setHeroImages(heroRes.data.data || []);
      setAboutImages(aboutRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch website data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <WebsiteContext.Provider value={{ settings, products, certifications, specialities, coreValues, heroImages, aboutImages, loading, refresh: fetchAll }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export const useWebsite = () => useContext(WebsiteContext);
