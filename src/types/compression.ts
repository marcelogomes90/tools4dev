export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'gif';

export interface PdfCompressionResult {
    success: boolean;
    originalSize: number;
    compressedSize: number;
    file: Buffer;
    method: 'pdf-lib';
    message?: string;
}

export interface ImageCompressionResult {
    success: boolean;
    originalSize: number;
    compressedSize: number;
    format: ImageFormat;
    file: Buffer;
    operation: 'compress' | 'convert' | 'resize';
    width?: number;
    height?: number;
    message?: string;
}
