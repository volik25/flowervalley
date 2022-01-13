export interface DaDataEntity {
  value: string;
  data: {
    inn: string;
    kpp: string;
    address: {
      unrestricted_value: string;
    };
    name: {
      full_with_opf: string;
      short_with_opf: string;
    };
  };
}
