import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AppComponent } from './app.component';
import { PicsUploadComponent } from './pics-upload/pics-upload.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SuccessfulregisterComponent } from './successfulregister/successfulregister.component';
import { LogoutComponent } from './logout/logout.component';
import { AdUploadComponent } from './ad-upload/ad-upload.component';
import { MyadsComponent } from './myads/myads.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { SuccessfulupdateComponent } from './successfulupdate/successfulupdate.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { ModifyImagesComponent } from './modify-images/modify-images.component';
import { DeleteProductComponent } from './delete-product/delete-product.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EmailverifiedComponent } from './emailverified/emailverified.component';

export const routes: Routes = [
    { path: "products", component: ProductListComponent},
    { path: 'pics_upload', component: PicsUploadComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'ad_upload', component: AdUploadComponent},
    { path: 'myads', component: MyadsComponent},
    { path: 'successfulregister', component: SuccessfulregisterComponent},
    { path: 'successfulupdate', component: SuccessfulupdateComponent},
    { path: 'product/:id', component: ProductDetailComponent},
    { path: 'modify-product/:id', component: ModifyProductComponent},
    { path: 'modify-images/:id', component: ModifyImagesComponent },
    { path: 'delete-product/:id', component: DeleteProductComponent },
    { path: 'favourites', component: FavouritesComponent },
    { path: '', component: ProductListComponent },
    { path: 'adminpage', component: AdminpageComponent},
    { path: 'email-verified', component: EmailverifiedComponent },
    { path: 'change-password', component: ChangePasswordComponent},
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
