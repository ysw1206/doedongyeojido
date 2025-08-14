/*
 * API 서비스 - 모킹 시스템 포함
 */

import {
  shouldMockEndpoint,
  loadMockConfig,
  getMockConfigInfo,
} from './mock-interceptor';

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isPublicAPI = false,
  responseType: 'json' | 'text' = 'json',
  credentialsMode: 'include' | 'same-origin' | 'omit' = 'include',
  tokenOverride?: string,
  contentType: string = 'application/json'
): Promise<T> {
  // 🎭 개발 환경에서 모킹 시스템 활성화
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      await loadMockConfig();

      // HTTP method 추출 (기본값: GET)
      const method = options.method || 'GET';

      if (shouldMockEndpoint(path, method)) {
        console.log(`🎭 Mocking endpoint: ${method} ${path}`);

        // 모킹된 엔드포인트를 Next.js API 라우트로 리다이렉트
        const mockApiPath = `/api/mock${path}`;
        const mockUrl = `${window.location.origin}${mockApiPath}`;

        // FormData 요청인지 확인 (Content-Type 헤더 보존)
        const isFormData = options.body instanceof FormData;
        const mockHeaders: Record<string, string> = {};
        
        // 기존 헤더 복사
        if (options.headers) {
          if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
              mockHeaders[key] = value;
            });
          } else if (Array.isArray(options.headers)) {
            options.headers.forEach(([key, value]) => {
              mockHeaders[key] = value;
            });
          } else {
            Object.entries(options.headers).forEach(([key, value]) => {
              mockHeaders[key] = value;
            });
          }
        }

        // FormData가 아닌 경우에만 Content-Type을 JSON으로 설정
        if (!isFormData && contentType) {
          mockHeaders['Content-Type'] = contentType;
        }

        const res = await fetch(mockUrl, {
          ...options,
          headers: mockHeaders,
        });

        // Response body를 한 번만 읽기 위해 먼저 body를 복사
        if (!res.ok) {
          let errorText: string;
          try {
            // Response를 clone해서 에러 메시지 읽기
            errorText = await res.clone().text();
          } catch (cloneError) {
            errorText = `Status: ${res.status}`;
          }
          throw new Error(`❌ Mock API 실패 (${res.status}): ${errorText}`);
        }

        if (responseType === 'text') {
          return res.text() as Promise<T>;
        }
        return res.json();
      }
    } catch (error) {
      console.warn('⚠️ Mock interceptor error:', error);
      // 모킹 실패 시 원본 API로 fallback
    }
  }

  // base url 처리
  const baseurl = process.env.NEXT_PUBLIC_API_PREFIX || '';

  const url = /^https?:\/\//.test(path) // https로 시작하는 url이 들어올 경우 baseUrl 무시
    ? path
    : `${baseurl}${path.startsWith('/') ? path : '/' + path}`; // /없으면 붙여서 오류 방지

  // 기본 headers 설정
  const headers: Record<string, string> = {};
  
  // 기존 헤더 복사
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers[key] = value;
      });
    }
  }
  
  // Content-Type 설정
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  // 인증 토큰 자동 포함
  // 인증이 필요한 경우: (isPublicAPI=false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const authToken = tokenOverride ?? token;

  if (authToken && !isPublicAPI) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: credentialsMode,
    });

    if (!res.ok) {
      let errorText: string;
      try {
        // Response를 clone해서 에러 메시지 읽기
        errorText = await res.clone().text();
      } catch (cloneError) {
        errorText = `Status: ${res.status}`;
      }
      throw new Error(`❌ API 실패 (${res.status}): ${errorText}`);
    }

    if (responseType === 'text') {
      return res.text() as Promise<T>;
    }
    return res.json();
  } catch (error) {
    console.error('API 호출 중 오류:', error);
    throw error;
  }
}

// GET 요청
export const get = <T>(
  path: string,
  params: any = null,
  isPublicAPI = false
) => {
  let url = path;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });
    url += `?${searchParams.toString()}`;
  }

  return apiFetch<T>(url, {
    method: 'GET',
  }, isPublicAPI);
};

// POST 요청
export const post = <T>(
  path: string,
  body: any,
  isPublicAPI = false,
  responseType: 'json' | 'text' = 'json',
  credentialMode?: 'include' | 'same-origin' | 'omit',
  tokenOverride?: string
) =>
  apiFetch<T>(
    path,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    isPublicAPI,
    responseType,
    credentialMode,
    tokenOverride
  );

// FormData POST 요청
export const postFormData = <T>(
  path: string,
  body: any,
  isPublicAPI = false,
  responseType: 'json' | 'text' = 'json',
  credentialMode?: 'include' | 'same-origin' | 'omit',
  tokenOverride?: string
) => {
  const formData = new FormData();
  Object.keys(body).forEach((key) => {
    if (body[key] !== undefined && body[key] !== null) {
      if (body[key] instanceof File) {
        formData.append(key, body[key]);
      } else {
        formData.append(key, String(body[key]));
      }
    }
  });

  return apiFetch<T>(
    path,
    {
      method: 'POST',
      body: formData,
    },
    isPublicAPI,
    responseType,
    credentialMode,
    tokenOverride,
    undefined // FormData는 Content-Type을 자동으로 설정
  );
};

// PUT 요청
export const put = <T>(path: string, body: any, isPublicAPI = false) =>
  apiFetch<T>(
    path,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    isPublicAPI
  );

// DELETE 요청
export const del = <T>(
  path: string,
  params: any = null,
  isPublicAPI = false
) => {
  let url = path;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, params[key]);
      }
    });
    url += `?${searchParams.toString()}`;
  }

  return apiFetch<T>(
    url,
    {
      method: 'DELETE',
    },
    isPublicAPI
  );
};

// DELETE with payload
export const delPayload = <T>(path: string, body: any, isPublicAPI = false) =>
  apiFetch<T>(
    path,
    {
      method: 'DELETE',
      body: JSON.stringify(body),
    },
    isPublicAPI
  );