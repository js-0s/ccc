import { useData } from './data';
import { MapMarker } from '@/components/map-marker';

export function UserLocation() {
  const { user } = useData();
  return (
    <MapMarker
      location={user.location}
      height={200}
      popupContent={
        <>
          <h1>{user.name}</h1>
        </>
      }
    />
  );
}
