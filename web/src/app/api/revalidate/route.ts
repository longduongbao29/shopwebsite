import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

// Secret key để authenticate webhook calls
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-secret-key';

export async function POST(req: NextRequest) {
    try {
        // Kiểm tra authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { type, tags, paths } = body;

        switch (type) {
            case 'revalidate-tags':
                // Revalidate specific cache tags
                if (tags && Array.isArray(tags)) {
                    for (const tag of tags) {
                        revalidateTag(tag);
                    }
                    return NextResponse.json({
                        message: `Revalidated tags: ${tags.join(', ')}`,
                        revalidated: true,
                        now: Date.now()
                    });
                }
                break;

            case 'revalidate-paths':
                // Revalidate specific paths
                if (paths && Array.isArray(paths)) {
                    for (const path of paths) {
                        revalidatePath(path);
                    }
                    return NextResponse.json({
                        message: `Revalidated paths: ${paths.join(', ')}`,
                        revalidated: true,
                        now: Date.now()
                    });
                }
                break;

            case 'revalidate-all-products':
                // Revalidate tất cả product-related cache
                revalidateTag('products');
                revalidateTag('product');
                revalidateTag('ratings');
                revalidatePath('/products');
                revalidatePath('/');

                return NextResponse.json({
                    message: 'Revalidated all product caches',
                    revalidated: true,
                    now: Date.now()
                });

            case 'revalidate-product':
                // Revalidate cache cho một product cụ thể
                const { productId } = body;
                if (productId) {
                    revalidateTag(`product-${productId}`);
                    revalidateTag(`rating-${productId}`);
                    revalidatePath(`/products/${productId}`);

                    return NextResponse.json({
                        message: `Revalidated product ${productId}`,
                        revalidated: true,
                        now: Date.now()
                    });
                }
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid revalidation type' },
                    { status: 400 }
                );
        }

        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint để test webhook
export async function GET() {
    return NextResponse.json({
        message: 'Revalidation webhook endpoint is active',
        endpoints: {
            'POST /api/revalidate': {
                description: 'Revalidate cache based on type',
                auth: 'Bearer token required',
                types: [
                    'revalidate-tags',
                    'revalidate-paths',
                    'revalidate-all-products',
                    'revalidate-product'
                ]
            }
        }
    });
}
