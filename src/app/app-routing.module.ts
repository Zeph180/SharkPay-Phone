import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './sharkServices/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'print',
    loadChildren: () => import('./print/print.module').then(m => m.PrintPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUSPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-ura',
    loadChildren: () => import('./pay-ura/pay-ura.module').then(m => m.PayUraPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-umeme',
    loadChildren: () => import('./pay-umeme/pay-umeme.module').then(m => m.PayUMEMEPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-nwsc',
    loadChildren: () => import('./pay-nwsc/pay-nwsc.module').then(m => m.PayNWSCPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-airtime',
    loadChildren: () => import('./pay-airtime/pay-airtime.module').then(m => m.PayAirtimePageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-data',
    loadChildren: () => import('./pay-data/pay-data.module').then(m => m.PayDataPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-tv',
    loadChildren: () => import('./pay-tv/pay-tv.module').then(m => m.PayTvPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'pay-float',
    loadChildren: () => import('./pay-float/pay-float.module').then(m => m.PayFloatPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'reset-paassword',
    loadChildren: () => import('./reset-paassword/reset-paassword.module').then( m => m.ResetPaasswordPageModule)
    // , canActivate: [AuthGuard]
  },
  {
    path: 'transfer-float',
    loadChildren: () => import('./transfer-float/transfer-float.module').then(m => m.TransferFloatPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'redeem-float',
    loadChildren: () => import('./redeem-float/redeem-float.module').then(m => m.RedeemFloatPageModule)
    , canActivate: [AuthGuard]
  },
  {
    path: 'commission-transactions',
    loadChildren: () => import('./commission-transactions/commission-transactions.module').then( m => m.CommissionTransactionsPageModule)
    , canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
