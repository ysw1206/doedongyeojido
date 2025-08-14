/**
 * API 모킹 인터셉터
 * 개발 환경에서 특정 엔드포인트를 모킹하여 안정적인 프론트엔드 개발을 지원
 */

interface MockEndpointConfig {
  enabled: boolean;
  dataFile: string;
  delay?: number;
  description?: string;
  pattern?: boolean; // URL 패턴 매칭 지원 여부
  exclude?: string[]; // 패턴 매칭에서 제외할 경로들
}

interface MockMethodConfig {
  [method: string]: MockEndpointConfig;
}

interface MockConfig {
  enabled: boolean;
  description?: string;
  mockedEndpoints: Record<string, MockMethodConfig>;
}

let mockConfig: MockConfig | null = null;

/**
 * 모킹 설정 파일을 로드합니다
 */
export async function loadMockConfig(): Promise<MockConfig> {
  if (!mockConfig) {
    try {
      // Next.js 환경에서 정적 JSON 파일 import
      const config = await import('@/config/mock-config.json');
      mockConfig = config.default;
      console.log('🎭 Mock configuration loaded:', mockConfig);
    } catch (error) {
      console.warn('⚠️ Failed to load mock configuration:', error);
      // 기본 설정으로 fallback
      mockConfig = {
        enabled: false,
        mockedEndpoints: {},
      };
    }
  }
  return mockConfig;
}

/**
 * URL에서 쿼리 파라미터를 제거하여 base path를 추출합니다
 * @param path 전체 URL 경로 (쿼리 포함)
 * @returns 쿼리 파라미터가 제거된 base path
 */
export function extractBasePath(path: string): string {
  return path.split('?')[0];
}

/**
 * URL 패턴을 정규식으로 변환합니다
 * @param pattern URL 패턴 (예: '/api/places/:id')
 * @returns 정규식 패턴
 */
function patternToRegex(pattern: string): RegExp {
  // :param 형태를 정규식으로 변환 (슬래시 제외한 모든 문자)
  const regexPattern = pattern.replace(/:([^/]+)/g, '([^/]+)');
  return new RegExp(`^${regexPattern}$`);
}

/**
 * URL이 특정 패턴과 매칭되는지 확인합니다
 * @param url 실제 URL 경로
 * @param pattern URL 패턴
 * @returns 매칭 여부
 */
function matchesPattern(url: string, pattern: string): boolean {
  const regex = patternToRegex(pattern);
  return regex.test(url);
}

/**
 * 설정된 엔드포인트 중에서 URL과 매칭되는 것을 찾습니다
 * @param path URL 경로
 * @param method HTTP Method
 * @returns 매칭된 설정 정보 (패턴 키, 설정)
 */
function findMatchingEndpoint(
  path: string,
  method: string
): {
  patternKey: string;
  config: MockEndpointConfig;
} | null {
  if (!mockConfig?.mockedEndpoints) return null;

  const upperMethod = method.toUpperCase();
  
  console.log('🔍 findMatchingEndpoint called:', { path, method: upperMethod });

  // 1. 정확한 경로 매칭 우선 시도 (패턴보다 우선)
  const exactMatch = mockConfig.mockedEndpoints[path];
  if (exactMatch?.[upperMethod]?.enabled) {
    console.log('✅ Exact match found:', path);
    return {
      patternKey: path,
      config: exactMatch[upperMethod],
    };
  }

  // 2. 패턴 매칭 시도
  console.log('🔄 Trying pattern matching...');
  for (const [patternKey, methodConfig] of Object.entries(
    mockConfig.mockedEndpoints
  )) {
    const methodConfig_ = methodConfig as MockMethodConfig;
    const endpointConfig = methodConfig_[upperMethod];

    console.log('🧪 Testing pattern:', { 
      patternKey, 
      hasMethodConfig: !!endpointConfig,
      isEnabled: endpointConfig?.enabled,
      hasPattern: endpointConfig?.pattern 
    });

    if (endpointConfig?.enabled && endpointConfig.pattern) {
      // 제외 패턴 확인
      if (endpointConfig.exclude) {
        const isExcluded = endpointConfig.exclude.some((excludePattern) =>
          matchesPattern(path, excludePattern)
        );
        if (isExcluded) {
          console.log('❌ Excluded by pattern:', { patternKey, excludePatterns: endpointConfig.exclude });
          continue;
        }
      }

      // 패턴 매칭 확인
      const isMatch = matchesPattern(path, patternKey);
      console.log('🎯 Pattern match result:', { 
        patternKey, 
        path, 
        isMatch,
        regex: patternToRegex(patternKey).source
      });
      
      if (isMatch) {
        console.log('✅ Pattern match found:', patternKey);
        return {
          patternKey,
          config: endpointConfig,
        };
      }
    }
  }

  console.log('❌ No match found for:', { path, method: upperMethod });
  return null;
}

