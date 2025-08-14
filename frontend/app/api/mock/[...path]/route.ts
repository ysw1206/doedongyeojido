import { NextRequest, NextResponse } from 'next/server';
import { getMockDataPath, getMockDelay } from '@/services/mock-interceptor';
import fs from 'fs';
import path from 'path';

/**
 * 동적 모킹 API 라우트 핸들러
 * /api/mock/* 경로로 들어오는 요청을 처리하여 모킹 데이터를 반환
 */

async function handleMockRequest(
  request: NextRequest,
  params: { path: string[] }
): Promise<NextResponse> {
  const method = request.method;
  const mockPath = `/${params.path.join('/')}`;
  
  console.log(`🎭 Mock API Request: ${method} ${mockPath}`);

  try {
    // 모킹 데이터 파일 경로 가져오기
    const dataFilePath = getMockDataPath(mockPath, method);
    if (!dataFilePath) {
      console.log(`❌ No mock data found for: ${method} ${mockPath}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Mock data not found',
          message: `No mock configuration found for ${method} ${mockPath}`
        },
        { status: 404 }
      );
    }

    // 지연 시간 적용
    const delay = getMockDelay(mockPath, method);
    if (delay > 0) {
      console.log(`⏱️ Applying delay: ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 모킹 데이터 파일 읽기
    const fullPath = path.join(process.cwd(), dataFilePath);
    console.log(`📁 Reading mock data from: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
      console.log(`❌ Mock data file not found: ${fullPath}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Mock data file not found',
          message: `Mock data file does not exist: ${dataFilePath}`
        },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const mockData = JSON.parse(fileContent);

    // POST, PUT 요청의 경우 요청 본문 로깅
    if (method === 'POST' || method === 'PUT') {
      try {
        const body = await request.json();
        console.log(`📝 Request body:`, body);
        
        // 동적으로 응답 데이터에 요청 데이터 반영 (옵션)
        if (mockData.data && typeof mockData.data === 'object') {
          mockData.data = { ...mockData.data, ...body };
        }
      } catch (error) {
        console.log('📝 Could not parse request body:', error);
      }
    }

    console.log(`✅ Mock response:`, mockData);
    return NextResponse.json(mockData);

  } catch (error) {
    console.error(`❌ Mock API Error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Failed to process mock request'
      },
      { status: 500 }
    );
  }
}

// HTTP 메소드별 핸들러 함수들
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleMockRequest(request, params);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleMockRequest(request, params);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleMockRequest(request, params);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleMockRequest(request, params);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleMockRequest(request, params);
}