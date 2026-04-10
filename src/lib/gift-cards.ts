export type GiftCardTemplateId =
  | 'mama-horizontal-con'
  | 'mama-horizontal-sin'
  | 'papa-horizontal-con'
  | 'papa-horizontal-sin'
  | 'general-horizontal-con'
  | 'general-horizontal-sin'
  | 'vertical-1'
  | 'vertical-2';

export interface TextPosition {
  top: string;
  left: string;
  width?: string;
  fontSize: string;
  color: string;
  align?: 'left' | 'center' | 'right';
  fontWeight?: string;
  lineHeight?: string;
  useTopAlignment?: boolean;
}

export interface GiftCardTemplate {
  id: GiftCardTemplateId;
  name: string;
  imagePath: string;
  aspectRatio: number; // width / height
  orientation: 'horizontal' | 'vertical';
  positions: {
    recipient: TextPosition;
    sender: TextPosition;
    amount: TextPosition;
    message: TextPosition;
    message2: TextPosition;
    code: TextPosition;
  };
  hasMessageOverlay: boolean;
  showCurrencySymbol?: boolean;
}

export const GIFT_CARD_TEMPLATES: Record<GiftCardTemplateId, GiftCardTemplate> = {
  'mama-horizontal-con': {
    id: 'mama-horizontal-con',
    name: 'Para Mamá — Con Detalle',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para mama con texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '58.2%', left: '58.5%', width: '44%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '68%', left: '58.5%', width: '42%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '47%', left: '70.8%', width: '40%', fontSize: '18.5px', color: '#fee6c2', fontWeight: '400', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '88.2%', left: '14.6%', width: '75%', fontSize: '20px', color: '#043e05', fontWeight: '600', lineHeight: '1.6', useTopAlignment: false },
    message2:  { top: '93%', left: '14%', width: '76%', fontSize: '15px', color: '#043e05', fontWeight: '600', lineHeight: '1.8', useTopAlignment: false },
    code:      { top: '6.2%', left: '42%', width: '21%', fontSize: '13.5px', color: '#000000', fontWeight: '700', lineHeight: '1.6', useTopAlignment: false },
  },
    hasMessageOverlay: true,
  },
  'mama-horizontal-sin': {
    id: 'mama-horizontal-sin',
    name: 'Para Mamá — Versión Limpia',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para mama sin texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '74.1%', left: '26.9%', width: '64%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '87.5%', left: '26.9%', width: '50%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '56%', left: '65.6%', width: '44%', fontSize: '18px', color: '#1F3D2B', fontWeight: '700', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '55%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    message2:  { top: '60%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    code:      { top: '98.3%', left: '42.3%', width: '26%', fontSize: '12px', color: '#1A4331', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
  },
    hasMessageOverlay: false,
  },
  'papa-horizontal-con': {
    id: 'papa-horizontal-con',
    name: 'Para Papá — Con Detalle',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para papa con texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '58.2%', left: '58.5%', width: '44%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '68%', left: '58.5%', width: '42%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '47%', left: '70.8%', width: '40%', fontSize: '18.5px', color: '#fee6c2', fontWeight: '400', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '88.2%', left: '14.6%', width: '75%', fontSize: '20px', color: '#043e05', fontWeight: '600', lineHeight: '1.6', useTopAlignment: false },
    message2:  { top: '93%', left: '14%', width: '76%', fontSize: '15px', color: '#043e05', fontWeight: '600', lineHeight: '1.8', useTopAlignment: false },
    code:      { top: '6.2%', left: '42%', width: '21%', fontSize: '13.5px', color: '#000000', fontWeight: '700', lineHeight: '1.6', useTopAlignment: false },
  },
    hasMessageOverlay: true,
  },
  'papa-horizontal-sin': {
    id: 'papa-horizontal-sin',
    name: 'Para Papá — Versión Limpia',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para papa sin texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '74.1%', left: '26.9%', width: '64%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '87.5%', left: '26.9%', width: '50%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '56%', left: '65.6%', width: '44%', fontSize: '18px', color: '#1F3D2B', fontWeight: '700', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '55%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    message2:  { top: '60%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    code:      { top: '98.3%', left: '42.3%', width: '26%', fontSize: '12px', color: '#1A4331', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
  },
    hasMessageOverlay: false,
  },
  'general-horizontal-con': {
    id: 'general-horizontal-con',
    name: 'Para Ti — Con Detalle',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para ti con texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '58.2%', left: '58.5%', width: '44%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '68%', left: '58.5%', width: '42%', fontSize: '15.5px', color: '#1f4820', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '47%', left: '70.8%', width: '40%', fontSize: '18.5px', color: '#fee6c2', fontWeight: '400', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '88.2%', left: '14.6%', width: '75%', fontSize: '20px', color: '#043e05', fontWeight: '600', lineHeight: '1.6', useTopAlignment: false },
    message2:  { top: '93%', left: '14%', width: '76%', fontSize: '15px', color: '#043e05', fontWeight: '600', lineHeight: '1.8', useTopAlignment: false },
    code:      { top: '6.2%', left: '42%', width: '21%', fontSize: '13.5px', color: '#000000', fontWeight: '700', lineHeight: '1.6', useTopAlignment: false },
  },
    hasMessageOverlay: true,
  },
  'general-horizontal-sin': {
    id: 'general-horizontal-sin',
    name: 'Para Ti — Versión Limpia',
    imagePath: '/assets/gift-cards/tarjeta de regalo horizontal/Tarjeta de regalo para ti sin texto de detalle.png',
    aspectRatio: 1.5,
    orientation: 'horizontal',
    positions: {
    recipient: { top: '74.1%', left: '26.9%', width: '64%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '87.5%', left: '26.9%', width: '50%', fontSize: '20px', color: '#261203', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '56%', left: '65.6%', width: '44%', fontSize: '18px', color: '#1F3D2B', fontWeight: '700', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '55%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    message2:  { top: '60%', left: '55%', width: '40%', fontSize: '13px', color: '#4a5568', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    code:      { top: '98.3%', left: '42.3%', width: '26%', fontSize: '12px', color: '#1A4331', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
  },
    hasMessageOverlay: false,
  },
  'vertical-1': {
    id: 'vertical-1',
    name: 'Vertical — Diseño 1',
    imagePath: '/assets/gift-cards/tarjeta de regalo por ocacion especial/tarjeta_clasica_corregida.jpg',
    aspectRatio: 0.75,
    orientation: 'vertical',
    positions: {
    recipient: { top: '66.2%', left: '38.2%', width: '70%', fontSize: '19px', color: '#2e4d41', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '72.4%', left: '38.9%', width: '70%', fontSize: '19px', color: '#2e4d41', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '78.6%', left: '58.8%', width: '70%', fontSize: '23px', color: '#000000', fontWeight: '400', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '85.3%', left: '53.2%', width: '60%', fontSize: '13px', color: '#2e4d41', fontWeight: '400', lineHeight: '1.4', useTopAlignment: false },
    message2:  { top: '89.9%', left: '15.7%', width: '88%', fontSize: '13.5px', color: '#2e4d41', fontWeight: '400', lineHeight: '1.4', useTopAlignment: true },
    code:      { top: '31.2%', left: '52.4%', width: '70%', fontSize: '26px', color: '#053d06', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
  },
    hasMessageOverlay: true,
    showCurrencySymbol: false,
  },
  'vertical-2': {
    id: 'vertical-2',
    name: 'Vertical — Diseño 2',
    imagePath: '/assets/gift-cards/tarjeta de regalo por ocacion especial/tarjeta de regalo 2.png?v=update1',
    aspectRatio: 0.75,
    orientation: 'vertical',
    positions: {
    recipient: { top: '70.7%', left: '43.4%', width: '70%', fontSize: '14.5px', color: '#2e4d41', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    sender:    { top: '75.9%', left: '43.4%', width: '70%', fontSize: '14.5px', color: '#2e4d41', fontWeight: '800', lineHeight: '1.2', useTopAlignment: false },
    amount:    { top: '81.1%', left: '63.7%', width: '70%', fontSize: '15px', color: '#1E362A', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
    message:   { top: '86.3%', left: '57.3%', width: '70%', fontSize: '8.5px', color: '#355245', fontWeight: '800', lineHeight: '1.4', useTopAlignment: false },
    message2:  { top: '89.9%', left: '21.3%', width: '70%', fontSize: '11px', color: '#355245', fontWeight: '700', lineHeight: '1.4', useTopAlignment: true },
    code:      { top: '94.5%', left: '63.6%', width: '70%', fontSize: '14px', color: '#2A4438', fontWeight: '600', lineHeight: '1.2', useTopAlignment: false },
  },
    hasMessageOverlay: true,
    showCurrencySymbol: false,
  },
};
