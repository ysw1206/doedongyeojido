declare global {
  interface Window {
    kakao: {
      maps: {
        Map: any;
        LatLng: any;
        LatLngBounds: any;
        Marker: any;
        InfoWindow: any;
        MarkerClusterer?: any;
        CustomOverlay?: any;
        Polyline?: any;
        Polygon?: any;
        Circle?: any;
        Size: any;
        Point: any;
        MarkerImage: any;
        event: {
          addListener: (target: any, type: string, handler: () => void) => void;
        };
        load: (callback: () => void) => void;
        services?: {
          Geocoder: any;
          Places: any;
        };
      };
    };
  }
}

export {};