import { useEffect, useState } from 'react';
import type { Location } from '../types/restaurant';

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서 위치 서비스를 지원하지 않습니다. mock 데이터로 표시합니다.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('위치 권한이 거부되었습니다. mock 데이터로 표시합니다.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('위치 정보를 사용할 수 없습니다. mock 데이터로 표시합니다.');
            break;
          case err.TIMEOUT:
            setError('위치 감지 시간이 초과되었습니다. mock 데이터로 표시합니다.');
            break;
          default:
            setError('알 수 없는 오류가 발생했습니다. mock 데이터로 표시합니다.');
            break;
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return { location, error, isLoading };
}