/**
 * 특정 엔드포인트가 모킹되어야 하는지 확인합니다
 * @param path URL 경로
 * @param method HTTP Method
 * @returns 모킹 여부
 */
export function shouldMockEndpoint(
  path: string,
  method: string = 'GET'
): boolean {
  if (!mockConfig?.enabled) return false;

  console.log('Full path:', path);
  console.log('Extracted base path:', extractBasePath(path));

  const basePath = extractBasePath(path);
  const match = findMatchingEndpoint(basePath, method);

  return match !== null;
}

/**
 * 모킹 데이터 파일 경로를 가져옵니다
 * @param path URL 경로
 * @param method HTTP Method
 * @returns 모킹 데이터 파일 경로
 */
export function getMockDataPath(
  path: string,
  method: string = 'GET'
): string | null {
  const basePath = extractBasePath(path);
  const match = findMatchingEndpoint(basePath, method);

  if (!match) return null;

  return `mock-data${match.config.dataFile}`;
}

/**
 * 모킹 지연 시간을 가져옵니다
 * @param path URL 경로
 * @param method HTTP Method
 * @returns 지연 시간 (ms)
 */
export function getMockDelay(path: string, method: string = 'GET'): number {
  const basePath = extractBasePath(path);
  const match = findMatchingEndpoint(basePath, method);

  return match?.config.delay || 0;
}

/**
 * 모킹이 전역적으로 활성화되어 있는지 확인합니다
 * @returns 모킹 활성화 여부
 */
export function isMockingEnabled(): boolean {
  return mockConfig?.enabled || false;
}

/**
 * 모킹 설정을 다시 로드합니다
 * @returns 새로운 모킹 설정
 */
export async function reloadMockConfig(): Promise<MockConfig> {
  mockConfig = null;
  return loadMockConfig();
}

/**
 * 현재 모킹 설정 정보를 가져옵니다
 * @returns 모킹 설정 정보
 */
export function getMockConfigInfo(): {
  enabled: boolean;
  endpointCount: number;
  activeEndpoints: string[];
} {
  if (!mockConfig) {
    return {
      enabled: false,
      endpointCount: 0,
      activeEndpoints: [],
    };
  }

  const activeEndpoints: string[] = [];
  let endpointCount = 0;

  for (const [path, methodConfig] of Object.entries(
    mockConfig.mockedEndpoints
  )) {
    const methodConfig_ = methodConfig as MockMethodConfig;
    for (const [method, config] of Object.entries(methodConfig_)) {
      if (config.enabled) {
        activeEndpoints.push(`${method} ${path}`);
        endpointCount++;
      }
    }
  }

  return {
    enabled: mockConfig.enabled,
    endpointCount,
    activeEndpoints,
  };
} 

export function testPatternMatching(url: string, pattern: string): void {
  console.log('🧪 Testing pattern matching:');
  console.log('URL:', url);
  console.log('Pattern:', pattern);
  
  const regex = patternToRegex(pattern);
  console.log('Generated Regex:', regex.source);
  console.log('Full Regex:', regex);
  
  const result = regex.test(url);
  console.log('Match Result:', result);
  
  // 실제 매치된 그룹들도 확인
  const match = url.match(regex);
  console.log('Match Groups:', match);
}