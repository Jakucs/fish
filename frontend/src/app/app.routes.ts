import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { AppComponent } from './app.component';
import { PicsUploadComponent } from './pics-upload/pics-upload.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    { path: "products", component: ProductListComponent},
    { path: 'pics_upload', component: PicsUploadComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: '', component: ProductListComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
