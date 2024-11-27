import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsPageModule)
  },
  {
    path: 'print',
    loadChildren: () => import('./print/print.module').then(m => m.PrintPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUSPageModule)
  },
  {
    path: 'pay-ura',
    loadChildren: () => import('./pay-ura/pay-ura.module').then(m => m.PayUraPageModule)
  },
  {
    path: 'pay-umeme',
    loadChildren: () => import('./pay-umeme/pay-umeme.module').then(m => m.PayUMEMEPageModule)
  },
  {
    path: 'pay-nwsc',
    loadChildren: () => import('./pay-nwsc/pay-nwsc.module').then(m => m.PayNWSCPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsPageModule)
  },
  {
    path: 'pay-airtime',
    loadChildren: () => import('./pay-airtime/pay-airtime.module').then(m => m.PayAirtimePageModule)
  },
  {
    path: 'pay-data',
    loadChildren: () => import('./pay-data/pay-data.module').then(m => m.PayDataPageModule)
  },
  {
    path: 'pay-tv',
    loadChildren: () => import('./pay-tv/pay-tv.module').then(m => m.PayTvPageModule)
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountPageModule)
  },
  {
    path: 'pay-float',
    loadChildren: () => import('./pay-float/pay-float.module').then(m => m.PayFloatPageModule)
  },
  {
    path: 'reset-paassword',
    loadChildren: () => import('./reset-paassword/reset-paassword.module').then( m => m.ResetPaasswordPageModule)
  },
  {
    path: 'transfer-float',
    loadChildren: () => import('./transfer-float/transfer-float.module').then(m => m.TransferFloatPageModule)
  },
  {
    path: 'redeem-float',
    loadChildren: () => import('./redeem-float/redeem-float.module').then(m => m.RedeemFloatPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
