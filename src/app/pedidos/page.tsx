
'use client';

import { useEffect, Suspense, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthContext } from '@/supabase/provider';
import { supabase } from '@/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, CreditCard, ChevronRight, Package, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

function PedidosContent() {
  const { user, loading: isUserLoading } = useAuthContext();
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const currentLocale = language === 'es' ? es : enUS;

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast({ title: t('auth.successLoginTitle') || '¡Éxito!', description: 'Tu reserva ha sido procesada con éxito.' });
    }
  }, [searchParams, toast, t]);

  useEffect(() => {
    if (!user) { setIsOrdersLoading(false); return; }
    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('order_date', { ascending: false });
      if (data) setOrders(data);
      setIsOrdersLoading(false);
    };
    fetchOrders();
  }, [user]);

  const pendingOrders = useMemo(() => 
    orders.filter(o => ['pending', 'processing', 'scheduled'].includes(o.status)),
    [orders]
  );

  const completedOrders = useMemo(() => 
    orders.filter(o => ['delivered', 'cancelled'].includes(o.status)),
    [orders]
  );

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-40 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">{t('appointments.noAuth')}</h1>
        <p className="text-gray-500 mb-8">Inicia sesión para gestionar tus citas.</p>
      </div>
    );
  }

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statusLabel: Record<string, { label: string; color: string }> = {
    paid:      { label: 'PAGADO',   color: 'bg-blue-100 text-blue-700' },
    scheduled: { label: 'AGENDADO', color: 'bg-green-100 text-green-700' },
    delivered: { label: 'COMPLETADO', color: 'bg-gray-100 text-gray-600' },
    cancelled: { label: 'CANCELADO', color: 'bg-red-100 text-red-700' },
  };

  const OrderCard = ({ order }: { order: any }) => {
    const st = statusLabel[order.status] || { label: order.status?.toUpperCase() || 'PENDIENTE', color: 'bg-accent/20 text-accent' };
    return (
      <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="bg-primary/5 p-6 md:w-48 flex flex-col items-center justify-center border-r border-white">
            <div className="bg-white rounded-full p-3 mb-3 shadow-sm">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
              {format(new Date(order.order_date), 'MMM d, yyyy', { locale: currentLocale })}
            </p>
            <p className="text-xs font-bold text-primary mt-1">
              {format(new Date(order.order_date), 'h:mm a')}
            </p>
          </div>
          <CardContent className="p-6 flex-grow">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Código: {order.reservation_code || 'N/A'}</p>
                <h3 className="text-xl font-bold font-headline">{t('appointments.details')}</h3>
              </div>
              <Badge className={cn("rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest", st.color)}>
                {st.label}
              </Badge>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">${(order.total_amount || 0).toLocaleString()} MXN</span>
              </div>
              {order.reservation_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-bold text-primary">
                    Cita: {new Date(order.reservation_date).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 md:flex items-center justify-center bg-gray-50/50">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full group-hover:bg-primary group-hover:text-white transition-all"
              onClick={() => setSelectedOrder(order)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  // Detail Modal
  const DetailModal = () => {
    if (!selectedOrder) return null;
    const st = statusLabel[selectedOrder.status] || { label: selectedOrder.status?.toUpperCase(), color: 'bg-accent/20 text-accent' };
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedOrder(null)}>
        <div
          className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-300 space-y-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-headline">Detalle de Cita</h2>
            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">✕</button>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Estado</span>
              <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest", st.color)}>{st.label}</Badge>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Código de reserva</span>
              <span className="font-bold text-primary tracking-widest">{selectedOrder.reservation_code || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Correo</span>
              <span className="font-semibold">{selectedOrder.customer_email || '—'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Total pagado</span>
              <span className="font-bold">${(selectedOrder.total_amount || 0).toLocaleString()} {selectedOrder.currency?.toUpperCase() || 'MXN'}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Fecha de compra</span>
              <span className="font-semibold">{new Date(selectedOrder.order_date).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</span>
            </div>
            {selectedOrder.reservation_date && (
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Cita agendada</span>
                <span className="font-bold text-green-700">{new Date(selectedOrder.reservation_date).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}</span>
              </div>
            )}
            {!selectedOrder.reservation_date && (
              <div className="pt-2">
                <a href="/reservar" className="block w-full text-center py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                  📅 Agendar mi cita ahora
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className="max-w-screen-lg mx-auto px-4 py-20 sm:py-32">
      <DetailModal />
      {searchParams.get('status') === 'success' && (
        <div className="mb-12 p-8 rounded-[2.5rem] bg-green-50 border border-green-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
          <div className="bg-white rounded-full p-4 mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold font-headline text-green-800 mb-2">¡Ritual Confirmado!</h2>
          <p className="text-green-600 italic">Hemos recibido tu pago con éxito. Tu alma te lo agradecerá.</p>
        </div>
      )}

      <div className="text-center mb-12">
        <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">{t('appointments.subtitle')}</p>
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-900">{t('appointments.title')}</h1>
        <p className="text-muted-foreground mt-4 italic">"{t('appointments.desc')}"</p>
      </div>

      {isOrdersLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12 h-14 p-1 rounded-full bg-secondary/30">
            <TabsTrigger value="upcoming" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-white data-[state=active]:shadow-md">
              {t('appointments.upcoming')}
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-full font-bold tracking-widest text-xs uppercase data-[state=active]:bg-white data-[state=active]:shadow-md">
              {t('appointments.history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="animate-in fade-in duration-500">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <Package className="w-16 h-16 mx-auto text-gray-200 mb-6" />
                <p className="text-gray-500 mb-8">{t('appointments.noUpcoming')}</p>
                <Button asChild className="btn-primary"><Link href="/servicios">{t('appointments.bookNow')}</Link></Button>
              </div>
            ) : (
              pendingOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="history" className="animate-in fade-in duration-500">
            {completedOrders.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <Package className="w-16 h-16 mx-auto text-gray-200 mb-6" />
                <p className="text-gray-500">{t('appointments.noHistory')}</p>
              </div>
            ) : (
              completedOrders.map(order => <OrderCard key={order.id} order={order} />)
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default function PedidosPage() {
  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <Suspense fallback={<div className="flex items-center justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
        <PedidosContent />
      </Suspense>
      <Footer />
    </main>
  );
}
