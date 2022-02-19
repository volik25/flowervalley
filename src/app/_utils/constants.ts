import { OrderStatus } from './order-status.enum';

export const tokenKey = 'flowerValley.token';
export const refreshTokenKey = 'flowerValley.refreshToken';

export const categoriesKey = 'categories';

export const responsiveOptions = [
  {
    breakpoint: '1230px',
    numVisible: 3,
    numScroll: 3,
  },
  {
    breakpoint: '1024px',
    numVisible: 1,
    numScroll: 1,
  },
];

export const statusOptions: { name: string; value: OrderStatus }[] = [
  {
    name: 'Новый',
    value: OrderStatus.New,
  },
  {
    name: 'В обработке',
    value: OrderStatus.In_Process,
  },
  {
    name: 'В сборке',
    value: OrderStatus.In_Assembly,
  },
  {
    name: 'Готов к выдаче',
    value: OrderStatus.Ready,
  },
  {
    name: 'В доставке',
    value: OrderStatus.In_Delivery,
  },
  {
    name: 'Выполнен',
    value: OrderStatus.Completed,
  },
  {
    name: 'Отменен',
    value: OrderStatus.Canceled,
  },
  {
    name: 'Закрыт',
    value: OrderStatus.Closed,
  },
];

export function getOrderStatus(status: OrderStatus): { label: string; severity: string } {
  switch (status) {
    case OrderStatus.New:
      return {
        label: 'Новый',
        severity: 'primary',
      };
    case OrderStatus.In_Process:
      return {
        label: 'В обработке',
        severity: 'info',
      };
    case OrderStatus.In_Assembly:
      return {
        label: 'В сборке',
        severity: 'info',
      };
    case OrderStatus.Ready:
      return {
        label: 'Готов к выдаче',
        severity: 'warning',
      };
    case OrderStatus.In_Delivery:
      return {
        label: 'В доставке',
        severity: 'warning',
      };
    case OrderStatus.Completed:
      return {
        label: 'Выполнен',
        severity: 'success',
      };
    case OrderStatus.Canceled:
      return {
        label: 'Отменен',
        severity: 'danger',
      };
    case OrderStatus.Closed:
      return {
        label: 'Закрыт',
        severity: 'danger',
      };
  }
}
