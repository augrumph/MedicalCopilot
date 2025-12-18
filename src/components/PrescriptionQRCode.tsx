import React, { memo, useMemo} from'react';
import { QRCodeSVG} from'qrcode.react';

interface PrescriptionQRCodeProps {
 prescriptionId: string;
 type?:'regular' |'controlled';
}

const PrescriptionQRCode: React.FC<PrescriptionQRCodeProps> = ({ 
 prescriptionId, 
 type ='regular' 
}) => {
 // Memoize the QR code value to prevent unnecessary re-renders
 const qrValue = useMemo(() => {
 const baseUrl ='https://minha-plataforma.com/verificar';
 const id = type ==='controlled' 
 ? `CT-${new Date().getFullYear()}-${prescriptionId}` 
 : prescriptionId;
 return `${baseUrl}/${id}`;
}, [prescriptionId, type]);

 return (
 <QRCodeSVG
 value={qrValue}
 size={72}
 level="H"
 includeMargin={false}
 />
 );
};

export default memo(PrescriptionQRCode);