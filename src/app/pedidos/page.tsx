'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useLanguage } from '@/context/LanguageContext';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Clock, CreditCard, ChevronRight, Package, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PedidosPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { t, language } = useLanguage();
  
  const currentLocale = language === 'es' ? es : enUS;

  const ordersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'userProfiles', user.uid, 'orders'),
      orderBy('orderDate', 'desc')
    );
  }, [db, user]);

  const { data: orders, isLoading: isOrdersLoading } = useCollection(ordersQuery);

  const pendingOrders = orders?.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)) || [];
  const completedOrders = orders?.filter(o => ['delivered', 'cancelled'].includes(o.status)) || [];

  if (isUserLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-screen-md mx-auto px-4 py-40 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">{t('appointments.noAuth')}</h1>
        </div>
        <Footer />
      </main>
    );
  }

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group mb-6">
      <div className="flex flex-col md:flex-row">
        <div className="bg-primary/5 p-6 md:w-48 flex flex-col items-center justify-center border-r border-white">
          <div className="bg-white rounded-full p-3 mb-3 shadow-sm">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
            {format(new Date(order.orderDate), 'MMM d, yyyy', { locale: currentLocale })}
          </p>
          <p className="text-xs font-bold text-primary mt-1">
            {format(new Date(order.orderDate), 'h:mm a')}
          </p>
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">ID: {order.id.slice(0, 8)}</p>
              <h3 className="text-xl font-bold font-headline">{t('appointments.details')}</h3>
            </div>
            <Badge className={cn(
              "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest",
              order.status === 'delivered' ? "bg-green-100 text-green-700" : 
              order.status === 'cancelled' ? "bg-red-100 text-red-700" : 
              "bg-accent/20 text-accent"
            )}>
              {t(`appointments.status.${order.status}`)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="font-semibold">${order.totalAmount.toLocaleString()} MXN</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="capitalize">{order.paymentStatus}</span>
            </div>
          </div>
        </CardContent>
        <div className="p-4 md:flex items-center justify-center bg-gray-50/50">
          <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background animate-in fade-in duration-1000">
      <Header />
      <div className="max-w-screen-lg mx-auto px-4 py-20 sm:py-32">
        <div className="text-center mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-bold mb-2">
            {t('appointments.subtitle')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-900">
            {t('appointments.title')}
          </h1>
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
                  <Button asChild className="btn-primary">
                    <Link href="/servicios">{t('appointments.bookNow')}</Link>
                  </Button>
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
      <Footer />
    </main>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
