import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verifica se as credenciais do Cloudinary estão configuradas
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary não configurado. Configure as variáveis de ambiente.' },
        { status: 500 }
      );
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const isVideo = file.type.startsWith('video/');

        const result = await uploadToCloudinary(buffer, {
          folder: 'depenados/media',
          resourceType: isVideo ? 'video' : 'image',
        });

        return {
          id: result.public_id,
          url: result.secure_url,
          type: isVideo ? 'video' : 'image',
          originalName: file.name,
          width: result.width,
          height: result.height,
        };
      })
    );

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    );
  }
}
