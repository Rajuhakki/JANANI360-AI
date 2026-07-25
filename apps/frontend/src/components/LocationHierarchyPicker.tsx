import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Home, 
  ShieldAlert, 
  Loader2, 
  RefreshCw, 
  CheckCircle2,
  Globe
} from 'lucide-react';
import { 
  masterDataService, 
  DistrictItem, 
  TalukItem, 
  HobliItem, 
  VillageItem, 
  FacilityItem, 
  SubCenterItem, 
  CatchmentItem 
} from '../services/masterDataService';

export interface LocationSelection {
  districtId: string;
  talukId: string;
  hobliId: string;
  villageId: string;
  facilityId: string;
  subCenterId: string;
  catchmentId: string;
  district?: DistrictItem;
  taluk?: TalukItem;
  hobli?: HobliItem;
  village?: VillageItem;
  facility?: FacilityItem;
  subCenter?: SubCenterItem;
  catchment?: CatchmentItem;
}

interface LocationHierarchyPickerProps {
  onSelectionChange?: (selection: LocationSelection) => void;
  onSelectLocation?: (selection: LocationSelection) => void;
  language?: 'kn' | 'en';
  className?: string;
}

export const LocationHierarchyPicker: React.FC<LocationHierarchyPickerProps> = ({
  onSelectionChange,
  onSelectLocation,
  language = 'kn',
  className = ''
}) => {
  const [lang, setLang] = useState<'kn' | 'en'>(language);

  // Dynamic Lists from Backend APIs
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [taluks, setTaluks] = useState<TalukItem[]>([]);
  const [hoblis, setHoblis] = useState<HobliItem[]>([]);
  const [villages, setVillages] = useState<VillageItem[]>([]);
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [subCenters, setSubCenters] = useState<SubCenterItem[]>([]);
  const [catchments, setCatchments] = useState<CatchmentItem[]>([]);

  // Selected Values
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedTalukId, setSelectedTalukId] = useState<string>('');
  const [selectedHobliId, setSelectedHobliId] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedSubCenterId, setSelectedSubCenterId] = useState<string>('');
  const [selectedCatchmentId, setSelectedCatchmentId] = useState<string>('');

  // Loading States
  const [loadingDistricts, setLoadingDistricts] = useState<boolean>(false);
  const [loadingTaluks, setLoadingTaluks] = useState<boolean>(false);
  const [loadingHoblis, setLoadingHoblis] = useState<boolean>(false);
  const [loadingVillages, setLoadingVillages] = useState<boolean>(false);
  const [loadingFacilities, setLoadingFacilities] = useState<boolean>(false);
  const [loadingSubCenters, setLoadingSubCenters] = useState<boolean>(false);
  const [loadingCatchments, setLoadingCatchments] = useState<boolean>(false);

  // Error States
  const [error, setError] = useState<string | null>(null);

  // Initial Load: Fetch Districts from API
  const loadDistricts = async () => {
    try {
      setLoadingDistricts(true);
      setError(null);
      const data = await masterDataService.fetchDistricts();
      setDistricts(data);
    } catch (err: any) {
      console.error('Failed to load districts:', err);
      setError(lang === 'kn' 
        ? 'ಜಿಲ್ಲೆಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ.' 
        : 'Failed to fetch districts from database. Please check connection.');
    } finally {
      setLoadingDistricts(false);
    }
  };

  useEffect(() => {
    loadDistricts();
  }, []);

  // Fetch Taluks when District changes
  useEffect(() => {
    if (!selectedDistrictId) {
      setTaluks([]);
      setSelectedTalukId('');
      return;
    }
    const loadTaluks = async () => {
      try {
        setLoadingTaluks(true);
        setError(null);
        const data = await masterDataService.fetchTaluks(selectedDistrictId);
        setTaluks(data);
      } catch (err: any) {
        console.error('Failed to load taluks:', err);
        setError(lang === 'kn' ? 'ತಾಲೂಕುಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to fetch taluks from database.');
      } finally {
        setLoadingTaluks(false);
      }
    };
    loadTaluks();
    // Reset lower cascades
    setHoblis([]);
    setVillages([]);
    setFacilities([]);
    setSubCenters([]);
    setCatchments([]);
    setSelectedTalukId('');
    setSelectedHobliId('');
    setSelectedVillageId('');
    setSelectedFacilityId('');
    setSelectedSubCenterId('');
    setSelectedCatchmentId('');
  }, [selectedDistrictId]);

  // Fetch Hoblis & Facilities when Taluk changes
  useEffect(() => {
    if (!selectedTalukId) {
      setHoblis([]);
      setFacilities([]);
      setSelectedHobliId('');
      setSelectedFacilityId('');
      return;
    }
    const loadHoblisAndFacilities = async () => {
      try {
        setLoadingHoblis(true);
        setLoadingFacilities(true);
        setError(null);
        const [hobliData, facilityData] = await Promise.all([
          masterDataService.fetchHoblis(selectedTalukId),
          masterDataService.fetchFacilities(selectedTalukId)
        ]);
        setHoblis(hobliData);
        setFacilities(facilityData);
      } catch (err: any) {
        console.error('Failed to load hoblis/facilities:', err);
        setError(lang === 'kn' ? 'ಹೋಬಳಿ ಮತ್ತು ಆಸ್ಪತ್ರೆಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to fetch hoblis/facilities.');
      } finally {
        setLoadingHoblis(false);
        setLoadingFacilities(false);
      }
    };
    loadHoblisAndFacilities();
    // Reset lower cascades
    setVillages([]);
    setSubCenters([]);
    setCatchments([]);
    setSelectedHobliId('');
    setSelectedVillageId('');
    setSelectedFacilityId('');
    setSelectedSubCenterId('');
    setSelectedCatchmentId('');
  }, [selectedTalukId]);

  // Fetch Villages when Hobli changes
  useEffect(() => {
    if (!selectedHobliId) {
      setVillages([]);
      setSelectedVillageId('');
      return;
    }
    const loadVillages = async () => {
      try {
        setLoadingVillages(true);
        setError(null);
        const data = await masterDataService.fetchVillages(selectedHobliId);
        setVillages(data);
      } catch (err: any) {
        console.error('Failed to load villages:', err);
        setError(lang === 'kn' ? 'ಗ್ರಾಮಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to fetch villages.');
      } finally {
        setLoadingVillages(false);
      }
    };
    loadVillages();
    setSelectedVillageId('');
  }, [selectedHobliId]);

  // Fetch SubCenters when Facility changes
  useEffect(() => {
    if (!selectedFacilityId) {
      setSubCenters([]);
      setSelectedSubCenterId('');
      return;
    }
    const loadSubCenters = async () => {
      try {
        setLoadingSubCenters(true);
        setError(null);
        const data = await masterDataService.fetchSubCenters(selectedFacilityId);
        setSubCenters(data);
      } catch (err: any) {
        console.error('Failed to load subcenters:', err);
        setError(lang === 'kn' ? 'ಉಪಕೇಂದ್ರಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to fetch sub-centers.');
      } finally {
        setLoadingSubCenters(false);
      }
    };
    loadSubCenters();
    setCatchments([]);
    setSelectedSubCenterId('');
    setSelectedCatchmentId('');
  }, [selectedFacilityId]);

  // Fetch Catchments when SubCenter changes
  useEffect(() => {
    if (!selectedSubCenterId) {
      setCatchments([]);
      setSelectedCatchmentId('');
      return;
    }
    const loadCatchments = async () => {
      try {
        setLoadingCatchments(true);
        setError(null);
        const data = await masterDataService.fetchCatchments(selectedSubCenterId);
        setCatchments(data);
      } catch (err: any) {
        console.error('Failed to load catchments:', err);
        setError(lang === 'kn' ? 'ಆಶಾ ಕವರೇಜ್ ಪ್ರದೇಶಗಳ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to fetch ASHA catchments.');
      } finally {
        setLoadingCatchments(false);
      }
    };
    loadCatchments();
    setSelectedCatchmentId('');
  }, [selectedSubCenterId]);

  // Notify parent on change
  useEffect(() => {
    const selection = {
      districtId: selectedDistrictId,
      talukId: selectedTalukId,
      hobliId: selectedHobliId,
      villageId: selectedVillageId,
      facilityId: selectedFacilityId,
      subCenterId: selectedSubCenterId,
      catchmentId: selectedCatchmentId,
      district: districts.find(d => d.id === selectedDistrictId),
      taluk: taluks.find(t => t.id === selectedTalukId),
      hobli: hoblis.find(h => h.id === selectedHobliId),
      village: villages.find(v => v.id === selectedVillageId),
      facility: facilities.find(f => f.id === selectedFacilityId),
      subCenter: subCenters.find(s => s.id === selectedSubCenterId),
      catchment: catchments.find(c => c.id === selectedCatchmentId)
    };

    if (onSelectionChange) {
      onSelectionChange(selection);
    }
    if (onSelectLocation) {
      onSelectLocation(selection);
    }
  }, [
    selectedDistrictId, 
    selectedTalukId, 
    selectedHobliId, 
    selectedVillageId, 
    selectedFacilityId, 
    selectedSubCenterId, 
    selectedCatchmentId,
    onSelectionChange,
    onSelectLocation
  ]);

  const getName = (item: { nameEn: string; nameKn: string }) => {
    return lang === 'kn' ? `${item.nameKn} (${item.nameEn})` : `${item.nameEn} (${item.nameKn})`;
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl ${className}`}>
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-slate-100">
            {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಸ್ಥಳೀಯ ವೈದ್ಯಕೀಯ ಸರಹದ್ದು ಆಯ್ಕೆ (Master Hierarchy)' : 'Karnataka Health Hierarchy Selector'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          <button
            type="button"
            onClick={() => setLang(lang === 'kn' ? 'en' : 'kn')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition"
          >
            {lang === 'kn' ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ'}
          </button>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg flex items-center justify-between text-red-200 text-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadDistricts}
            className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {lang === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry'}
          </button>
        </div>
      )}

      {/* Cascading Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. District */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೧. ಜಿಲ್ಲೆ (District)' : '1. District'}
          </label>
          <div className="relative">
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              disabled={loadingDistricts}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select District --'}</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {getName(d)}
                </option>
              ))}
            </select>
            {loadingDistricts && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 2. Taluk */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೨. ತಾಲೂಕು (Taluk)' : '2. Taluk'}
          </label>
          <div className="relative">
            <select
              value={selectedTalukId}
              onChange={(e) => setSelectedTalukId(e.target.value)}
              disabled={!selectedDistrictId || loadingTaluks}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ತಾಲೂಕನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Taluk --'}</option>
              {taluks.map((t) => (
                <option key={t.id} value={t.id}>
                  {getName(t)}
                </option>
              ))}
            </select>
            {loadingTaluks && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 3. Hobli */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೩. ಹೋಬಳಿ (Hobli)' : '3. Hobli'}
          </label>
          <div className="relative">
            <select
              value={selectedHobliId}
              onChange={(e) => setSelectedHobliId(e.target.value)}
              disabled={!selectedTalukId || loadingHoblis}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಹೋಬಳಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Hobli --'}</option>
              {hoblis.map((h) => (
                <option key={h.id} value={h.id}>
                  {getName(h)}
                </option>
              ))}
            </select>
            {loadingHoblis && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 4. Village */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೪. ಗ್ರಾಮ (Village)' : '4. Village'}
          </label>
          <div className="relative">
            <select
              value={selectedVillageId}
              onChange={(e) => setSelectedVillageId(e.target.value)}
              disabled={!selectedHobliId || loadingVillages}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಗ್ರಾಮವನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Village --'}</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {getName(v)} ({v.pincode})
                </option>
              ))}
            </select>
            {loadingVillages && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 5. Primary Health Center (Facility) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೫. ಆರೋಗ್ಯ ಕೇಂದ್ರ / ಆಸ್ಪತ್ರೆ (Facility)' : '5. Health Facility'}
          </label>
          <div className="relative">
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              disabled={!selectedTalukId || loadingFacilities}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಆರೋಗ್ಯ ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Facility --'}</option>
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  [{f.tier}] {getName(f)}
                </option>
              ))}
            </select>
            {loadingFacilities && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 6. Sub-Center */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೬. ಉಪಕೇಂದ್ರ (Sub-Center)' : '6. Sub-Center'}
          </label>
          <div className="relative">
            <select
              value={selectedSubCenterId}
              onChange={(e) => setSelectedSubCenterId(e.target.value)}
              disabled={!selectedFacilityId || loadingSubCenters}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಉಪಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select Sub-Center --'}</option>
              {subCenters.map((s) => (
                <option key={s.id} value={s.id}>
                  {getName(s)}
                </option>
              ))}
            </select>
            {loadingSubCenters && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>

        {/* 7. ASHA Catchment */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {lang === 'kn' ? '೭. ಆಶಾ ಕವರೇಜ್ ಪ್ರದೇಶ (ASHA Catchment)' : '7. ASHA Catchment Area'}
          </label>
          <div className="relative">
            <select
              value={selectedCatchmentId}
              onChange={(e) => setSelectedCatchmentId(e.target.value)}
              disabled={!selectedSubCenterId || loadingCatchments}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <option value="">{lang === 'kn' ? '-- ಆಶಾ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ --' : '-- Select ASHA Catchment --'}</option>
              {catchments.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Pop: {c.population})
                </option>
              ))}
            </select>
            {loadingCatchments && (
              <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-emerald-400 animate-spin" />
            )}
          </div>
        </div>
      </div>

      {/* Selected Location Summary Badge */}
      {selectedDistrictId && selectedTalukId && selectedVillageId && (
        <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            {lang === 'kn' ? 'ಸ್ಥಳ ಆಯ್ಕೆ ಯಶಸ್ವಿಯಾಗಿದೆ:' : 'Active Location Selected:'}{' '}
            <strong>
              {districts.find(d => d.id === selectedDistrictId)?.nameKn || districts.find(d => d.id === selectedDistrictId)?.nameEn} {' > '}
              {taluks.find(t => t.id === selectedTalukId)?.nameKn || taluks.find(t => t.id === selectedTalukId)?.nameEn} {' > '}
              {villages.find(v => v.id === selectedVillageId)?.nameKn || villages.find(v => v.id === selectedVillageId)?.nameEn}
            </strong>
          </span>
        </div>
      )}
    </div>
  );
};
