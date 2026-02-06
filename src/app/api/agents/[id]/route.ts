import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAgent, updateAgent, deleteAgent } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const agent = await getAgent(id, user.id);

    if (!agent) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    await updateAgent(id, user.id, body);
    return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteAgent(id, user.id);
    return NextResponse.json({ ok: true });
}
