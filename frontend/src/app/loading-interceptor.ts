import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from './shared/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // 🔹 Ha az URL tartalmazza a toggle végpontot, kihagyjuk
  const skipUrls = ['/api/favourites/toggle'];
  const skipLoader = skipUrls.some(url => req.url.includes(url));

  if (!skipLoader) {
    loadingService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoader) {
        loadingService.hide();
      }
    })
  );
};
