import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const REDMINE_URL = process.env.NEXT_PUBLIC_REDMINE_BASE_URL || 'https://redmine.famishare.jp';
const REDMINE_API_KEY = process.env.NEXT_PUBLIC_REDMINE_API_KEY || '';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = `${REDMINE_URL}/${path.join('/')}`;
    const searchParams = request.nextUrl.searchParams;

    try {
        const response = await axios.get(url, {
            params: searchParams,
            headers: {
                'X-Redmine-API-Key': REDMINE_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Redmine API Error:', error.message);
        return NextResponse.json(
            { error: error.message },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = `${REDMINE_URL}/${path.join('/')}`;
    const body = await request.json();

    try {
        const response = await axios.post(url, body, {
            headers: {
                'X-Redmine-API-Key': REDMINE_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Redmine API Error:', error.message);
        return NextResponse.json(
            { error: error.message },
            { status: error.response?.status || 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const url = `${REDMINE_URL}/${path.join('/')}`;
    const body = await request.json();

    try {
        const response = await axios.put(url, body, {
            headers: {
                'X-Redmine-API-Key': REDMINE_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Redmine API Error:', error.message);
        return NextResponse.json(
            { error: error.message },
            { status: error.response?.status || 500 }
        );
    }
}
