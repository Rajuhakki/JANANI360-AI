import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeGeneratorProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
}

/**
 * Real 2D Matrix QR Code Generator for JANANI360 AI
 * Generates an authentic, high-resolution SVG barcode that can be scanned by any standard mobile camera or QR code scanner to reveal real maternal ID and clinical acknowledgement data.
 */
export const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({
  value,
  size = 180,
  fgColor = '#0f172a',
  bgColor = '#ffffff',
  className = ''
}) => {
  return (
    <div
      className={`inline-block p-2 rounded-xl bg-white shadow-md flex items-center justify-center ${className}`}
      style={{ width: size + 16, height: size + 16 }}
    >
      <QRCodeSVG
        value={value}
        size={size}
        fgColor={fgColor}
        bgColor={bgColor}
        level="M"
        includeMargin={false}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
